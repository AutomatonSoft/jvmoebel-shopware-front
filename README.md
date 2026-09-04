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

CMS integration contract:
See [docs/cms-contract.md](docs/cms-contract.md) for the supported CMS elements
and the JSON data expected from the Shopware backend.

Storefront branding contract:
See [docs/storefront-branding-contract.md](docs/storefront-branding-contract.md)
for the sales channel logo configuration expected from the backend.

Storefront navigation contract:
See [docs/storefront-navigation-contract.md](docs/storefront-navigation-contract.md)
for the header and footer navigation sources, link resolution, and required
Shopware sales channel entry points.

Product listing contract:
See [docs/product-listing-contract.md](docs/product-listing-contract.md) for the
normalized `/shop` product model, filter and sorting behavior, and Shopware
Administration responsibility boundary.

Development:
bun dev

Checks:
bun run lint
bun run typecheck
bun run format:check

Build:
bun run build
bun start
