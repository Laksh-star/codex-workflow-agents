import fs from "node:fs/promises";
import path from "node:path";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(rootDir, "outputs", "product-strategy");
const outputPath = path.join(outDir, "codex-non-coding-workflows.xlsx");

const scores = [
  {
    useCase: "Personal Chief of Staff",
    persona: "Founder / Executive",
    frequency: 5,
    businessImpact: 5,
    implementationEase: 4,
    artifactStrength: 4,
    computerUseLeverage: 4,
    summary: "Daily triage, follow-up, and commitment tracking across collaboration tools.",
  },
  {
    useCase: "Executive Briefing Machine",
    persona: "Founder / Business Lead",
    frequency: 4,
    businessImpact: 5,
    implementationEase: 4,
    artifactStrength: 5,
    computerUseLeverage: 5,
    summary: "Recurring board and leadership briefing workflow with KPI pack and deck output.",
  },
  {
    useCase: "Daily Leadership Digest",
    persona: "Manager / Director / VP",
    frequency: 5,
    businessImpact: 4,
    implementationEase: 5,
    artifactStrength: 3,
    computerUseLeverage: 2,
    summary: "Cross-team daily digest of progress, blockers, and escalations.",
  },
  {
    useCase: "Deal Desk Assistant",
    persona: "Sales / CS / RevOps",
    frequency: 4,
    businessImpact: 5,
    implementationEase: 3,
    artifactStrength: 5,
    computerUseLeverage: 5,
    summary: "Account review and renewal-risk packaging across collaboration and UI-only systems.",
  },
  {
    useCase: "Customer Voice Aggregator",
    persona: "Product / Support / GTM",
    frequency: 4,
    businessImpact: 4,
    implementationEase: 4,
    artifactStrength: 5,
    computerUseLeverage: 3,
    summary: "Theme extraction and evidence packaging from feedback channels and research.",
  },
];

for (const row of scores) {
  row.weightedScore =
    row.frequency * 0.2 +
    row.businessImpact * 0.3 +
    row.implementationEase * 0.15 +
    row.artifactStrength * 0.2 +
    row.computerUseLeverage * 0.15;
}

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const matrix = workbook.worksheets.add("Use Case Matrix");
const differentiators = workbook.worksheets.add("Differentiators");

function setColumnWidths(sheet, widths) {
  widths.forEach((width, index) => {
    const column = sheet.__getOrCreateSingleColumn(index);
    column.width = width;
    column.customWidth = true;
  });
}

function setRowHeight(sheet, rowIndex, height) {
  const row = sheet.__getOrCreateRow(rowIndex);
  row.height = height;
  row.customHeight = true;
}

summary.getRange("A1:A2").values = [[
  "Codex Non-Coding Workflows",
], [
  "Strategy workbook for prioritization, packaging, and launch sequencing.",
]];

const kpiHeaders = ["Top Tier", "Tier 2", "Tier 3", "Avg Impact", "Avg Ease", "Avg Artifact Strength"];
const kpiValues = [
  [
    "Chief of Staff + Daily Digest",
    "Executive Briefing Machine",
    "Deal Desk + Customer Voice",
    Number((scores.reduce((sum, row) => sum + row.businessImpact, 0) / scores.length).toFixed(1)),
    Number((scores.reduce((sum, row) => sum + row.implementationEase, 0) / scores.length).toFixed(1)),
    Number((scores.reduce((sum, row) => sum + row.artifactStrength, 0) / scores.length).toFixed(1)),
  ],
];
summary.getRange("A4:F4").values = [kpiHeaders];
summary.getRange("A5:F5").values = kpiValues;
summary.getRange("A4:F5").style = {
  hAlign: "center",
  vAlign: "center",
  border: true,
};
summary.getRange("A4:F4").style = {
  bold: true,
  fill: "#DCEAFE",
  fontColor: "#0F172A",
};
summary.getRange("A5:F5").style = {
  fill: "#F8FAFC",
};

