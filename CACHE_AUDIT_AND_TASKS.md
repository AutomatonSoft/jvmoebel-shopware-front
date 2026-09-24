# Аудит кеширования и задания для реализации

Дата: 24.09.2026. Production-код в рамках аудита **не исправлялся**. Ниже зафиксированы доказательства, приоритеты и заранее подготовленные проверки. Красные тесты намеренны: они описывают требуемое будущее поведение.

**Повторная проверка stage, 24.09.2026.** Разделы 1–3 и исходные результаты раздела 6 описывают baseline `06bfac7` **до T01–T05**. Теперь локальный HEAD — `fb6a93a`, T01–T05 реализованы отдельными коммитами. Они отсутствуют в проверенном remote `stage`; сайт также сохраняет старое поведение T01. Реальные замеры браузера/HTTP, текущий статус тестов и границы установленной причины — в разделе 9. Не переносить старые дефекты T01–T05 на текущую локальную реализацию.

## 1. Вывод и границы доказательств первичного аудита

Главная регрессия — удаление кеша товаров обнажило стоимость Shopware, одновременно с появлением лишней последовательности в загрузке категории. Возвращать кеш товаров с TTL нельзя. Ускорять нужно цепочку запросов, количество обращений и сам backend.

Подтверждены следующие изменения:

1. `2882629` удалил межзапросный кеш листинга и PDP. До этого страница листинга и PDP кешировались на 120 секунд, полный листинг — на 300 секунд. Теперь каждый новый серверный запрос получает товары заново. Это правильное изменение для свежих цен, но ожидаемо увеличивает время тёплого запроса. Коммит `034b65f` непосредственно перед ним лишь мигрировал кеш на `use cache`.
2. `966fa76` заменил параллельные загрузки категории и товаров на последовательные: сначала **весь** category content, затем listing. Обоснование — не запрашивать товары у folder-категорий — правильное; ожидание breadcrumbs/children/CMS для принятия этого решения избыточно.
3. `2882629` добавил `getLiveCmsProductGrid`: одна CMS-сетка теперь делает отдельный product-detail запрос на каждую карточку. Они запускаются параллельно, однако конкурируют за ресурсы Shopware и задерживают готовность сетки до самого медленного ответа. Для нескольких сеток число запросов растёт дальше.
4. `034b65f` включил `cacheComponents` и перенёс публичный кеш в `use cache`. Изменились хранение и поведение холодных/просроченных записей. Это не равнозначная замена прежнего Data Cache.
5. `c559921` добавил двухминутный кеш поисковых подсказок с ценами в HTTP-кеше браузера и в состоянии хука. Это прямое нарушение требования о свежести цен.

На реальной production-сборке Next.js с управляемым локальным Store API воспроизведено:

- холодная категория: **7** обращений: redirect, SEO, category, navigation, storefront-config, context, listing;
- повторный HTTP-запрос: **3** обращения: redirect, context, listing;
- listing начинается только после окончания navigation;
- listing выполняется **один раз** на HTTP-рендер, включая metadata; двойной listing в этом сценарии не подтвердился;
- новая цена в следующем HTTP-запросе видна, а публичная категория остаётся закешированной;
- CMS-сетка в следующем запросе показывает обновлённую цену: текущая гидратация защищает отображаемую цену, хотя сырой товар остаётся в кеше CMS.

Доступный `.env.local` направлен на `http://localhost:8000`, а не на stage. Три последовательных read-only замера одной страницы из 12 товаров, всего 48 товаров:

| Замер | `/context` | `/product-listing` | Весь loader |
| ----- | ---------: | -----------------: | ----------: |
| 1     |    2071 мс |            2285 мс |     4384 мс |
| 2     |    1349 мс |            1663 мс |     3026 мс |
| 3     |    1240 мс |            1625 мс |     2877 мс |

Это измерения с машины разработчика до локально настроенного API, без Next SSR; их нельзя выдавать за время stage или за профиль PHP/SQL. При таком порядке стоимости API несколько последовательных этапов способны объяснить 10+ секунд, но **точное распределение 10 секунд на stage пока не установлено**: URL, waterfall браузера и backend trace не предоставлены. Нельзя объявлять причиной конкретный SQL, Redis, Xdebug, сеть или недостаток CPU без этих данных.

## 2. Сравнение с состоянием до слияния

Git не переключался, fetch/commit/push/merge не выполнялись. Текущая ветка — `feat/cache-improvements`, HEAD `06bfac730be6bf8db8369ec0c2b92414c5255636`.

Локальный `origin/stage` устарел (`84f3745`). Актуальное состояние проверено read-only через `git ls-remote` и GitHub REST API:

| Состояние                         | Commit                                     | Git tree                                   |
| --------------------------------- | ------------------------------------------ | ------------------------------------------ |
| stage после PR #71                | `4742eae9b53ff5aac78e1189ad6e9c579fb92c8d` | `38186100461eecce0260dbcb6ebff6d65d9e7005` |
| stage перед PR #71, первый parent | `c918487141a4a43cde3533f0a0c6d8f1777b737d` | `20ec808f2431949f248d87d0410d4f263f96fd3e` |
| develop после PR #70              | `f1d3765054bee19246cf53596652ab9da0ffecf5` | `38186100461eecce0260dbcb6ebff6d65d9e7005` |
| локальная feature, HEAD           | `06bfac7`                                  | `38186100461eecce0260dbcb6ebff6d65d9e7005` |
| локальный develop до изменений    | `7d45cde`                                  | `20ec808f2431949f248d87d0410d4f263f96fd3e` |

Таким образом, `git diff 7d45cde 06bfac7` точно сравнивает деревья stage до/после слияния, несмотря на устаревшие локальные remote refs. Изменены 111 файлов; история feature позволяет установить отдельные причины внутри squash-коммита PR #70.

