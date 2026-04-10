import type { AgentDefinition } from "./types.js";

function aliases(...values: string[]): string[] {
  return values;
}

export const AGENT_REGISTRY: readonly AgentDefinition[] = Object.freeze([
  {
    id: "amp",
    name: "Amp",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("amp")
  },
  {
    id: "antigravity",
    name: "Antigravity",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("antigravity")
  },
  {
    id: "cline",
    name: "Cline",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("cline")
  },
  {
    id: "codex",
    name: "Codex",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("codex", "openai codex")
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("cursor")
  },
  {
    id: "deep-agents",
    name: "Deep Agents",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("deep agents", "deep-agents")
  },
  {
    id: "firebender",
    name: "Firebender",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("firebender")
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("gemini cli", "gemini-cli")
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("github copilot", "github-copilot", "copilot")
  },
  {
    id: "kimi-code-cli",
    name: "Kimi Code CLI",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("kimi code cli", "kimi-code-cli", "kimi code")
  },
  {
    id: "opencode",
    name: "OpenCode",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("opencode", "open code")
  },
  {
    id: "warp",
    name: "Warp",
    category: "universal",
    relativePath: ".agents/skills",
    aliases: aliases("warp")
  },
  {
    id: "augment",
    name: "Augment",
    category: "agent-specific",
    relativePath: ".augment/skills",
    aliases: aliases("augment")
  },
  {
    id: "ibm-bob",
    name: "IBM Bob",
    category: "agent-specific",
    relativePath: ".bob/skills",
    aliases: aliases("ibm bob", "ibm-bob", "bob")
  },
  {
    id: "claude-code",
    name: "Claude Code",
    category: "agent-specific",
    relativePath: ".claude/skills",
    aliases: aliases("claude code", "claude-code", "claude_code")
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    category: "agent-specific",
    relativePath: "skills",
    aliases: aliases("openclaw", "open-claw", "open claw")
  },
  {
    id: "codebuddy",
    name: "CodeBuddy",
    category: "agent-specific",
    relativePath: ".codebuddy/skills",
    aliases: aliases("codebuddy", "code buddy")
  },
  {
    id: "command-code",
    name: "Command Code",
    category: "agent-specific",
    relativePath: ".commandcode/skills",
    aliases: aliases("command code", "command-code")
  },
  {
    id: "continue",
    name: "Continue",
    category: "agent-specific",
    relativePath: ".continue/skills",
    aliases: aliases("continue")
  },
  {
    id: "cortex-code",
    name: "Cortex Code",
    category: "agent-specific",
    relativePath: ".cortex/skills",
    aliases: aliases("cortex code", "cortex-code")
  },
  {
    id: "crush",
    name: "Crush",
    category: "agent-specific",
    relativePath: ".crush/skills",
    aliases: aliases("crush")
  },
  {
    id: "droid",
    name: "Droid",
    category: "agent-specific",
    relativePath: ".factory/skills",
    aliases: aliases("droid")
  },
  {
    id: "goose",
    name: "Goose",
    category: "agent-specific",
    relativePath: ".goose/skills",
    aliases: aliases("goose")
  },
  {
    id: "junie",
    name: "Junie",
    category: "agent-specific",
    relativePath: ".junie/skills",
    aliases: aliases("junie")
  },
  {
    id: "iflow-cli",
    name: "iFlow CLI",
    category: "agent-specific",
    relativePath: ".iflow/skills",
    aliases: aliases("iflow cli", "iflow-cli", "iflow")
  },
  {
    id: "kilo-code",
    name: "Kilo Code",
    category: "agent-specific",
    relativePath: ".kilocode/skills",
    aliases: aliases("kilo code", "kilo-code")
  },
  {
    id: "kiro-cli",
    name: "Kiro CLI",
    category: "agent-specific",
    relativePath: ".kiro/skills",
    aliases: aliases("kiro cli", "kiro-cli", "kiro")
  },
  {
    id: "kode",
    name: "Kode",
    category: "agent-specific",
    relativePath: ".kode/skills",
    aliases: aliases("kode")
  },
  {
    id: "mcpjam",
    name: "MCPJam",
    category: "agent-specific",
    relativePath: ".mcpjam/skills",
    aliases: aliases("mcpjam", "mcp jam")
  },
  {
    id: "mistral-vibe",
    name: "Mistral Vibe",
    category: "agent-specific",
    relativePath: ".vibe/skills",
    aliases: aliases("mistral vibe", "mistral-vibe", "vibe")
  },
  {
    id: "mux",
    name: "Mux",
    category: "agent-specific",
    relativePath: ".mux/skills",
    aliases: aliases("mux")
  },
  {
    id: "openhands",
    name: "OpenHands",
    category: "agent-specific",
    relativePath: ".openhands/skills",
    aliases: aliases("openhands", "open hands")
  },
  {
    id: "pi",
    name: "Pi",
    category: "agent-specific",
    relativePath: ".pi/skills",
    aliases: aliases("pi")
  },
  {
    id: "qoder",
    name: "Qoder",
    category: "agent-specific",
    relativePath: ".qoder/skills",
    aliases: aliases("qoder")
  },
  {
    id: "qwen-code",
    name: "Qwen Code",
    category: "agent-specific",
    relativePath: ".qwen/skills",
    aliases: aliases("qwen code", "qwen-code")
  },
  {
    id: "roo-code",
    name: "Roo Code",
    category: "agent-specific",
    relativePath: ".roo/skills",
    aliases: aliases("roo code", "roo-code")
  },
  {
    id: "trae",
    name: "Trae",
    category: "agent-specific",
    relativePath: ".trae/skills",
    aliases: aliases("trae")
  },
  {
    id: "trae-cn",
    name: "Trae CN",
    category: "agent-specific",
    relativePath: ".trae/skills",
    aliases: aliases("trae cn", "trae-cn")
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "agent-specific",
    relativePath: ".windsurf/skills",
    aliases: aliases("windsurf")
  },
  {
    id: "zencoder",
    name: "Zencoder",
    category: "agent-specific",
    relativePath: ".zencoder/skills",
    aliases: aliases("zencoder")
  },
  {
    id: "neovate",
    name: "Neovate",
    category: "agent-specific",
    relativePath: ".neovate/skills",
    aliases: aliases("neovate")
  },
  {
    id: "pochi",
    name: "Pochi",
    category: "agent-specific",
    relativePath: ".pochi/skills",
    aliases: aliases("pochi")
  },
  {
    id: "adal",
    name: "AdaL",
    category: "agent-specific",
    relativePath: ".adal/skills",
    aliases: aliases("adal", "ada l", "ada-l")
  }
]);
