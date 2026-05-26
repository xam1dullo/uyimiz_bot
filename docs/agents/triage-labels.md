# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual status strings used in **beads** (this repo's issue tracker).

| Label in mattpocock/skills | Status in beads | Meaning |
|---|---|---|
| `needs-triage` | `open` | Maintainer needs to evaluate this issue |
| `needs-info` | `blocked` | Waiting on reporter or dependency for more information |
| `ready-for-agent` | `ready` | Fully specified, ready for an AFK agent to pick up |
| `ready-for-human` | `in-progress` | Currently being worked on by a human |
| `wontfix` | `wontfix` | Will not be actioned |

## Usage with beads

When a skill says "apply the AFK-ready triage label":
```bash
bd update <id> --status ready
```

When a skill says "mark as needs-info (waiting)":
```bash
bd update <id> --status blocked --comment "waiting on reporter"
```

## Beads statuses reference

| Status | Command | Description |
|---|---|---|
| `open` | `bd add` | New, unevaluated |
| `ready` | `bd update <id> --status ready` | Available for pickup |
| `in-progress` | `bd update <id> --claim` | Atomically claimed |
| `blocked` | `bd update <id> --status blocked` | Waiting on dependency |
| `closed` | `bd close <id>` | Done |
