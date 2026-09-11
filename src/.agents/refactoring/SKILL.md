---
name: refactoring
description: Use only when the user explicitly asks to refactor existing code or architecture while preserving behavior.
---

# Refactoring

Before working, read the repository root `AGENTS.md` completely and follow its project architecture.

- Identify the single responsibility being improved and the behavior that must remain unchanged.
- Inspect only the callers, tests, and neighboring patterns needed to understand that responsibility.
- Prefer the smallest change that meaningfully improves the code.
- Preserve behavior unless the user explicitly requests a behavior change.
- Keep server access, domain logic, client state, and presentation in their existing layers.
- Do not combine unrelated cleanup, renaming, moving, or abstraction work with the refactor.
- Introduce an abstraction only when it removes a concrete duplication or clarifies an existing boundary.
- Run focused validation for the changed responsibility.

If another issue appears, report it as a possible next step instead of expanding the refactor.
