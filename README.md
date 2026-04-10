# skills-dir

`skills-dir` tells you where an AI agent expects its skills to live.

It exists for one simple reason: the agent ecosystem has no single standard for skill locations.
Some tools use a shared universal directory such as `.agents/skills`. Others use agent-specific
folders such as `.claude/skills`, `.augment/skills`, or plain `skills`.

If you are building:

- a skill installer
- an agent setup script
- a migration tool
- a CLI that copies skills into the right place
- an automation that needs to understand multiple agent conventions

you usually need the answer to one question first:

`For agent X, where should the skills directory be?`

This package answers that question in a consistent, scriptable way.

## What This Repo Does

`skills-dir` provides both:

- a CLI for humans, shells, and other AI agents
- an SDK for Node.js scripts and automation

It resolves skill directories for supported agents across two installation scopes:

- `global`: installed in the user's home directory
- `project`: installed in the current project directory

Examples:

- Codex global skills resolve to `~/.agents/skills`
- Claude Code project skills resolve to `<cwd>/.claude/skills`
- OpenClaw project skills resolve to `<cwd>/skills`

## What This Repo Does Not Do

`skills-dir` does not:

- install skills
- validate skill contents
- sync skills between agents
- detect which agent is currently running
- manage repositories or package downloads

Its job is deliberately narrow: resolve the correct target directory for a given agent and scope.

## Install

```bash
npm install skills-dir

# or use it directly without installing
npx skills-dir codex --scope global
npx skills-dir claude-code --scope project
```

## Why This Matters

The "where do I put this skill?" problem shows up everywhere once you start working across
multiple coding agents.

Without a shared resolver, people end up hardcoding paths like:

```bash
~/.agents/skills
~/.claude/skills
./.claude/skills
./skills
```

That quickly becomes brittle because:

- different agents use different directories
- some agents use a universal shared path
- some agents use agent-specific paths
- scripts need to work both globally and inside project folders
- AI-generated automation often guesses wrong

`skills-dir` gives you a canonical source of truth instead of scattered path logic.

## Quick Start

Find all target directories for an agent:

```bash
npx skills-dir claude-code
```

Find only the global directory:

```bash
npx skills-dir codex --scope global
```

Find only the project directory for a custom working directory:

```bash
npx skills-dir claude-code --scope project --cwd /path/to/repo
```

Get structured output for scripts:

```bash
npx skills-dir claude-code --json
```

List supported agents:

```bash
npx skills-dir list
```

## CLI

```bash
skills-dir <agent> [--scope global|project|all] [--cwd <path>] [--json] [--check]
skills-dir list [--json]
```

Text mode prints path-only output, which makes it easy to pipe into shell commands or feed into
another agent. JSON mode returns richer metadata for automation.

### CLI Examples

```bash
# Return both project and global locations
npx skills-dir codex

# Only return the global location
npx skills-dir codex --scope global

# Resolve using a display name instead of a slug
npx skills-dir "Claude Code" --scope project

# JSON output for scripts
npx skills-dir claude-code --json

# Include existence checks
npx skills-dir claude-code --json --check

# List all supported agents
npx skills-dir list --json
```

### CLI Defaults

- `scope=all`
- text mode prints one path per line
- `--json` returns structured data
- `--check` adds `exists` to each result

### CLI Output Shape

When `--json` is enabled, a resolved entry includes:

```json
{
  "agentId": "claude-code",
  "agentName": "Claude Code",
  "category": "agent-specific",
  "scope": "project",
  "relativePath": ".claude/skills",
  "path": "/your/project/.claude/skills",
  "exists": true
}
```

## SDK

```ts
import { listAgents, resolveSkillDir, resolveSkillDirs } from "skills-dir";

const codexGlobal = resolveSkillDir("codex", { scope: "global" });
const claudePaths = resolveSkillDirs("claude-code");
const agents = listAgents();
```

### SDK API

#### `listAgents()`

Returns all supported agent definitions.

Use this when you want to build UIs, selectors, docs, or validation around the supported agents.

#### `resolveSkillDir(agent, options)`

Returns a single resolved directory.

Use this when you already know whether you want `global` or `project`.

```ts
import { resolveSkillDir } from "skills-dir";

const result = resolveSkillDir("codex", {
  scope: "global"
});

console.log(result.path);
// => /Users/you/.agents/skills
```

#### `resolveSkillDirs(agent, options)`

Returns one or more resolved directories.

Use this when you want the full picture for an agent, especially when your tool can work with both
project and global installation targets.

```ts
import { resolveSkillDirs } from "skills-dir";

const results = resolveSkillDirs("claude-code");

for (const entry of results) {
  console.log(entry.scope, entry.path);
}
```

#### `findAgent(input)`

Finds an agent definition from a user-facing name or alias.

This supports normalized inputs such as:

- `Claude Code`
- `claude-code`
- `claude_code`

## Scopes

- `global`: resolve against the user's home directory, usually for agent-wide installs
- `project`: resolve against the current working directory or a custom `cwd`, usually for repo-local installs
- `all`: resolve both `project` and `global`, in that order

## Supported Agent Model

This project supports two path styles:

### Universal

These agents use the shared `.agents/skills` convention.

Examples:

- Codex
- Cursor
- Cline
- Warp
- GitHub Copilot

### Agent-specific

These agents use their own per-agent directory.

Examples:

- Claude Code -> `.claude/skills`
- Augment -> `.augment/skills`
- Continue -> `.continue/skills`
- OpenClaw -> `skills`

Use `npx skills-dir list` for the current full registry.

## Common Use Cases

### Build a skill installer

Resolve the target directory before copying files:

```bash
TARGET_DIR=$(npx skills-dir claude-code --scope project)
mkdir -p "$TARGET_DIR"
cp -R ./my-skill "$TARGET_DIR/"
```

### Build a multi-agent automation script

Use JSON output to branch reliably:

```bash
npx skills-dir codex --json
```

### Add support to another tool

Instead of hardcoding agent paths in your own codebase, call the SDK and delegate that logic to
this package.

## Design Principles

This package intentionally keeps a narrow scope:

- explicit mappings over fuzzy guessing
- path resolution over side effects
- shell-friendly output by default
- structured output when needed
- support for both human names and stable slugs

## Notes

- Universal agents map to `.agents/skills`
- Agent-specific integrations map to their own relative directories such as `.claude/skills`
- This package only resolves where skills belong. It does not install or validate skill contents.

## Development

```bash
npm install
npm run build
npm run test
npm run check
```

## Repository

- npm: [skills-dir](https://www.npmjs.com/package/skills-dir)
- GitHub: [Undertone0809/skills-dir](https://github.com/Undertone0809/skills-dir)
