import path from "node:path";
import { buildDeckFile, buildWorkbook, writeNarrativePlan, writeReport, writeSummary } from "./artifacts.mjs";
import { collectSampleExecutiveBriefingContext, synthesizeExecutiveBriefing } from "./pipeline.mjs";

export async function runExecutiveBriefingDemo({
  rootDir,
  inputDir = path.join(rootDir, "demo", "executive-briefing-machine", "inputs"),
  outputDir = path.join(rootDir, "outputs", "executive-briefing-machine-demo"),
  uiCapturePath = null,
  generatedOn = "2026-04-17",
} = {}) {
  const workbookPath = path.join(outputDir, "executive-briefing-demo.xlsx");
  const deckPath = path.join(outputDir, "executive-briefing-demo.pptx");
  const summaryPath = path.join(outputDir, "briefing-summary.md");
  const reportPath = path.join(outputDir, "demo-run-report.md");
  const narrativePath = path.join(outputDir, "narrative_plan.md");

  const context = await collectSampleExecutiveBriefingContext({ inputDir, uiCapturePath });
  const data = synthesizeExecutiveBriefing(context, { generatedOn });

  await buildWorkbook(data, workbookPath);
  await buildDeckFile(data, deckPath);
  await writeSummary(data, summaryPath);
  await writeNarrativePlan(narrativePath);
  await writeReport(data, reportPath, {
    inputFiles: [
      path.join(inputDir, "slack_updates.md"),
      path.join(inputDir, "github_updates.md"),
      path.join(inputDir, "leadership_notes.md"),
      path.join(inputDir, "kpis.csv"),
    ],
    outputFiles: [workbookPath, deckPath, summaryPath, reportPath, narrativePath],
  });

  return {
    context,
    data,
    paths: { workbookPath, deckPath, summaryPath, reportPath, narrativePath },
  };
}
