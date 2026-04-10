import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { AGENT_REGISTRY } from "./registry.js";
import type {
  AgentDefinition,
  ResolveSkillDirOptions,
  ResolveSkillDirsOptions,
  ResolutionScope,
  SkillDirResult,
  SkillScope
} from "./types.js";

function normalizeAgentInput(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const AGENT_LOOKUP = new Map<string, AgentDefinition>();

for (const agent of AGENT_REGISTRY) {
  const entries = [agent.id, agent.name, ...agent.aliases];
  for (const entry of entries) {
    AGENT_LOOKUP.set(normalizeAgentInput(entry), agent);
  }
}

function resolveBaseDir(scope: SkillScope, options: ResolveSkillDirOptions): string {
  if (scope === "global") {
    return options.homeDir ?? homedir();
  }

  return options.cwd ?? process.cwd();
}

function toResult(
  agent: AgentDefinition,
  scope: SkillScope,
  options: ResolveSkillDirOptions
): SkillDirResult {
  const baseDir = resolveBaseDir(scope, options);
  const resolvedPath = path.resolve(baseDir, agent.relativePath);
  const result: SkillDirResult = {
    agentId: agent.id,
    agentName: agent.name,
    category: agent.category,
    scope,
    relativePath: agent.relativePath,
    path: resolvedPath
  };

  if (options.checkExists) {
    result.exists = existsSync(resolvedPath);
  }

  return result;
}

export type {
  AgentCategory,
  AgentDefinition,
  ResolveSkillDirOptions,
  ResolveSkillDirsOptions,
  ResolutionScope,
  SkillDirResult,
  SkillScope
} from "./types.js";

export function listAgents(): AgentDefinition[] {
  return AGENT_REGISTRY.map((agent) => ({
    ...agent,
    aliases: [...agent.aliases]
  }));
}

export function findAgent(input: string): AgentDefinition | null {
  const normalized = normalizeAgentInput(input);
  if (!normalized) {
    return null;
  }

  const agent = AGENT_LOOKUP.get(normalized);
  return agent ? { ...agent, aliases: [...agent.aliases] } : null;
}

export function resolveSkillDir(
  agentInput: string | AgentDefinition,
  options: ResolveSkillDirOptions = {}
): SkillDirResult {
  const agent =
    typeof agentInput === "string"
      ? findAgent(agentInput)
      : { ...agentInput, aliases: [...agentInput.aliases] };

  if (!agent) {
    throw new Error(`Unknown agent: ${String(agentInput)}`);
  }

  const scope = options.scope ?? "project";
  return toResult(agent, scope, options);
}

export function resolveSkillDirs(
  agentInput: string | AgentDefinition,
  options: ResolveSkillDirsOptions = {}
): SkillDirResult[] {
  const scope: ResolutionScope = options.scope ?? "all";

  if (scope === "all") {
    return [
      resolveSkillDir(agentInput, { ...options, scope: "project" }),
      resolveSkillDir(agentInput, { ...options, scope: "global" })
    ];
  }

  return [resolveSkillDir(agentInput, { ...options, scope })];
}
