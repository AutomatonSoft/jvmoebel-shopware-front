---
name: shopware-cms
description: Use when implementing, debugging, or refactoring Shopware Shopping Experiences CMS pages, sections, blocks, slots, elements, CMS rendering, or CMS element mappings.
---

# Shopware CMS

- Treat CMS rendering as a separate presentation pipeline.
- Keep page → section → block → slot → element responsibilities clear.
- Keep CMS component resolution centralized.
- Prefer explicit element/block mappings over scattered conditionals.
- CMS components should focus on rendering.
- Keep Shopware data normalization outside presentational components.
- Reuse existing CMS renderers before adding new ones.
- Handle unknown CMS elements explicitly.
- Do not silently swallow unsupported element types.
- Avoid Shopware-specific API calls inside leaf UI components.
- Do not refactor unrelated CMS elements while implementing one element.
