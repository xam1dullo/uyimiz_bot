# Issue tracker: beads (bd)

Issues and PRDs for this repo live in beads — a local Dolt-based issue tracker with git-compatible sync. Use the `bd` CLI for all operations.

## Conventions

- **Create an issue**: `bd add "title" --body "..." --status open`
- **Read an issue**: `bd show <id>` — shows full issue with comments, status, blocks/depends
- **List ready work**: `bd list --status ready` — issues available for pickup
- **List in-progress**: `bd list --status in-progress` — work currently being done
- **List blocked**: `bd list --status blocked` — waiting on dependencies
- **Claim work**: `bd update <id> --claim` — atomically mark as in-progress
- **Close/complete**: `bd close <id>` — mark as done
- **Block an issue**: `bd update <id> --status blocked --comment "reason"`
- **Cross-machine sync**: `bd dolt push` / `bd dolt pull` — syncs beads data to/from git remote (separate from code branches)

Data lives in `.beads/dolt/` (Dolt database). `.beads/issues.jsonl` is a passive export — never treat it as source of truth.

Full workflow context: run `bd prime`.

## When a skill says "publish to the issue tracker"

Run `bd add "title" --body "..." --status open`.

## When a skill says "fetch the relevant ticket"

Run `bd show <id>` to read the full issue with comments.

## When a skill says "list open issues"

Run `bd list --status ready` for available work, or `bd list --status in-progress` for active work.
