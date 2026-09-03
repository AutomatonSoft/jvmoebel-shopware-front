---
name: shopware-storefront
description: Use for Shopware Store API, products, categories, navigation, cart, customer, search, SEO routing, API clients, domain types, and Shopware data transformations.
---

# Shopware Storefront

- Keep Shopware/API logic separate from presentation.
- Centralize Store API communication in the existing API layer.
- Reuse existing API helpers and types before creating new ones.
- Keep raw Shopware responses out of UI components when practical.
- Put transformations near the data/domain layer.
- Preserve Shopware identifiers and API semantics.
- Handle API errors explicitly; avoid silent failures.
- Do not duplicate API requests unnecessarily.
- Do not fetch data client-side when it can reasonably be fetched server-side.
- Inspect existing project abstractions before introducing new ones.
- Change only the Shopware domain required by the task.
