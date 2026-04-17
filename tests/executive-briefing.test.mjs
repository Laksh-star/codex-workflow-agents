import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { FileBlob, PresentationFile, SpreadsheetFile } from "@oai/artifact-tool";
import { runExecutiveBriefingDemo } from "../src/executive-briefing/demo.mjs";
import { collectSampleExecutiveBriefingContext, synthesizeExecutiveBriefing } from "../src/executive-briefing/pipeline.mjs";

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
