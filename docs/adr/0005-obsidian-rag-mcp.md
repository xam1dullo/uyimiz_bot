# ADR 0005: Obsidian-based RAG via MCP Server

**Status:** Accepted  
**Date:** 2026-05-26

## Context

Need a knowledge management system that:
- AI agents (Pi, Codex, Copilot, Claude Code) can query during development
- Stores architecture decisions, domain context, session memory
- Survives between agent sessions (persistent RAG)
- Human-readable and editable (not a vector DB)

## Decision

**Obsidian vault** at `/Users/admin/Developer/Projects/my-mcp/rag_system/` exposed via **MCP server**.

```
AI Agent → MCP Protocol → my-mcp (Node.js) → Obsidian Vault (markdown)
                                  ↕ (REST API)
                        obsidian-local-rest-api plugin
```

## Consequences

**Positive:**
- 9 MCP tools: search, read, create, update, append, list, backlinks, recent, rag_query
- Works with any MCP-compatible AI tool (VS Code, Claude Code, Copilot)
- Markdown files are human-editable in Obsidian GUI
- Wikilinks (`[[entities/uyimiz_bot]]`) create navigable knowledge graph
- Filesystem-based search (fast, no vector embedding needed)

**Negative:**
- Requires Obsidian running with REST API plugin
- Search is substring-based (no semantic search)
- File-based, not scalable to millions of documents

## MCP Tools

| Tool | Use Case |
|------|----------|
| `search_notes` | Find context before coding |
| `read_note` | Load full context |
| `create_note` | Write new knowledge |
| `rag_query` | Fetch relevant notes for LLM context injection |
| `get_backlinks` | Find related knowledge |

## Vault Structure

```
rag_system/
  wiki/
    entities/    ← Technology, projects, tools
    concepts/    ← Design patterns, architecture
    analysis/    ← Decision comparisons
  memory/
    projects/    ← Per-project session memory
  raw/sources/   ← Ingested documentation
```

## References

- `/Users/admin/Developer/Projects/my-mcp/`: MCP server source
- `.vscode/mcp.json`: VS Code MCP config
- `rag_system/.claude/mcp.json`: Claude Code MCP config
