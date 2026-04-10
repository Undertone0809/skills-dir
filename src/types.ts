export type AgentCategory = "universal" | "agent-specific";
export type SkillScope = "global" | "project";
export type ResolutionScope = SkillScope | "all";

export interface AgentDefinition {
  id: string;
  name: string;
  category: AgentCategory;
  relativePath: string;
  aliases: string[];
}

export interface ResolveSkillDirOptions {
  scope?: SkillScope;
  cwd?: string;
  homeDir?: string;
  checkExists?: boolean;
}

export interface ResolveSkillDirsOptions {
  scope?: ResolutionScope;
  cwd?: string;
  homeDir?: string;
  checkExists?: boolean;
}

export interface SkillDirResult {
  agentId: string;
  agentName: string;
  category: AgentCategory;
  scope: SkillScope;
  relativePath: string;
  path: string;
  exists?: boolean;
}
