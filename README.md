# JVMoebel Shopware Frontend

Frontend витрины JVMoebel на Next.js. Shopware управляет товарами, категориями, SEO URL и содержимым Shopping Experiences; Next.js получает данные через Store API и отображает страницы и CMS-компоненты.

## Стек

- Next.js 16 и React 19
- TypeScript
- Tailwind CSS и общие UI-компоненты
- Shopware Store API
- Bun для зависимостей, разработки и проверок

## Архитектура

```text
src/
├── app/                    маршруты Next.js, metadata и композиция страниц
├── features/               бизнес-домены витрины
│   └── <domain>/
│       ├── components/     интерфейс домена
│       ├── server/         загрузчики и серверная оркестрация
│       ├── model/          независимые от API типы и логика
│       ├── hooks/          клиентское состояние и браузерное поведение
│       └── fixtures/       детерминированные mock-данные
├── integrations/shopware/  Store API, сессии, типы ответов и мапперы
├── components/ui/          общие UI-примитивы
└── lib/                    небольшие общие утилиты
```

CMS использует поток `Shopware payload → mapper → CMS model и contract → центральный renderer → компонент`. Обычная CMS-страница создаётся менеджером в Shopware: ей назначаются Shopping Experience, sales channel и SEO URL. Next.js не требует отдельного route-файла для каждой такой страницы.

Для витринных данных используется поток `route → feature server → Shopware integration → mapper → feature model → UI`.

## Требования

- Node.js `24.19.0`
- Bun `1.3.14`

## Установка

```bash
bun install
```

## Настройка Shopware

Скопируйте `.env.example` в `.env.local`.

- `SHOPWARE_USE_MOCKS=true` включает локальные fixtures; URL и access key Shopware не нужны.
- `SHOPWARE_USE_MOCKS=false` включает реальные CMS- и Store API-данные. Укажите endpoint Store API и access key sales channel.
- Допустимы только значения `true` и `false`. Если переменная не задана, в development используется mock-режим, в остальных окружениях — live-режим.

В production mock-режим выключен по умолчанию. Для production-конфигурации следует явно задавать `SHOPWARE_USE_MOCKS=false`; значение `true` технически включает fixtures и предназначено только для контролируемой разработки.

## Документация

- [CMS-компоненты и их поля Shopware](docs/README.md)
- [Динамическая маршрутизация CMS-страниц](docs/storefront/dynamic-routing.md)
- [Глобальная шапка и подвал](docs/storefront/storefront-config.md)
- [Каталог товаров](docs/catalog/product-listing.md)

## Разработка

```bash
bun dev
```

## Проверки

```bash
bun run lint
bun run typecheck
bun run format:check
```

## Production-сборка

```bash
bun run build
bun start
```
