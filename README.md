JVMöbel Shopware Frontend

Requirements:
Node.js 24.19.0
Bun 1.3.14

Install:
bun install

Shopware configuration:
Copy .env.example to .env.local. With `SHOPWARE_USE_MOCKS=true`, the storefront
uses local fixtures and the Shopware endpoint and access token may stay empty.
With `SHOPWARE_USE_MOCKS=false`, provide the Store API endpoint and access key
of the Shopware sales channel to work with real CMS and Store API data. Only
`true` and `false` are accepted. When the flag is omitted, mocks are enabled in
development.

Production always uses real Shopware data. The deployment configuration
requires the Store API endpoint and access key, and explicitly disables mocks.
Starting the application with `SHOPWARE_USE_MOCKS=true` and
`NODE_ENV=production` is treated as a configuration error.

CMS component contracts:
See [docs/README.md](docs/README.md) for the supported CMS elements, their
`slot.data` contracts, and the fields managed through Shopware Administration.

Storefront shell contract:
See [docs/storefront/storefront-config.md](docs/storefront/storefront-config.md)
for the aggregated Shopware header and footer response, normalization, and
fallback behavior.

Product listing contract:
See [docs/storefront/product-listing.md](docs/storefront/product-listing.md) for the
normalized `/shop` product model, filter and sorting behavior, and Shopware
Administration responsibility boundary.

Discount offers page:
See [docs/storefront/discount-offers.md](docs/storefront/discount-offers.md) for the sale overview
behavior and its catalog integration.

Development:
bun dev

Checks:
bun run lint
bun run typecheck
bun run format:check

Build:
bun run build
bun start
