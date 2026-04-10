# skills-dir

Resolve skill installation directories for AI agents in `global` and `project` scopes.

## Install

```bash
npx skills-dir codex --scope global
npx skills-dir claude-code --scope project
```

## CLI

```bash
skills-dir <agent> [--scope global|project|all] [--cwd <path>] [--json] [--check]
skills-dir list [--json]
```

Examples:

```bash
npx skills-dir codex
npx skills-dir codex --scope global
npx skills-dir "Claude Code" --scope project
npx skills-dir claude-code --json
npx skills-dir list --json
```

Default behavior:

- `scope=all`
- text mode prints one path per line
- `--json` returns structured data
- `--check` adds `exists` to each result

## SDK

```ts
import { listAgents, resolveSkillDir, resolveSkillDirs } from "skills-dir";

const codexGlobal = resolveSkillDir("codex", { scope: "global" });
const claudePaths = resolveSkillDirs("claude-code");
const agents = listAgents();
```

## Scopes

- `global`: resolve against the user's home directory
- `project`: resolve against the current working directory or a custom `cwd`
- `all`: resolve both `project` and `global`

## Notes

- Universal agents map to `.agents/skills`
- Agent-specific integrations map to their own relative directories such as `.claude/skills`
- This package only resolves where skills belong. It does not install or validate skill contents.
