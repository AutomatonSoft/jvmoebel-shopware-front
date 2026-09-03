---
name: refactoring
description: Use only when explicitly asked to refactor existing code or architecture.
---

# Refactoring

- Refactor one logical concern at a time.
- Prefer the smallest change that meaningfully improves the code.
- Preserve existing behavior unless behavior changes are explicitly requested.
- Do not combine unrelated cleanup with the current refactor.
- Do not rename, move, or rewrite unrelated files.
- Do not introduce abstractions without a concrete benefit.
- Prefer clear separation of concerns over generic abstractions.
- Keep UI, domain logic, API access, and transformations separate.
- Reuse existing project patterns where they are good enough.
- Avoid opportunistic refactoring.

Before changing code:

- inspect only the files needed to understand the current concern;
- identify the single responsibility being improved;
- keep the expected diff small.

If another issue is discovered, mention it as a possible next step instead of fixing it now.

After the change:

- run only relevant validation;
- summarize briefly;
- stop.

Do not create branches, switch branches, commit, push, merge, or rebase.
