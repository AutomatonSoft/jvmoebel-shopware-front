---
name: nextjs-ui
description: Use for React, Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, components, layouts, forms, and storefront visual design.
---

# Next.js UI

Before working, read the repository root `AGENTS.md` completely and follow its project architecture.

## Implementation

- Prefer Server Components. Add `"use client"` at the smallest boundary that needs browser state, events, or client-only APIs.
- Keep routes focused on metadata, route inputs, data loading through feature server modules, and composition.
- Keep API access and domain transformations outside presentational components.
- Reuse components from `src/components/ui` before creating another primitive.
- Split a component when it owns separate interaction flows, substantial independent sections, or logic that belongs in a model or hook. Do not split by an arbitrary line count.
- Avoid unnecessary `useEffect`, state, memoization, client-side fetching, and wrapper components.

## Visual design

- Use the semantic tokens defined in `src/app/globals.css`; avoid one-off color values when a token already expresses the role.
- Treat orange `#ff4f22` as the primary action color and lime `#e9ff57` as the accent.
- Build pages from light surfaces: warm background `#fbfaf6`, white cards, and soft secondary `#f0efe7`.
- Do not introduce dark themes or dark backgrounds for pages, sections, cards, dialogs, or navigation. Dark foreground colors remain valid for readable text and icons; translucent dark overlays are allowed over images or video when needed for contrast.
- Follow the existing Montserrat typography, spacing, radius, and restrained shadow conventions.
- Keep hierarchy clear, layouts spacious, and decorative effects consistent with the existing storefront.
- Preserve responsive behavior, semantic HTML, keyboard access, focus states, and sufficient color contrast.

Inspect existing components and tokens before changing caching, rendering, or visual conventions.
