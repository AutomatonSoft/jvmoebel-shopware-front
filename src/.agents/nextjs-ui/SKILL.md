---
name: nextjs-ui
description: Use for React, Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, components, layouts, styling, forms, and frontend UI work.
---

# Next.js UI

- Follow existing project conventions first.
- Prefer Server Components unless client behavior is required.
- Add `"use client"` only at the smallest necessary boundary.
- Avoid unnecessary `useEffect`, local state, memoization, and abstractions.
- Use existing shadcn components before creating equivalents.
- Preserve existing design tokens and Tailwind conventions.
- Prefer semantic HTML and accessible interactions.
- Keep components small and focused.
- Separate UI from API/domain logic.
- Do not refactor unrelated code.

For Next.js caching/rendering behavior, inspect the project's configuration and existing patterns before changing them.
