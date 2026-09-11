---
name: shopware-cms
description: Use when implementing, debugging, or refactoring Shopware Shopping Experiences pages, sections, blocks, slots, elements, contracts, mappings, or CMS rendering.
---

# Shopware CMS

Before working, read the repository root `AGENTS.md` completely and follow its project architecture.

Keep the CMS pipeline explicit:

`Shopware payload -> mapper -> CMS model and contract -> central renderer -> element component`

- Keep page, section, block, slot, and element responsibilities distinct.
- Keep Shopware payload normalization in integration mappers, outside rendering components.
- Put payload parsing and validation in `src/features/cms/contracts`.
- Put element presentation in `src/features/cms/components/elements`.
- Register element resolution centrally in `cms-page-renderer.tsx`; do not scatter type conditionals across components.
- When adding an element, change only its model or contract, mapper, renderer registration, component, and focused tests as required.
- Reuse existing CMS renderers and link or button components before adding equivalents.
- Report unsupported or invalid elements explicitly; do not silently swallow them.
- Keep Store API calls and unrelated CMS element changes out of leaf components.