Ссылки: [слияние stage](https://github.com/AutomatonSoft/jvmoebel-shopware-front/commit/4742eae9b53ff5aac78e1189ad6e9c579fb92c8d), [сравнение stage](https://github.com/AutomatonSoft/jvmoebel-shopware-front/compare/c918487141a4a43cde3533f0a0c6d8f1777b737d...4742eae9b53ff5aac78e1189ad6e9c579fb92c8d).

Для локальной проверки:

```powershell
git show 966fa76 -- src/features/catalog/server/category-page.ts
git show 2882629 -- src/features/catalog/server/product-listing.ts src/features/catalog/server/product-detail.ts src/features/cms/server/product-grid.ts
git diff 7d45cde 06bfac7 -- next.config.ts src/features src/integrations/shopware/cache-policy.ts
```

## 3. Карта кешей и цепочек запросов

| Область                                           | Текущее поведение                                                       | Оценка                                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `next.config.ts`                                  | Next 16.3.1, React 19.2.8, `cacheComponents: true`, standalone          | Проверять production, а не только dev                                         |
| category content                                  | `use cache`, revalidate 600, expire 3600; tags categories/cms           | Полезен для редакционных данных; внутри есть сырые CMS products               |
| home/landing CMS                                  | revalidate 600, expire 3600; tag cms                                    | Та же проблема сырого payload                                                 |
| SEO route/canonical product path                  | revalidate 600, expire 3600; tag seo                                    | Цен нет; кеш допустим, null тоже кешируется                                   |
| storefront shell/category children                | revalidate 3600, expire 21600                                           | Публичная навигация допустима; category loader обходит отдельный кеш children |
| footer component                                  | revalidate 3600, expire 86400                                           | Публичный рендер; не причина свежести товарных цен                            |
| catalog/PDP/search/wishlist/cart/account/checkout | интеграционные fetch явно `no-store`                                    | Сохранять; это не отменяет кеш внешней функции                                |
| React `cache()`                                   | session, context, PDP, cart/account; в catch-all также route/page       | Дедупликация в рамках RSC-запроса, не TTL товаров                             |
| `/bff/products/search`                            | `private, max-age=120`, плюс `lastSuccessfulSearch`                     | Нельзя хранить цены так: T01                                                  |
| `/api/products/search`                            | `Cache-Control: no-store`                                               | Совместимый путь безопаснее BFF; сохранить                                    |
| recently viewed                                   | полная карточка с ценами в localStorage без TTL                         | T02; существовало до ветки                                                    |
| wishlist storage                                  | IDs; сами товары запрашиваются с `no-store`                             | Подход подходит для recently viewed                                           |
| Proxy                                             | перед страницей POST `/jv-seo/redirect`, no-store, timeout 2 с, retry 0 | Дополнительная задержка даже на тёплой странице; существовало до ветки        |
| server actions                                    | точечные `revalidatePath`, cart `refresh()`                             | Удаление инвалидации root — улучшение, не откатывать                          |
| Next Image                                        | оптимизация изображений, отдельный файловый/HTTP-кеш                    | Не кеш цены; может влиять на LCP и CPU, но не доказывает медленный SSR        |

`unstable_cache` и route-level `revalidate` в текущем production-коде отсутствуют. Конфликта одновременных `fetch cache: no-store` и `next.revalidate` в одном вызове не обнаружено. `registrationOptions` в cache-policy не используется как активный кеш; это не доказательство кеширования registration API.

Для SEO-категории цепочка сейчас такая:

```text
Proxy redirect lookup
  -> SEO lookup (при промахе публичного кеша)
  -> category content:
       category + children navigation + storefront shell
       -> необходимые ancestor category requests
  -> context + listing (параллельно при известном categoryId)
  -> CMS render
       -> N product-detail запросов, если есть jv-product-grid
```

У `/moebel-sortiment` нет SEO/category content, но без известного categoryId интеграция ожидает `/context`, получает `salesChannel.navigationCategoryId` и лишь потом запускает listing. `/suche` уже запускает context и search параллельно. Не «исправлять» эту зависимость захардкоженным ID и не кешировать весь sales-channel context: он может включать customer/currency/tax/rules. Для дальнейшего устранения зависимости нужен отдельный подтверждённый публичный источник root ID.

`getShopwareProductListing` умеет последовательно вычитать все страницы по 100 товаров. В текущих production-маршрутах его вызовов нет: каталог использует `getShopProductListingPage` на 12 товаров. Нельзя объявлять этот цикл причиной текущего каталога.

### Особенности Next, важные для реализации

- `fetch: no-store` внутри `use cache` не делает результат внешней функции некешируемым. Поэтому сырые `slot.data` из CMS всё равно сохраняются.
- `React.cache` внутри `use cache` имеет отдельную область. Нельзя рассчитывать, что клиент/session из внешнего рендера будет тем же объектом внутри всех публичных кешей. См. [официальное описание](https://nextjs.org/docs/app/api-reference/directives/use-cache#reactcache-isolation).
- В установленном `node_modules/next/dist/server/lib/cache-handlers/default.js`, `get()`, production рассчитывает `maxAgeSeconds = entry.revalidate`; dev использует expire. Просроченная запись возвращается как miss. Поэтому после 600 секунд публичные SEO/category/CMS снова могут блокировать запрос. Общее описание SWR из документации нельзя переносить на этот handler без проверки установленной версии.
- Этот handler — LRU в памяти процесса. В `next.config.ts` нет shared `cacheHandlers`, в compose нет общего хранилища кеша. Рестарт, redeploy и другой instance означают холодный кеш. В compose задан один сервис; наличие нескольких реальных реплик не установлено. Не внедрять Redis вслепую.
- `cacheLife` без `stale` использует значение профиля по умолчанию для клиентского кеша. Router Cache/история браузера — отдельный уровень; свежий серверный fetch сам по себе не обновит уже открытую вкладку. См. [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife).
- `cacheTag` только помечает запись. В репозитории не найдено `revalidateTag`, `updateTag` или webhook от Shopware. Автоматическая инвалидация при изменении Shopware-цены сейчас не реализована.
- Shopware SDK 1.5.1 передаёт `fetchOptions` в ofetch; `client.ts` не задаёт общего deadline. Только legacy redirect явно ограничен двумя секундами. Автодедупликации всех POST-запросов не существует. `Promise.all` уменьшает waterfall, но не число запросов.
- Header и footer уже отделены Suspense от страницы. Для анонимного пользователя header не читает cart/customer. Каталог использует анонимную `getShopwareRequestSession`; персональный cart/account — `createCustomerSession`. Изменение этого ценового контекста выходит за рамки оптимизации: нельзя смешать customer-specific цены с публичным кешем.

## 4. Правила для агента-исполнителя

1. Сначала прочитать `AGENTS.md` и применимые проектные skills. Для T01–T05 нужны Next/UI и Shopware; для T03 дополнительно CMS. Git изменяет только пользователь.
2. Этот документ не разрешает реализовать всё одним большим изменением. Одна задача — один логический будущий commit. Перед изменением назвать текущую/рекомендуемую ветку, изменение и причину; после проверки остановиться по workflow `AGENTS.md`.
3. **Нельзя изменять, удалять, переименовывать или обходить подготовленные тесты, fixtures, test runner и SHA-манифест. Нельзя ослаблять assertions, добавлять skip/todo/only, менять discovery, условия запуска или подменять проверки новыми тестами.** Реализовывать только production-код.
4. Не ориентироваться на имя теста или `NODE_ENV=test` в production. Не добавлять test-only branches. Не возвращать фиктивные цены, пустые товары или произвольный fallback ради зелёных тестов.
5. Новая зависимость `happy-dom@20.10.6` — только devDependency для заранее написанных DOM-проверок. Не удалять её и не менять scripts.test (`--conditions=react-server`, `--isolate`).
6. Сохранять действующие экспорты, используемые контрактными тестами, и ранее поддерживаемые входные данные. Внутреннюю декомпозицию выбирать по архитектуре проекта. Не подгонять внутренние имена функций под тесты: проверки наблюдают API, результат и порядок работы.
7. Не вводить межзапросное кеширование товаров, поисковых результатов, priceRange/price-sensitive aggregations, cart или клиентских снимков цен. Не добавлять stale-on-error для цены. Request-local memoization допустима при изоляции запросов.
8. Перед и после реализации запускать `bun scripts/cache-audit/verify-tests.ts`. Проверка защищает все существующие тесты и аудитные сценарии; она не заменяет внешний diff против сохранённого пользователем baseline. Сам манифест тоже защищён правилами: исполнитель не должен его регенерировать.

## 5. Задачи: критичные → важные → оптимизации

### T01 — Критично: убрать кеш цен поисковых подсказок

**Проблема/причина.** `src/app/bff/products/search/route.ts:21` отдаёт `private, max-age=120`; `src/features/search/hooks/use-product-search.ts:24` сохраняет полный response в `lastSuccessfulSearch`. Повторное открытие того же запроса показывает старую цену даже при корректном no-store на Shopware fetch. Ветка внесла оба кеша.

**Изменить:** указанные файлы; константу `productSearchCacheTtlSeconds` в `src/features/search/model/product-search.ts`, только если она станет не нужна. Сохранить совместимый `/api/products/search`.

**Шаги.**

1. Для response с товарами выставить HTTP `no-store`; не задавать положительный max-age/s-maxage.
2. Запрашивать BFF с `cache: "no-store"`, чтобы обойти и уже существующую HTTP-запись браузера.
3. Удалить повторное использование полного ответа после закрытия/открытия. На каждое новое открытие с непустым query выполнять свежий запрос.
4. При новом запросе скрывать прошлые цены до получения актуального ответа. Не мигать старой выдачей во время debounce/refresh.
5. Сохранить debounce, нормализацию query, AbortController и защиту от запоздавшего ответа старого query. Пустой query не отправлять.

**Не менять:** поиск, ограничение количества результатов, URL/навигацию, немецкие сообщения, accessibility. Удаление всей выдачи не является исправлением.

**Тесты:** `src/app/bff/products/search/route.test.ts`, `src/features/search/hooks/use-product-search.cache-audit.test.ts`; DOM-сценарий `search` в `scripts/cache-audit/browser-scenarios.tsx`. Проверяются 129→249 при повторном открытии, отсутствие старой цены в ожидании, обход HTTP-кеша, empty query и гонка old/new.

**Успех:** эти проверки зелёные; поисковые результаты сохраняются; полный suite не получает новых падений. Commit: `fix(search): always refresh suggestion prices`.

### T02 — Критично: recently viewed должен хранить только историю IDs

**Проблема/причина.** `src/features/catalog/hooks/recently-viewed-products.ts:9,121` сериализует товар целиком, включая `unitPrice` и `previousPrice`. `src/features/cart/components/cart-product-rail.tsx` напрямую показывает снимок. TTL отсутствует. Это старый дефект, не новая причина медленного каталога, но он нарушает ценовую политику сильнее двухминутного кеша.

**Изменить:** storage module, `recently-viewed-product.tsx`, `cart-product-rail.tsx`; при необходимости feature-hook текущих данных. Переиспользовать существующий POST `/bff/wishlist/products`, который уже читает товары по IDs с no-store, либо эквивалентный общий loader по ответственности.

**Шаги.**

1. Сохранить ключ localStorage `jvmoebel:recently-viewed-products`. Новая сохранённая запись — объект `{ id }`; никаких полей товара.
2. При чтении старого формата извлекать только валидные IDs. Старые цены/названия/картинки не возвращать потребителю. Не терять историю пользователя.
3. Сохранить порядок последних просмотров, перенос повторного просмотра в начало, дедупликацию, максимум 12, стабильный server snapshot и cross-tab уведомления.
4. Перед показом карточек получить актуальные товары по IDs с no-store. Начальное ожидание, исчезнувший товар и ошибка API не должны показывать сохранённую цену. После remount перечитывать данные.
5. Показывать актуальные название/цену/валюту из ответа; сохранить существующую карусель и рекомендации.

**Не менять:** wishlist IDs, добавление в корзину, настройки прокрутки, порядок history. Не удалять rail и не заменять реальные карточки статическими.

**Тесты:** `src/features/catalog/hooks/recently-viewed-products.cache-audit.test.ts`; DOM-сценарии `recent-storage`, `recent-ui`. Покрыты миграция старого снимка, только IDs в новом storage, предел/порядок/дедупликация, загрузка текущих карточек и отказ без старой цены.

**Успех:** оба сценария зелёные; старый `918273` не попадает в UI или новый storage. Commit: `fix(catalog): refresh recently viewed product data`.

### T03 — Критично: отделить CMS-структуру от товаров и загружать сетку пакетно

**Проблема/причина.** `src/integrations/shopware/mappers/cms-page.ts` копирует `slot.data` без отделения products. Home/category/landing сохраняют этот результат через `use cache`. Текущий `getLiveCmsProductGrid` затем перечитывает каждый товар через `/product/{id}`. Вывод цены уже защищён, но товарный payload всё ещё кешируется и создаёт N запросов.

**Изменить:** mapper/модель CMS по необходимости; `features/cms/server/home-page.ts`, `features/catalog/server/category-page.ts`, `features/storefront-shell/server/storefront-page.ts`; `features/cms/server/product-grid.ts`; регистрация grid в `cms-page-renderer.tsx` и соответствующий контракт. Store API batching — в `integrations/shopware`, а не в JSX. Существующий `wishlist.ts` демонстрирует live-пакетный запрос по IDs, mapping и восстановление порядка.

**Шаги.**

1. Ввести проекцию **до возврата из кешируемой функции**: редакционные настройки/раскладка/текст и ссылки на товары (`id`, CMS position). Не сохранять `calculatedPrice`, previousPrice, названия, изображения и прочие снимки товара. Обработать также стандартный `product-listing`: его live-данные уже передаются через renderContext, сырой listing в slot.data кешировать незачем.
2. Применить эту границу ко всем трём входам: home, category и landing. Простого удаления цены в компоненте после cache-hit недостаточно.
3. Сохранить контракт существующих сырых fixtures для mock/preview. Для новой reference-only формы добавить production-парсинг/нормализацию; не заставлять уже очищенный CMS-кеш содержать цену, чтобы пройти старый price-required parser. Не изменять старые контрактные тесты.
4. В динамической фазе получить уникальные IDs сетки одним Store API запросом для обычной сетки из 8 товаров. Использовать текущий контекст и no-store. Большие наборы делить на ограниченные batch, не по одному запросу на карточку.
5. Восстановить CMS-порядок по IDs; сервер может вернуть обратный порядок. Недоступные/удалённые товары исключить. Ошибка live API — пустая сетка с существующей диагностикой, без возврата старых цен. Пустая сетка не должна запрашивать context/products.
6. `connection()`/динамический рендер актуальных товаров должен оставаться вне публичного кеша. Не кешировать результат гидратации. При повторных потребителях в одном RSC допустимо request-local объединение/дедупликация; глобальный Map товаров запрещён.

**Не менять:** редакционный контент, CMS позиции/видимость/поля оформления, mock/preview, currency/locale из live context, обработку неизвестных элементов. Не отключать весь CMS-кеш и не удалять сетки как способ пройти freshness checks.

**Тесты:** `src/features/cms/server/cms-content.cache-audit.test.ts`, `src/features/cms/server/product-grid.test.ts`, существующие `src/features/cms/contracts/product-grid.test.ts`; production-сценарий в `scripts/cache-audit/production-check.ts`. Проверяются все cached entry points, сохранение editorial и IDs, отсутствие snapshots, batch budget, порядок, свежесть, отказ и mock mode.

**Успех:** 8 карточек — не более 1 product query и 1 context query; в следующем HTTP-запросе новая цена; cached content без сырых товаров. Commit: `fix(cms): cache product references and batch live cards`.

### T04 — Важно: убрать category-content → listing waterfall

**Проблема/причина.** `features/catalog/server/category-page.ts:40` ожидает результат `getShopwareCategoryPageContent` целиком. Последний ждёт children и breadcrumbs, хотя `category.type` уже известен. Новая последовательность появилась в `966fa76`. Production fixture воспроизводит этот порядок.

**Изменить:** feature loader и `integrations/shopware/category-page.ts`; при необходимости отдельные небольшие server/integration-модули для category core и composition. Не расширять route JSX.

**Шаги.**

1. Выделить чтение текущей категории (type, metadata, базовые поля/CMS) из сборки children/breadcrumbs, сохранив кеш редакционных данных. Переиспользовать один и тот же результат категории; не делать второй `/category/{id}` ради type.
2. Как только известен type, для `page` запустить live listing, параллельно продолжив children/breadcrumbs/content. Не ждать unrelated navigation/shell перед стартом listing.
3. Для `folder` не запускать listing вообще, в том числе спекулятивно с последующим discard.
4. Собрать прежнюю `ShopCategoryPage`, передать фильтры/page/sort без изменений. Ошибку listing передавать обычному error boundary, а не подменять пустым успешным ответом или старой ценой.
5. Сохранить dedup между metadata и body при последующем T05. Request-local sharing — через примитивные ключи и подходящую RSC-область, без сохранения товара между HTTP-запросами.

**Не менять:** folder semantics, канонические URL, 12 товаров на страницу, filter semantics, error UX и сохранённые CMS данные. Не «решать» задержку TTL-кешем listing.

**Тесты:** `src/features/catalog/server/category-page.cache-audit.test.ts`, обновлённый заранее `category-page.test.ts`, `scripts/cache-audit/production-check.ts`. Гейт children удерживается открытым: listing должен стартовать до его release; folder — 0 listing; category — 1 чтение; следующий независимый вызов — новая цена; ошибки не скрываются.

**Успех:** все проверки T04 зелёные и production guard сохраняет один listing/HTTP и тёплый cache-hit категории. Commit: `perf(catalog): overlap listing and category enrichment`.

### T05 — Важно: metadata категории не должно загружать listing

**Проблема/причина.** `src/app/[...path]/page.tsx:93` вызывает `getPageResult`, а он загружает всю страницу. Title/description/canonical категории не зависят от товаров и фильтров, однако сейчас ошибка listing ломает даже metadata. Для HTML-limited bots это также может задержать head/TTFB. Для обычного браузера metadata может стримиться — не утверждать, что всегда блокируется весь первый байт.

**Изменить:** `generateMetadata`, соответствующий feature server metadata loader и переиспользуемое чтение category core из T04.

**Шаги.**

1. Разрешить SEO route один раз на RSC request.
2. Для category получить только основные поля категории: metaTitle/metaDescription/name/description и canonical из route. Не вызывать listing, `/context` или children navigation для metadata.
3. Для landing оставить прежние metadata поля; для product сохранить title/description/canonical и request-local совместное чтение с body. Не создавать новый межзапросный кеш PDP.
4. Сохранить поведение unknown route и redirects. Фильтры/page не меняют canonical и не должны включать дорогую товарную загрузку только ради head.

**Не менять:** SEO тексты и canonical, notFound/permanentRedirect, variant error parameter, содержимое страницы.

**Тесты:** `src/app/[...path]/metadata.cache-audit.test.ts`; production guard в `production-check.ts`; существующие route/product tests. Проверки используют реальный `generateMetadata` и fake внешний API, а не заглушку результата metadata.

**Успех:** title/description/canonical прежние, metadata категории делает 0 listing/context/navigation даже когда product API падает. Commit: `perf(seo): load category metadata without products`.

### T06 — Важно: ограничить зависшие read-запросы к Shopware

**Проблема/причина.** `src/integrations/shopware/client.ts` не задаёт deadline; большинство read-loaders передают только no-store. Медленный/зависший backend может бесконечно удерживать SSR/Suspense. Это не доказанная причина конкретных 10 секунд, но воспроизводимый дефект устойчивости: локальный сервер задерживает ответ 6,5 с, и текущий client принимает его вместо своевременного отказа.

**Изменить:** общую read-policy интеграции и необходимые вызывающие read-loaders. Сохранить отдельный timeout 2000 ms для legacy redirect.

**Шаги.**

1. Для storefront read-операций установить deadline не более 5000 ms; обычные быстрые ответы должны обрабатываться как прежде. Не ретраить SSR-чтения автоматически после timeout.
2. Реально отменять transport через поддерживаемый SDK/ofetch timeout/signal, а не только `Promise.race` с продолжающей работать сетевой операцией.
3. Уважать более строгий timeout/signal вызывающего кода; не увеличивать его общим default.
4. Явно обработать ошибку на существующих границах: основной listing — error boundary; необязательная CMS-сетка — диагностируемый отказ без старой цены; redirect — fail-open как сейчас.
5. Не вводить повторную отправку create-order/payment/cart mutations. Не менять успешные checkout/account сценарии под видом read-оптимизации.

**Не менять:** body/headers/context-token/Shopware semantics; не логировать access keys, cookies и payload клиента. Deadline улучшает отказ, а не скорость успешного SQL — не выдавать его за устранение backend latency.

**Тесты:** `src/integrations/shopware/client.cache-audit.test.ts`; существующие `legacy-redirect.test.ts`, cart/checkout tests. Реальный локальный HTTP server, реальный SDK: зависший запрос должен отклониться в пределах 5 с (+700 мс допуска CI), только одно обращение; caller timeout 40 ms сохраняется.

**Успех:** оба transport-теста зелёные, старые mutation-тесты проходят. Commit: `fix(shopware): bound storefront read request duration`.

**Уточнение по stage после повторной проверки.** Товарные HTTP-сценарии реально занимают 9–11 с, но длительности отдельных Store API операций пока неизвестны. Deadline 5 с может заменить медленную успешную загрузку ошибкой, если этот бюджет превышает одна операция. T06 нужен для ограниченного ожидания и корректного отказа; он сам по себе не доказывает устранение причины задержки и не гарантирует быстрый успешный каталог. Измерить отдельные операции по разделу 9 до оценки результата на stage.

### T07 — Оптимизация: небольшой кеш результатов legacy redirect lookup

**Проблема/причина.** `src/proxy.ts` применяется к каждому пути; `features/seo/server/legacy-redirect-proxy.ts` делает отдельный read POST перед каждым разрешённым GET/HEAD. Кеш SEO внутри страницы этот вызов не покрывает. Он присутствует и на тёплом каталоге; timeout до 2 с. Это предшествующий ветке фактор.

**Изменить:** Proxy orchestration и отдельный ограниченный cache helper в SEO/server либо Shopware integration. Не менять production matcher без доказательств.

**Шаги.**

1. Кешировать только успешно полученное решение redirect либо достоверный `null`. Здесь нет товарных цен.
2. Срок — максимум 60 секунд, память — максимум 256 записей на процесс. По истечении запись перечитать. Кеш не должен расти по произвольным URL.
3. Ключ включает origin, pathname и значимые query-параметры: разные host/query не должны получить чужой redirect. Не удалять query целиком, не нормализовать бизнес-URL наугад.
4. Объединять одновременные одинаковые lookup в один in-flight promise. После ошибки удалить in-flight; не превращать ошибку в закешированный null.
5. Валидировать ответ и исключать self-loop до сохранения. Оставить fail-open, 301, exclusions для служебных маршрутов и запрет lookup для mutation methods.

**Не менять:** контракт JvSeo и полноту legacy redirects. Не отключать proxy на всех современных путях: существующие legacy-URL могут пересекаться. Кеш допускает до 60 с устаревания правил redirects; цены он не хранит.

**Тесты:** `src/features/seo/server/legacy-redirect-proxy.cache-audit.test.ts` плюс существующие proxy/legacy tests. Проверены null/positive reuse, expiry (управляемые настенные часы Date.now), host/path/query isolation, retry после ошибки, одновременные запросы и ограничение памяти.

**Успех:** тёплый повторный URL не вызывает JvSeo до expiry; ошибки не залипают; цены/контекст не появляются в кеше. Commit: `perf(seo): cache bounded legacy redirect decisions`.

**Уточнение по stage после повторной проверки.** На двух последовательных загрузках `/moebel-sortiment` оболочка пришла через 0,43–0,50 с, товары — через 10,92–10,94 с. Proxy выполняется до оболочки, поэтому именно в этих замерах он не объясняет последующие примерно 10,5 с ожидания. Не обещать устранение всей задержки через T07.

### T08 — Оптимизация: переиспользовать все доступные breadcrumbs

**Проблема/причина.** `integrations/shopware/category-page.ts`, `getBreadcrumbs`, ищет в navigation только top-level ancestor. Для всех nested ancestor он сразу запускает `/category/{id}`, даже если они присутствуют в уже переданной navigation. Возникают лишние POST и дополнительный этап загрузки. Не новая регрессия ветки.

**Шаги.**

1. Получить navigation перед принятием решения, какие ancestors отсутствуют; не начинать speculative nested-category calls до этого.
2. Использовать существующий рекурсивный поиск по всему дереву для каждого видимого ancestor ID.
3. Запрашивать только отсутствующие ancestors, параллельно и максимум один раз на ID.
4. Собрать breadcrumbs в порядке category.path, пропустив технический root и непригодные fallback `/kategorie/` URLs. Сохранить canonical href и label из уже доступной navigation.

**Не менять:** порядок дерева, URL, исключение root и fallback semantics. Не hardcode глубину и IDs; не удалять хлебные крошки ради экономии запросов.

**Тесты:** `src/integrations/shopware/category-page.cache-audit.test.ts` и существующий `category-page.test.ts`. Полное вложенное дерево, отсутствующий ancestor, Promise navigation; проверяются результат и только необходимые API обращения.

**Успех:** когда все ancestors известны, `/category` вызывается только для текущей категории; missing ancestors корректно дополняются. Commit: `perf(catalog): reuse nested navigation breadcrumbs`.

## 6. Запуск, ожидаемые результаты и защита тестов

```powershell
# Зависимости из подготовленного lockfile, без lifecycle-изменений Git:
bun install --frozen-lockfile --ignore-scripts

# Проверка неизменности всех контрольных файлов:
bun scripts/cache-audit/verify-tests.ts

# Быстрая группа аудита; product-grid также подхватит его contract tests:
bun --conditions=react-server test --isolate cache-audit.test product-grid.test.ts src/app/bff/products/search/route.test.ts

# Все тесты, включая ранее существовавшие:
bun run test

# Типы:
bun x tsc --noEmit --incremental false

# Реальная Next production-сборка и HTTP-проверки на fake Store API:
bun scripts/cache-audit/production-check.ts

# Отдельный необязательный read-only probe настроенного API:
bun --conditions=react-server scripts/cache-audit/probe-shopware.ts
```

`production-check` копирует production-исходники в отдельный временный каталог, подключает локальный fake Store API, собирает Next с `--webpack`, запускает `next start` на свободном loopback-порту и останавливает оба сервера. Рабочий `.next`, реальные Shopware-товары и конфигурация приложения не меняются. Тестовая сборка исключает test-файлы из typecheck и не создаёт standalone package; отдельный `tsc` проверяет также тесты. Это проверка Next runtime/cache semantics, не измерение скорости stage и не проверка Docker/Turbopack. Временная сборка сохраняется по напечатанному пути для разбора.

Результат аудита до исправлений: полный suite — **327 pass / 17 fail**, 344 теста в 120 файлах; все 17 падений соответствуют задачам выше. Runtime-check — **2 pass / 1 fail**, красный тест подтверждает waterfall T04. `tsc --noEmit --incremental false` и ESLint по изменённым тестам/скриптам проходят без ошибок и предупреждений; `git diff --check` проходит. SHA-проверка подтверждает неизменность **125** защищённых файлов. Красные проверки не нужно помечать skip или маскировать exit code. После каждой задачи должны исчезнуть её ожидаемые падения, а остальные остаться объяснимыми.

Три прежних тестовых файла подготовлены к новому контракту **сейчас, до реализации**:

- `bff/products/search/route.test.ts`: ошибочное требование `private, max-age=120` заменено запретом сохранения цен;
- `features/cms/server/product-grid.test.ts`: mock конкретной single-product функции заменён mock внешнего Store API. Все прежние проверки актуальной цены, mock mode и исчезнувшего товара сохранены, добавлены batch/order/failure checks;
- `features/catalog/server/category-page.test.ts`: mocks внутренней orchestration заменены внешним API. Сохранены folder=0 listing и page=1 listing. Это позволяет исправить waterfall без переписывания проверок исполнителем.

Модульные тесты с заглушками `next/cache` не доказывают TTL, PPR или межзапросное поведение React.cache. Поэтому они дополнены реальной production-сборкой. DOM-сценарии используют настоящий React и happy-dom в отдельном процессе без `react-server`; они не подменяют React hooks собственной реализацией.

## 7. Безопасные варианты кеширования цен — архитектурные условия

Следующее — варианты для отдельного согласованного frontend+Shopware проекта, **не разрешение исполнителю T01–T08 включать кеш товаров**. Backend-кода и контракта событий в этом репозитории нет, поэтому готовность этих схем здесь доказать нельзя.

**Вариант A, применим сейчас:** кешировать только редакционную структуру, navigation/SEO и ссылки на выбранные товары; текущие товары/цены получать пакетно с no-store. Не кешировать зависящие от цены список результатов, порядок price-sort, totals и facets, иначе свежие числа на старом наборе товаров всё равно дадут неверный каталог. T01–T04 следуют этому варианту.

**Вариант B, versioned reads:** Shopware публикует монотонную версию ценового каталога, изменяемую атомарно вместе с ценой, advanced prices, rules, currency/tax inputs и индексами, влияющими на listing. Каждый запрос получает авторитетную текущую версию и использует cache key с этой версией плюс полным ценовым контекстом (sales channel, language, currency, customer group/rules/tax, query). Перед выдачей нужно исключить гонку read-old → commit-new → store-old: версия и данные берутся из согласованного snapshot либо версия перепроверяется. Недоступная версия означает live read или ошибку, но не старую цену. Стоимость проверки версии остаётся; полный context-token нельзя положить в публичный key/лог без анализа приватности.

**Вариант C, синхронная инвалидация:** успешная операция изменения цены не считается завершённой, пока все обслуживающие кеши не видят новую версию/инвалидацию. Нужны общий store либо согласованная доставка на все instances, защита от старых in-flight записей, контроль индексов и отказ при недоступной инвалидации. Это существенно сложнее обычного webhook.

**Обычный асинхронный webhook не даёт «сразу».** Между commit в Shopware и доставкой события остаётся окно устаревших цен. Outbox, retries, идемпотентность и мониторинг делают доставку надёжнее, но не убирают это окно. `revalidateTag(tag, "max")` дополнительно разрешает отдать старую запись при обновлении. `{ expire: 0 }` прекращает выдачу записи после обработки события, но не до его доставки. `updateTag` доступен в Server Actions, а не как универсальный webhook API. См. [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).

Даже идеальная инвалидация сервера не меняет уже показанные браузером цены. Если требуется немедленно менять их в открытых вкладках, нужен отдельный клиентский протокол версий/уведомлений и поведение при offline/reconnect. Для текущих задач гарантия формулируется как отсутствие повторного использования старых цен при новой загрузке/открытии; бесконечно актуальную цену без новых чтений они не обещают.

Также `no-store` в Next не отключает внутренние кеши Shopware, reverse proxy или CDN. На backend отдельно проверить актуальность Store API после изменения простой/advanced цены и после изменения rules/context, включая отложенную индексацию и собственную инвалидацию Shopware. [Описание кешей Shopware](https://developer.shopware.com/docs/guides/hosting/performance/caches.html). Без такой проверки frontend не может гарантировать, что сам источник уже вернул новую цену.

## 8. Что дополнительно измерить на stage перед выбором инфраструктуры

Это диагностическая приёмка, а не пакет непроверенных правок:

1. Зафиксировать deploy SHA, URL категории, её type и наличие `jv-product-grid`; отдельно `/moebel-sortiment`, категория с CMS, категория без CMS, folder, search. Проверить HTTP hard load и клиентскую навигацию, anon и существующую customer cookie.
2. Разделить TTFB, время появления **товаров**, LCP изображений и окончание RSC stream. Loading skeleton улучшает восприятие, но не сокращает Store API latency.
3. По 5 последовательных запросов после рестарта и на тёплом процессе; отдельно после 10 минут. Записать длительности redirect/SEO/category/navigation/ancestors/context/listing/CMS product calls и количество запросов. Для p95 нужен существенно больший репрезентативный набор, 3–5 измерений недостаточно.
4. Сопоставить server trace с PHP/SQL/поисковым backend: listing aggregations включают category/manufacturer/property counts, отдельные property-group aggregations и associations. Они существовали до ветки; удаление product TTL могло увеличить их частоту. Без backend profile нельзя удалять facets или объявлять их конкретным bottleneck.
5. Проверить CPU/memory/container restarts (compose defaults: 1.5 CPU/1 GB), upstream timeouts, CDN/proxy buffering и headers. Изображения могли добавить CPU после `77290f6`, но это отдельная проверяемая гипотеза.
6. Если после T03/T04/T07/T08 публичные cold misses доминируют, рассмотреть shared cache **только для публичных ценонезависимых данных**, с ключами окружения/sales channel/language и защищённой инвалидацией. Не менять версию Next и cache handler в рамках этих задач без отдельного сравнения cold/warm/restart/expiry.

Необходимо сохранить положительные изменения ветки: динамические товары, folder skip, streamed header, отсутствие anonymous cart/account calls и точечную инвалидацию действий корзины. Общий откат `feat/cache-improvements` вернёт устаревшие цены и не устранит медленный источник данных.

## 9. Повторный аудит stage после локальных T01–T05

### 9.1. Какой код проверен

Проверка выполнена 24.09.2026, около 11:08–11:12 UTC, на `https://stage.jvmeubles.be/`. Git оставался read-only; production-код и контрольные тесты не менялись.

| Объект                                  | Подтверждённое состояние                                                                                                                              |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Локальная ветка                         | `feat/cache-improvements`, HEAD `fb6a93ab8f07e5aca42b45e4d67d056cf7633e56`                                                                            |
| Локальные T01–T05                       | `26eae24`, `e1e8a3e`, `ce900f9`, `42d2900`, `fb6a93a`                                                                                                 |
| Remote feature / stage, `git ls-remote` | `06bfac7` / `4742eae9b53ff5aac78e1189ad6e9c579fb92c8d`                                                                                                |
| Последний успешный push-deploy stage    | [run 35966442782](https://github.com/AutomatonSoft/jvmoebel-shopware-front/actions/runs/35966442782), SHA `4742eae`, создан 24.09.2026 в 06:50:15 UTC |
| Дерево remote stage                     | `38186100461eecce0260dbcb6ebff6d65d9e7005`, совпадает с локальным baseline `06bfac7`                                                                  |
| Фактический ответ stage                 | `/bff/products/search?query=sofa` дважды вернул `Cache-Control: private, max-age=120`; локальный T01 уже возвращает `no-store`                        |

Это подтверждает отсутствие поведения T01 на сайте и отсутствие T01–T05 в опубликованной ветке/последнем успешном pipeline. SHA работающего контейнера напрямую не прочитан; ручной deploy вне pipeline этим способом не проверяется. Локальные исправления нельзя считать уже испытанными на stage.

### 9.2. Измерения и воспроизведение

Chrome использовал существующую авторизованную сессию. HTTP-пробы выполнялись отдельно, без cookies, последовательно, без нагрузочного теста. Node `fetch` читал HTML потоково с gzip; замер отмечал первое появление `Moebelkollektion` и `9316` в потоке, а не LCP или момент отрисовки изображения. Все строки таблицы ниже получили HTTP 200.

| Сценарий                               | Первый байт / headers |       Каталог в HTML | Полный ответ |
| -------------------------------------- | --------------------: | -------------------: | -----------: |
| `/moebel-sortiment`, curl, без сжатия  |               0,705 с |        не измерялось |     11,682 с |
| `/moebel-sortiment`, потоковый HTTP №1 |               0,502 с |             10,919 с |     11,126 с |
| `/moebel-sortiment`, потоковый HTTP №2 |               0,430 с |             10,941 с |     11,158 с |
| `/bff/products/search?query=sofa`, №1  |               9,763 с | JSON, 10 результатов |      9,763 с |
| `/bff/products/search?query=sofa`, №2  |               9,278 с | JSON, 10 результатов |      9,279 с |
| `/`                                    |               0,225 с |          неприменимо |      0,350 с |
| `/Auto-Motorrad`, №1                   |               0,422 с |          неприменимо |      0,580 с |
| `/Auto-Motorrad`, №2                   |               0,178 с |          неприменимо |      0,229 с |
| `/bff/health`                          |               0,373 с | `shopwareMode: live` |      0,375 с |

В Chrome после reload видимость заголовка каталога подтверждена примерно через **11,27 с**. Переход кнопкой «Seite 2» завершился сменой URL и товаров примерно через **11,55 с**. Это настенные замеры автоматизации, включающие накладные расходы инструмента, не browser Performance API и не точный LCP.

В двух потоковых запросах skeleton появился через 0,503/0,431 с, footer — через 0,505/0,432 с. HTML каталога пришёл приблизительно на 10,5 с позже. Размер полного распакованного ответа — около 999 КБ; от обнаружения каталога до конца ответа прошло около 0,21 с. Первый curl также получил `x-nextjs-prerender: 1`, `x-nextjs-postponed: 1`, `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`. В потоковых ответах `Server-Timing` отсутствовал.

### 9.3. Что является установленной причиной, а что ещё не измерено

1. **Долгое ожидание находится на серверном пути получения динамических товаров.** HTML с каталогом отсутствует в потоке около 10,9 с. Поисковый BFF без React HTML-рендера и загрузки изображений тоже отвечает за 9,3–9,8 с. Следовательно, браузерный JavaScript, картинки и гидратация не могут быть единственным объяснением наблюдаемой задержки. Быстрые главная, category URL и health не подтверждают одинаковую постоянную задержку всех маршрутов. Это не исключает кратковременную нагрузку между замерами.
2. **Удаление product TTL из `2882629` оставило медленный путь обязательным при каждом новом серверном чтении.** Это подтверждено исходниками, историей и повторными HTTP-замерами. Кеш цен возвращать нельзя. Из этих данных нельзя заключить, что именно коммит замедлил SQL или одну операцию Shopware: профиль источника отсутствует.
3. **У `/moebel-sortiment` остаётся последовательность `/context` → `/product-listing/{rootId}`.** `src/app/moebel-sortiment/page.tsx` не передаёт category ID; `src/integrations/shopware/product-listing.ts:382` ожидает `contextPromise`, чтобы получить `salesChannel.navigationCategoryId`. Только после этого вызывается listing. `getShopwareRequestSession` создаёт анонимную сессию в рамках RSC; межзапросного кеша context нет. Эти файлы не изменились между `06bfac7` и `fb6a93a`. Последовательность доказана кодом; сколько секунд занимает каждый её этап на stage — **не установлено**.
4. **T03–T05 не исправляют этот конкретный root listing.** В нём нет CMS-сетки, category enrichment или динамической category metadata. T04 ускоряет SEO-категории, но не устраняет зависимость root ID от context. T01/T02 решают свежесть цен. Поэтому даже deploy всех T01–T05 сам по себе не является доказательством ускорения `/moebel-sortiment`.
5. **Остаются подтверждённые дефекты фронта T06–T08**, однако их вклад различается: отсутствие timeout позволяет долго ждать; redirect добавляет этап до первого байта; лишние ancestor calls касаются категорий с breadcrumbs. T08 не вызывается для `/moebel-sortiment`. Ни один из этих пунктов не даёт права приписать ему все 10 секунд.

**Граница доказательств.** В BFF подсказок `/context` и `/search-suggest` выполняются параллельно (`src/integrations/shopware/product-search.ts`); снаружи измерена только их общая обработка. Нельзя объявить медленным именно `/context`, `/search-suggest`, listing aggregations, PHP, SQL, DNS или CPU Next без отдельного trace. Также не измерены API latency из контейнера, event-loop delay, CPU/memory и PHP/SQL timings. Доступная локальная конфигурация и старый локальный probe не заменяют эти данные. Новая ошибка реализации T01–T05 как причина stage-задержки **не подтверждена**.

### 9.4. Следующий шаг для точной локализации

**Проблема/причина.** Публичные HTTP-ответы подтверждают медленный серверный путь, но не раскрывают время отдельных операций. Для окончательного заключения нужен доступ к существующим логам/APM stage либо отдельное изменение диагностирования. Не выдавать предположение за найденную backend-причину.

**Шаги.**

1. Прочитать SHA реально работающего release/container и сопоставить с последним deploy; отдельно повторить замеры после опубликования T01–T05. Публикацию и Git выполняет пользователь.
2. Для одного request ID записать начало/окончание redirect, context, listing/search-suggest, mapping и готовности каталога; параллельные операции показывать интервалами, а не суммой длительностей. Не логировать access keys, cookies, context tokens и персональные payload.
3. Сопоставить тот же временной интервал с CPU/event-loop Next и upstream/PHP/SQL trace Shopware. Если существующих метрик нет, оформить инструментирование отдельной задачей; текущая правка документа его не реализует.
4. Только по результату выбрать исправление: конкретный медленный API/backend-участок, измеренная работа фронта либо root-context waterfall. Для устранения последнего сначала подтвердить публичный источник root ID; не hardcode ID и не кешировать весь context или цены.

**Успех:** повторные замеры объясняют наблюдаемые 10–11 с конкретными интервалами и позволяют сравнить тот же сценарий после исправления; цена и состав каталога остаются актуальными. Быстрый skeleton, зелёный health или отказ по timeout не считаются быстрым успешным listing.

### 9.5. Локальные проверки после T01–T05

`bun scripts/cache-audit/verify-tests.ts` — **125 protected files unchanged**. Аудитная группа из раздела 6 — **28 pass / 6 fail**, 34 теста в 11 файлах. Проверки T01–T05 в этой группе проходят; оставшиеся падения: T06 — 1, T07 — 3, T08 — 2. В T06 настоящий transport принял ответ после 6,51 с вместо ограничения в 5 с. Полный suite и production-check при этой повторной диагностике не запускались; результаты первичного аудита не являются результатами текущего HEAD.
