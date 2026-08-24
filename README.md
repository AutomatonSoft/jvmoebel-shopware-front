JVMöbel Shopware Frontend

Requirements:
Node.js 24.19.0
Bun 1.3.14

Install:
bun install

Shopware configuration:
Copy .env.example to .env.local and replace the placeholder values with the
Store API endpoint and access key of the Shopware sales channel.

Development:
bun dev

Checks:
bun run lint
bun run typecheck
bun run format:check

Build:
bun run build
bun start
