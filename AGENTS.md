# Project Instructions

## Workflow

- Work in small, logically complete steps.
- One logical change = one future commit.
- Do not combine unrelated fixes or refactors.
- Do not perform opportunistic refactoring.
- If another issue is found, mention it as a possible next step instead of fixing it.

Before each change, briefly state:

- current/recommended branch;
- what will change;
- why.

After each change:

- run only relevant validation;
- briefly summarize what changed;
- suggest one Conventional Commit message;
- suggest one logical next step;
- stop and wait for confirmation.

## Git

Never:

- create or switch branches;
- commit;
- push;
- merge;
- rebase;
- reset;
- stash;
- perform other Git operations that modify repository state.

Read-only Git commands such as `git status`, `git diff`, and checking the current branch are allowed.

Git is controlled by the user.

## Context efficiency

Minimize token and context usage.

- Inspect only files relevant to the current task.
- Prefer targeted search over repository-wide exploration.
- Do not repeatedly read unchanged files.
- Do not investigate unrelated architecture.
- Do not explain obvious code.
- Keep plans, progress updates, and summaries concise.
- Run only checks relevant to changed code.
- Make the smallest correct change.
- Stop when the requested step is complete.
- Do not spawn subagents unless parallel exploration is clearly necessary.

## Architecture

- Follow existing project conventions before introducing new patterns.
- Prefer simple, focused modules and components.
- Keep UI, domain logic, Shopware API access, and data transformations separate.
- Reuse existing components, utilities, types, and API helpers before adding new ones.
- Avoid unnecessary abstractions and overengineering.
- Preserve existing behavior unless a behavior change is explicitly requested.
- Handle errors explicitly; avoid silent failures.

## Frontend

- Prefer Server Components unless client-side behavior is required.
- Keep `"use client"` boundaries as small as possible.
- Avoid unnecessary `useEffect`, state, memoization, and client-side fetching.
- Reuse existing shadcn/ui components before creating equivalents.
- Follow existing Tailwind tokens and conventions.
- Preserve accessibility and responsive behavior.

## Shopware

- Keep Store API logic outside presentation components.
- Keep CMS rendering responsibilities clear.
- Prefer centralized CMS element/block resolution.
- Normalize Shopware data outside leaf UI components when practical.
- Do not duplicate Store API requests unnecessarily.

## Refactoring

When refactoring:

- change one responsibility at a time;
- preserve behavior;
- keep the diff focused;
- do not clean up unrelated code;
- do not introduce abstractions without a concrete benefit.
