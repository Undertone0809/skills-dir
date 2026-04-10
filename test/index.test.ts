import { existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import {
  findAgent,
  listAgents,
  resolveSkillDir,
  resolveSkillDirs
} from "../src/index.js";
import { runCli } from "../src/cli.js";

function makeTempDir(prefix: string): string {
  return mkdtempSync(path.join(tmpdir(), prefix));
}

function makeStreams() {
  let stdout = "";
  let stderr = "";

  return {
    streams: {
      stdout: {
        write(chunk: string) {
          stdout += chunk;
          return true;
        }
      },
      stderr: {
        write(chunk: string) {
          stderr += chunk;
          return true;
        }
      }
    },
    output() {
      return { stdout, stderr };
    }
  };
}

test("listAgents includes configured agents", () => {
  const agents = listAgents();
  assert.ok(agents.length >= 40);
  assert.equal(agents.find((agent) => agent.id === "codex")?.relativePath, ".agents/skills");
  assert.equal(agents.find((agent) => agent.id === "claude-code")?.relativePath, ".claude/skills");
});

test("findAgent supports normalized aliases", () => {
  assert.equal(findAgent("Claude Code")?.id, "claude-code");
  assert.equal(findAgent("claude_code")?.id, "claude-code");
  assert.equal(findAgent("claude-code")?.id, "claude-code");
  assert.equal(findAgent("Trae CN")?.id, "trae-cn");
});

test("resolveSkillDir resolves universal and specific paths", () => {
  const cwd = "/tmp/project-alpha";
  const homeDir = "/tmp/home-alpha";

  assert.equal(resolveSkillDir("codex", { scope: "global", homeDir }).path, "/tmp/home-alpha/.agents/skills");
  assert.equal(resolveSkillDir("codex", { scope: "project", cwd }).path, "/tmp/project-alpha/.agents/skills");
  assert.equal(
    resolveSkillDir("claude-code", { scope: "global", homeDir }).path,
    "/tmp/home-alpha/.claude/skills"
  );
  assert.equal(
    resolveSkillDir("claude-code", { scope: "project", cwd }).path,
    "/tmp/project-alpha/.claude/skills"
  );
  assert.equal(resolveSkillDir("openclaw", { scope: "project", cwd }).path, "/tmp/project-alpha/skills");
});

test("resolveSkillDirs defaults to project then global", () => {
  const cwd = "/tmp/project-beta";
  const homeDir = "/tmp/home-beta";
  const results = resolveSkillDirs("claude-code", { cwd, homeDir });

  assert.deepEqual(
    results.map((result) => [result.scope, result.path]),
    [
      ["project", "/tmp/project-beta/.claude/skills"],
      ["global", "/tmp/home-beta/.claude/skills"]
    ]
  );
});

test("resolveSkillDir can check existence without failing", () => {
  const cwd = makeTempDir("skills-dir-project-");
  const expectedPath = path.join(cwd, ".claude", "skills");

  let result = resolveSkillDir("claude-code", { scope: "project", cwd, checkExists: true });
  assert.equal(result.exists, false);

  mkdirSync(expectedPath, { recursive: true });
  assert.equal(existsSync(expectedPath), true);

  result = resolveSkillDir("claude-code", { scope: "project", cwd, checkExists: true });
  assert.equal(result.exists, true);
});

test("CLI prints both paths by default", () => {
  const cwd = makeTempDir("skills-dir-cli-project-");
  const homeDir = makeTempDir("skills-dir-cli-home-");
  const capture = makeStreams();
  const previousHome = process.env.HOME;

  process.env.HOME = homeDir;

  try {
    const exitCode = runCli(["claude-code", `--cwd=${cwd}`], capture.streams);
    assert.equal(exitCode, 0);

    const { stdout, stderr } = capture.output();
    assert.equal(stderr, "");
    assert.equal(stdout.trim(), `${path.join(cwd, ".claude/skills")}\n${path.join(homeDir, ".claude/skills")}`);
  } finally {
    process.env.HOME = previousHome;
  }
});

test("CLI json mode emits a single object for scoped queries", () => {
  const cwd = makeTempDir("skills-dir-cli-json-");
  const capture = makeStreams();
  const exitCode = runCli(["codex", "--scope", "project", "--cwd", cwd, "--json"], capture.streams);

  assert.equal(exitCode, 0);
  const { stdout, stderr } = capture.output();
  assert.equal(stderr, "");

  const parsed = JSON.parse(stdout);
  assert.equal(parsed.agentId, "codex");
  assert.equal(parsed.scope, "project");
  assert.equal(parsed.path, path.join(cwd, ".agents/skills"));
});

test("CLI check mode includes exists and list mode works", () => {
  const cwd = makeTempDir("skills-dir-cli-check-");
  const skillPath = path.join(cwd, ".agents", "skills");
  mkdirSync(skillPath, { recursive: true });

  const capture = makeStreams();
  const exitCode = runCli(["codex", "--scope=project", `--cwd=${cwd}`, "--check", "--json"], capture.streams);
  assert.equal(exitCode, 0);

  const parsed = JSON.parse(capture.output().stdout);
  assert.equal(parsed.exists, true);

  const listCapture = makeStreams();
  const listExitCode = runCli(["list"], listCapture.streams);
  assert.equal(listExitCode, 0);
  assert.match(listCapture.output().stdout, /codex\tCodex\tuniversal\t\.agents\/skills/);
});

test("CLI returns a non-zero exit code for unknown agents", () => {
  const capture = makeStreams();
  const exitCode = runCli(["totally-unknown-agent"], capture.streams);

  assert.equal(exitCode, 1);
  assert.match(capture.output().stderr, /Unknown agent/);
});