summary.getRange("A7:D7").values = [["Priority", "Theme", "Workflow", "Why now"]];
summary.getRange("A8:D12").values = [
  ["1", "Lead with high-frequency workflows", "Chief of Staff and Daily Digest", "Fastest proof of recurring value"],
  ["2", "Show the artifact wedge", "Executive Briefing Machine", "Best visible demo of editable deliverables"],
  ["3", "Use `computer-use` selectively", "Deal Desk Assistant", "Best fit when systems are UI-only"],
  ["4", "Expand into voice-of-customer", "Customer Voice Aggregator", "Strong cross-functional story after the core wedge"],
  ["5", "Repeat on cadence", "All workflows", "Recurring automation is part of the product story"],
];
summary.getRange("A7:D12").style = {
  border: true,
  wrapText: true,
  vAlign: "center",
};
summary.getRange("A7:D7").style = { bold: true, fill: "#F1F5F9" };

const matrixHeaders = [
  "Use Case",
  "Persona",
  "Frequency",
  "Business Impact",
  "Implementation Ease",
  "Artifact Strength",
  "Computer-Use Leverage",
  "Weighted Score",
  "Summary",
];
matrix.getRange("A1:I1").values = [matrixHeaders];
matrix.getRange("A2:I6").values = scores.map((row) => [
  row.useCase,
  row.persona,
  row.frequency,
  row.businessImpact,
  row.implementationEase,
  row.artifactStrength,
  row.computerUseLeverage,
  row.weightedScore,
  row.summary,
]);
matrix.getRange("A1:I6").style = {
  border: true,
  vAlign: "center",
};
matrix.getRange("A1:I1").style = {
  bold: true,
  fill: "#DBEAFE",
};
matrix.getRange("A2:I6").style = {
  wrapText: true,
  fill: "#FFFFFF",
};

differentiators.getRange("A1:C1").values = [["Capability", "Unlocks", "Why it matters"]];
differentiators.getRange("A2:C7").values = [
  ["Excel", "KPI packs, trackers, scorecards", "Outputs are usable by operators and finance teams."],
  ["PowerPoint", "Board decks, QBRs, briefings", "Outputs are presentation-ready and editable."],
  ["Slack / Teams / GitHub", "Live operating context", "Removes manual copy-paste and stale inputs."],
  ["Automations", "Recurring briefs and reminders", "Moves from one-shot prompting to follow-through."],
  ["Computer-use", "UI-only systems and portals", "Extends coverage beyond available APIs."],
  ["Image generation", "Polished visuals for decks and training", "Improves communication quality when visuals matter."],
];
differentiators.getRange("A1:C7").style = {
  border: true,
  wrapText: true,
  vAlign: "center",
};
differentiators.getRange("A1:C1").style = {
  bold: true,
  fill: "#DCFCE7",
};

summary.freezePanes.freezeRows(6);
matrix.freezePanes.freezeRows(1);
differentiators.freezePanes.freezeRows(1);

setColumnWidths(summary, [80, 220, 220, 320, 110, 130]);
setColumnWidths(matrix, [220, 160, 90, 100, 120, 110, 130, 110, 340]);
setColumnWidths(differentiators, [160, 240, 360]);

setRowHeight(summary, 0, 32);
setRowHeight(summary, 1, 60);
setRowHeight(summary, 3, 24);
setRowHeight(summary, 4, 24);
for (let rowIndex = 7; rowIndex <= 11; rowIndex += 1) {
  setRowHeight(summary, rowIndex, 34);
}
for (let rowIndex = 1; rowIndex <= 5; rowIndex += 1) {
  setRowHeight(matrix, rowIndex, 36);
}
for (let rowIndex = 1; rowIndex <= 6; rowIndex += 1) {
  setRowHeight(differentiators, rowIndex, 36);
}

await fs.mkdir(outDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

console.log(outputPath);
