# JVMöbel Shopware Frontend

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
