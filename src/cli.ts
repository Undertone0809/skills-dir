import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { listAgents, resolveSkillDirs } from "./index.js";
import type { ResolveSkillDirsOptions, ResolutionScope, SkillDirResult } from "./types.js";

interface CliStreams {
  stdout: Pick<NodeJS.WriteStream, "write">;
  stderr: Pick<NodeJS.WriteStream, "write">;
}

interface ParsedArgs {
  help: boolean;
  version: boolean;
  json: boolean;
  check: boolean;
  cwd?: string;
  scope: ResolutionScope;
  command?: string;
  agent?: string;
}

function formatAgentsAsText(): string {
  return listAgents()
    .map((agent) => `${agent.id}\t${agent.name}\t${agent.category}\t${agent.relativePath}`)
    .join("\n");
}

function usage(): string {
  return [
    "skills-dir <agent> [--scope global|project|all] [--cwd <path>] [--json] [--check]",
    "skills-dir list [--json]",
    "",
    "Examples:",
    "  skills-dir codex",
    "  skills-dir claude-code --scope project",
    "  skills-dir list --json"
  ].join("\n");
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    help: false,
    version: false,
    json: false,
    check: false,
    scope: "all"
  };

  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--version" || arg === "-v") {
      parsed.version = true;
      continue;
    }

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--check") {
      parsed.check = true;
      continue;
    }

    if (arg === "--scope") {
      parsed.scope = (argv[index + 1] as ResolutionScope | undefined) ?? "all";
      index += 1;
      continue;
    }

    if (arg.startsWith("--scope=")) {
      parsed.scope = arg.slice("--scope=".length) as ResolutionScope;
      continue;
    }

    if (arg === "--cwd") {
      parsed.cwd = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      parsed.cwd = arg.slice("--cwd=".length);
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positionals.push(arg);
  }

  if (positionals[0] === "list") {
    parsed.command = "list";
    return parsed;
  }

  if (positionals[0]) {
    parsed.command = "resolve";
    parsed.agent = positionals.join(" ");
  }

  return parsed;
}

function validateScope(scope: string): asserts scope is ResolutionScope {
  if (scope !== "global" && scope !== "project" && scope !== "all") {
    throw new Error(`Invalid scope: ${scope}`);
  }
}

function writeJson(streams: CliStreams, data: unknown): void {
  streams.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

function writePaths(streams: CliStreams, results: SkillDirResult[]): void {
  streams.stdout.write(`${results.map((result) => result.path).join("\n")}\n`);
}

export function runCli(argv: string[], streams: CliStreams = process): number {
  try {
    const parsed = parseArgs(argv);

    if (parsed.help) {
      streams.stdout.write(`${usage()}\n`);
      return 0;
    }

    if (parsed.version) {
      streams.stdout.write("0.1.0\n");
      return 0;
    }

    validateScope(parsed.scope);

    if (parsed.command === "list") {
      if (parsed.json) {
        writeJson(streams, listAgents());
      } else {
        streams.stdout.write(`${formatAgentsAsText()}\n`);
      }
      return 0;
    }

    if (!parsed.agent) {
      streams.stderr.write(`${usage()}\n`);
      return 1;
    }

    const options: ResolveSkillDirsOptions = {
      scope: parsed.scope,
      cwd: parsed.cwd,
      checkExists: parsed.check
    };
    const results = resolveSkillDirs(parsed.agent, options);

    if (parsed.json) {
      writeJson(streams, parsed.scope === "all" ? results : results[0]);
    } else {
      writePaths(streams, results);
    }

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    streams.stderr.write(`${message}\n`);
    return 1;
  }
}

const executedFile = process.argv[1] ? realpathSync(process.argv[1]) : null;
const moduleFile = fileURLToPath(import.meta.url);

if (executedFile === moduleFile) {
  const exitCode = runCli(process.argv.slice(2));
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}
