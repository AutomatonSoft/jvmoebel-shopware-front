# Project Instructions

## Task startup

- Before working on any task, read this file completely.
- Determine which project areas the task affects before inspecting or changing code.
- Read only the applicable skill files:
  - UI, React, Next.js, Tailwind, or visual design: `src/.agents/nextjs-ui/SKILL.md`;
  - Shopware Store API and data mapping: `src/.agents/shopware-storefront/SKILL.md`;
  - Shopware Shopping Experiences CMS: `src/.agents/shopware-cms/SKILL.md`;
  - explicit refactoring tasks: `src/.agents/refactoring/SKILL.md`.
- When a task spans multiple areas, combine only the relevant skills.

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

Read-only Git commands such as `git status`, `git diff`, and checking the current branch are allowed. Git is controlled by the user.

## Project architecture

Place code by responsibility:

- `src/app`: Next.js routes, layouts, metadata, request parameters, and composition;
- `src/features/<domain>/components`: feature UI and feature-specific interactions;
- `src/features/<domain>/server`: server-only loaders, actions, and orchestration;
- `src/features/<domain>/model`: API-independent types and pure domain logic;
- `src/features/<domain>/hooks`: client-side state and reusable browser behavior;
- `src/features/<domain>/fixtures`: deterministic mock data;
- `src/features/cms/contracts`: CMS payload parsing and validation;
- `src/integrations/shopware`: Store API access, Shopware types, sessions, and mappers;
- `src/components/ui`: shared UI primitives;
- `src/lib`: small utilities that are truly shared across features.

Keep route files thin. They may read route inputs and compose features, but Store API calls, domain transformations, and substantial interactive state belong in their respective layers.

Do not put an entire feature in one file. Split code when a file has multiple reasons to change, mixes server and client responsibilities, combines data fetching or mapping with JSX, or contains independently reusable UI sections. Do not split small, single-purpose code only to satisfy a line-count target.

Keep tests beside the layer they verify. Reuse existing components, utilities, types, API helpers, and folder patterns before adding new ones.

## Context efficiency

- Inspect only files relevant to the current task.
- Prefer targeted search over repository-wide exploration.
- Do not repeatedly read unchanged files.
- Do not investigate unrelated architecture.
- Keep plans, progress updates, and summaries concise.
- Run only checks relevant to changed code.
- Make the smallest correct change.
- Do not spawn subagents unless parallel exploration is clearly necessary.

## Engineering rules

- Prefer simple, focused modules and components.
- Preserve existing behavior unless a behavior change is explicitly requested.
- Keep UI, domain logic, Shopware access, and data transformations separate.
- Handle errors explicitly; avoid silent failures.
- Avoid unnecessary abstractions and overengineering.
- Preserve accessibility and responsive behavior.
