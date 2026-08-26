JVMöbel Shopware Frontend

Requirements:
Node.js 24.19.0
Bun 1.3.14

Install:
bun install

Shopware configuration:
Copy .env.example to .env.local and replace the placeholder values with the
Store API endpoint and access key of the Shopware sales channel.

CMS integration contract:
See [docs/cms-contract.md](docs/cms-contract.md) for the supported CMS elements
and the JSON data expected from the Shopware backend.

Storefront branding contract:
See [docs/storefront-branding-contract.md](docs/storefront-branding-contract.md)
for the sales channel logo configuration expected from the backend.

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
