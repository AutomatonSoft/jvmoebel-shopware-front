# Документация проекта

## Техническая часть витрины

| Документ                                                  | Описание                                     |
| --------------------------------------------------------- | -------------------------------------------- |
| [`dynamic-routing.md`](storefront/dynamic-routing.md)     | Как Shopware SEO URL открывает CMS-страницу. |
| [`storefront-config.md`](storefront/storefront-config.md) | Конфигурация шапки и подвала.                |
| [`product-listing.md`](catalog/product-listing.md)        | Специальный каталог `/moebel-sortiment`.     |

## CMS-компоненты Shopware

Каждый файл в `components` описывает один элемент: назначение, место для скриншота, поля для контент-менеджера и технический контракт для расширения Shopware.

| `slot.type`                | Документ                                                                | Назначение                         |
| -------------------------- | ----------------------------------------------------------------------- | ---------------------------------- |
| `jv-article-hero`          | [`jv-article-hero.md`](components/jv-article-hero.md)                   | Шапка статьи.                      |
| `jv-author-footer`         | [`jv-author-footer.md`](components/jv-author-footer.md)                 | Карточка автора.                   |
| `jv-benefit-strip`         | [`jv-benefit-strip.md`](components/jv-benefit-strip.md)                 | Преимущества магазина.             |
| `jv-category-rail`         | [`jv-category-rail.md`](components/jv-category-rail.md)                 | Карточки категорий.                |
| `jv-chip-rail`             | [`jv-chip-rail.md`](components/jv-chip-rail.md)                         | Быстрые ссылки-чипы.               |
| `jv-color-world-picker`    | [`jv-color-world-picker.md`](components/jv-color-world-picker.md)       | Подборки по цвету.                 |
| `form`                     | [`form.md`](components/form.md)                                         | Контактная форма.                  |
| `jv-countdown-promo`       | [`jv-countdown-promo.md`](components/jv-countdown-promo.md)             | Акция с обратным отсчётом.         |
| `jv-editorial-team-grid`   | [`jv-editorial-team-grid.md`](components/jv-editorial-team-grid.md)     | Команда редакции.                  |
| `jv-expert-profile`        | [`jv-expert-profile.md`](components/jv-expert-profile.md)               | Карточка эксперта.                 |
| `jv-expert-quote`          | [`jv-expert-quote.md`](components/jv-expert-quote.md)                   | Цитата эксперта.                   |
| `jv-expert-tip`            | [`jv-expert-tip.md`](components/jv-expert-tip.md)                       | Совет эксперта.                    |
| `jv-faq`                   | [`jv-faq.md`](components/jv-faq.md)                                     | Частые вопросы.                    |
| `jv-guide-hub-cards`       | [`jv-guide-hub-cards.md`](components/jv-guide-hub-cards.md)             | Карточки гайдов.                   |
| `jv-hero`                  | [`jv-hero.md`](components/jv-hero.md)                                   | Главный баннер.                    |
| `jv-home-editorial`        | [`jv-home-editorial.md`](components/jv-home-editorial.md)               | Раскрывающийся редакционный текст. |
| `jv-inline-product-teaser` | [`jv-inline-product-teaser.md`](components/jv-inline-product-teaser.md) | Врезка товара.                     |
| `jv-instagram-style`       | [`jv-instagram-style.md`](components/jv-instagram-style.md)             | Карточка в стиле Instagram.        |
| `jv-loyalty-promo`         | [`jv-loyalty-promo.md`](components/jv-loyalty-promo.md)                 | Программа лояльности.              |
| `jv-newsletter`            | [`jv-newsletter.md`](components/jv-newsletter.md)                       | Подписка на рассылку.              |
| `jv-offer-rail`            | [`jv-offer-rail.md`](components/jv-offer-rail.md)                       | Лента предложений.                 |
| `jv-page-header`           | [`jv-page-header.md`](components/jv-page-header.md)                     | Заголовок внутренней страницы.     |
| `jv-product-grid`          | [`jv-product-grid.md`](components/jv-product-grid.md)                   | Выбранные товары.                  |
| `jv-review-summary`        | [`jv-review-summary.md`](components/jv-review-summary.md)               | Краткий отзыв.                     |
| `jv-room-grid`             | [`jv-room-grid.md`](components/jv-room-grid.md)                         | Подборки по комнатам.              |
| `jv-shop-the-look`         | [`jv-shop-the-look.md`](components/jv-shop-the-look.md)                 | Интерьер с точками товаров.        |
| `jv-subcategory-links`     | [`jv-subcategory-links.md`](components/jv-subcategory-links.md)         | Ссылки на подкатегории.            |
| `jv-table-of-contents`     | [`jv-table-of-contents.md`](components/jv-table-of-contents.md)         | Оглавление статьи.                 |
| `jv-trust-rating`          | [`jv-trust-rating.md`](components/jv-trust-rating.md)                   | Рейтинг доверия.                   |
| `jv-why-jvmoebel`          | [`jv-why-jvmoebel.md`](components/jv-why-jvmoebel.md)                   | Преимущества бренда.               |
| `image`                    | [`image.md`](components/image.md)                                       | Одиночное изображение.             |
| `product-listing`          | [`product-listing.md`](components/product-listing.md)                   | Каталог страницы категории.        |
| `sidebar-filter`           | [`sidebar-filter.md`](components/sidebar-filter.md)                     | Слот бокового фильтра.             |
| `text`                     | [`text.md`](components/text.md)                                         | Форматированный текст.             |
| `youtube-video`            | [`youtube-video.md`](components/youtube-video.md)                       | Видео YouTube.                     |

### Общий поток данных

```text
Shopware CMS page
└── sections → blocks → slots
                    ├── slot.type — выбирает компонент
                    ├── slot.data — данные кастомных `jv-*` элементов
                    └── slot.config — настройки стандартных элементов
```

Расширение Shopware должно зарегистрировать нужные `jv-*` элементы и блоки, отдать публичные URL медиафайлов и сохранить порядок повторяющихся записей. Frontend проверяет контракт каждого элемента, регистрирует найденные ошибки на сервере и не выводит элемент, если обязательные данные не прошли проверку.
