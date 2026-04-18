import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { FileBlob, PresentationFile, SpreadsheetFile } from "@oai/artifact-tool";
import { runExecutiveBriefingDemo } from "../src/executive-briefing/demo.mjs";
import { parseGitHubRemote, parseSlackChannelIds } from "../src/executive-briefing/adapters.mjs";
import {
  collectIntegratedExecutiveBriefingContext,
  collectSampleExecutiveBriefingContext,
  synthesizeExecutiveBriefing,
} from "../src/executive-briefing/pipeline.mjs";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const inputDir = path.join(rootDir, "demo", "executive-briefing-machine", "inputs");

test("collects connector-ready sample context", async () => {
  const context = await collectSampleExecutiveBriefingContext({ inputDir });
  assert.equal(context.metrics.length, 6);
  assert.ok(context.items.length >= 10);
  assert.equal(context.integrations.length, 5);
  assert.ok(context.integrations.some((integration) => integration.source === "slack"));
  assert.ok(context.integrations.some((integration) => integration.source === "github"));
  assert.ok(context.integrations.some((integration) => integration.source === "computer-use"));
});

test("parses GitHub remote URLs", () => {
  assert.deepEqual(parseGitHubRemote("https://github.com/Laksh-star/codex-workflow-agents.git"), {
    owner: "Laksh-star",
    repo: "codex-workflow-agents",
  });
  assert.deepEqual(parseGitHubRemote("git@github.com:Laksh-star/codex-workflow-agents.git"), {
    owner: "Laksh-star",
    repo: "codex-workflow-agents",
  });
});

test("parses Slack channel ids from env-style strings", () => {
  assert.deepEqual(parseSlackChannelIds("C123,C456 C789"), ["C123", "C456", "C789"]);
  assert.deepEqual(parseSlackChannelIds(["C111", " C222 "]), ["C111", "C222"]);
});

test("collects live Slack context when token-backed adapter is provided", async () => {
  const fetchImpl = async (_url, options) => {
    const { channel } = JSON.parse(options.body);
    const responses = {
      C123: {
        ok: true,
        messages: [
          { ts: "1713420000.000500", subtype: "channel_join", text: "<@U123> has joined the channel" },
          {
            ts: "1713420000.000450",
            subtype: "bot_message",
            bot_id: "B123",
            text: ":satellite_antenna: Pipeline digest processed: 1800 items. Thread below with ranked opportunities.",
          },
          { ts: "1713420000.000425", text: "https://x.com/claudeai/status/2045248224659644654?s=20" },
          { ts: "1713420000.000300", text: "Need approval on the enterprise discount by EOD." },
          { ts: "1713420000.000200", text: "Growth experiment beat signup target by 18% this week." },
        ],
      },
      C456: {
        ok: true,
        messages: [
          { ts: "1713420000.000400", text: "Blocked on mobile crash fix after a new sev-1 incident." },
        ],
      },
    };

    return {
      ok: true,
      status: 200,
      statusText: "OK",
      async json() {
        return responses[channel] || { ok: true, messages: [] };
      },
    };
  };

  const context = await collectIntegratedExecutiveBriefingContext({
    inputDir,
    slack: {
      token: "test-slack-token",
      channels: [
        { id: "C123", label: "exec-updates" },
        { id: "C456", label: "eng-leadership" },
      ],
      fetchImpl,
    },
  });

  assert.ok(context.items.some((item) => item.text.includes("exec-updates: Growth experiment beat signup target")));
  assert.ok(context.items.some((item) => item.text.includes("eng-leadership: Blocked on mobile crash fix")));
  assert.ok(context.items.some((item) => item.kind === "ask" && item.text.includes("Need approval")));
  assert.ok(context.items.every((item) => !item.text.includes("has joined the channel")));
  assert.ok(context.items.every((item) => !item.text.includes("Pipeline digest processed")));
  assert.ok(context.items.every((item) => !item.text.includes("https://x.com/claudeai")));
  assert.ok(context.integrations.some((integration) => integration.status === "implemented" && integration.source === "slack"));
});

test("collects live GitHub context when token-backed adapter is provided", async () => {
  const routes = new Map([
    [
      "https://api.github.com/repos/Laksh-star/codex-workflow-agents/pulls?state=closed&sort=updated&direction=desc&per_page=10",
      [
        { number: 12, title: "Ship connector-ready pipeline", merged_at: "2026-04-17T08:00:00Z" },
        { number: 11, title: "Close old draft", merged_at: null },
      ],
    ],
    [
      "https://api.github.com/repos/Laksh-star/codex-workflow-agents/pulls?state=open&sort=updated&direction=desc&per_page=10",
      [{ number: 14, title: "Add automation wiring" }],
    ],
    [
      "https://api.github.com/repos/Laksh-star/codex-workflow-agents/issues?state=open&sort=updated&direction=desc&per_page=10",
      [{ number: 9, title: "Fix flaky workbook preview" }],
    ],
  ]);

  const fetchImpl = async (url) => ({
    ok: true,
    status: 200,
    statusText: "OK",
    async json() {
      return routes.get(url) || [];
    },
  });

  const context = await collectIntegratedExecutiveBriefingContext({
    inputDir,
    github: {
      token: "test-token",
      owner: "Laksh-star",
      repo: "codex-workflow-agents",
      fetchImpl,
    },
  });

  assert.ok(context.items.some((item) => item.text.includes("Merged PR #12")));
  assert.ok(context.items.some((item) => item.text.includes("Open issue #9")));
  assert.ok(context.items.some((item) => item.text.includes("Open PR #14")));
  assert.ok(context.integrations.some((integration) => integration.status === "implemented" && integration.source === "github"));
});

test("synthesizes the executive briefing narrative", async () => {
  const context = await collectSampleExecutiveBriefingContext({ inputDir });
  const briefing = synthesizeExecutiveBriefing(context, { generatedOn: "2026-04-17" });
  assert.match(briefing.headline, /Growth and efficiency improved/);
  assert.equal(briefing.metrics[0].label, "ARR");
  assert.equal(briefing.highlights.length, 3);
  assert.equal(briefing.risks.length, 3);
  assert.ok(briefing.asks.length >= 4);
  assert.equal(briefing.periodLabel, "May 2026 to Jun 2026");
});

test("generates workbook, deck, summary, and report artifacts", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-briefing-demo-"));
  const result = await runExecutiveBriefingDemo({ rootDir, inputDir, outputDir: tempDir, generatedOn: "2026-04-17" });

  const workbookBlob = await FileBlob.load(result.paths.workbookPath);
  const workbook = await SpreadsheetFile.importXlsx(workbookBlob);
  const deckBlob = await FileBlob.load(result.paths.deckPath);
  const presentation = await PresentationFile.importPptx(deckBlob);

  assert.equal(workbook.worksheets.items.length, 3);
  assert.equal(presentation.slides.items.length, 5);

  const summaryText = await fs.readFile(result.paths.summaryPath, "utf8");
  const reportText = await fs.readFile(result.paths.reportPath, "utf8");
  assert.match(summaryText, /Executive Briefing Summary/);
  assert.match(summaryText, /Growth and efficiency improved this month/);
  assert.match(reportText, /connector-ready adapters/);
  assert.match(reportText, /computer-use/);
});
