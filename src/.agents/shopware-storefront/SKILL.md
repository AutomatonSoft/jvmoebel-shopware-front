---
name: shopware-storefront
description: Use for Shopware Store API, products, categories, navigation, cart, customers, search, routing, domain types, and Shopware data transformations.
---

# Shopware Storefront

Before working, read the repository root `AGENTS.md` completely and follow its project architecture.

Use this data flow:

`app route -> feature server module -> Shopware integration -> mapper -> feature model -> UI`

- Put Store API requests, Shopware request semantics, sessions, and raw API types in `src/integrations/shopware`.
- Put raw-response transformations in `src/integrations/shopware/mappers`.
- Keep feature models independent of Shopware response shapes.
- Use feature `server` modules to coordinate integrations, mock mode, and feature-level fallbacks.
- Keep raw Shopware responses and API calls out of UI components.
- Fetch on the server unless the interaction genuinely requires a browser request.
- Reuse the existing client, session, configuration, types, and mappers before adding equivalents.
- Preserve Shopware identifiers and API semantics, avoid duplicate requests, and handle failures explicitly.
- Test changed mappings and domain behavior beside the corresponding layer.

- Change only the Shopware domain required by the task.
