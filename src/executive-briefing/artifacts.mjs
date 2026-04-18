import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile, Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const colors = {
  ink: "#0F172A",
  slate: "#334155",
  line: "#CBD5E1",
  paper: "#F8FAFC",
  white: "#FFFFFF",
  blue: "#2563EB",
  green: "#0F766E",
  amber: "#D97706",
  rose: "#BE123C",
  softBlue: "#DBEAFE",
  softGreen: "#DCFCE7",
  softAmber: "#FEF3C7",
  softRose: "#FFE4E6",
};

function setColumnWidths(sheet, widths) {
  widths.forEach((width, index) => {
    const column = sheet.__getOrCreateSingleColumn(index);
    column.width = width;
    column.customWidth = true;
  });
}

function setRowHeights(sheet, start, end, height) {
  for (let index = start; index <= end; index += 1) {
    const row = sheet.__getOrCreateRow(index);
    row.height = height;
    row.customHeight = true;
  }
}

export async function buildWorkbook(data, workbookPath) {
  const workbook = Workbook.create();
  const summary = workbook.worksheets.add("Executive Summary");
  const metricsSheet = workbook.worksheets.add("KPI Data");
  const sources = workbook.worksheets.add("Source Notes");

  summary.getRange("A1").values = [["Executive Briefing Machine Demo"]];
  summary.getRange("A2").values = [[data.headline]];
  summary.getRange("A4:C4").values = [["Metric", "Current", "Delta"]];
  summary.getRange("A5:C9").values = data.metrics.map((metric) => [metric.label, metric.current, metric.delta]);
  summary.getRange("E4:F4").values = [["Highlights", "Risks"]];
  summary.getRange("E5:F7").values = [
    [data.highlights[0] || "", data.risks[0] || ""],
    [data.highlights[1] || "", data.risks[1] || ""],
    [data.highlights[2] || "", data.risks[2] || ""],
  ];
  summary.getRange("A11:C11").values = [["Key asks", "Owner framing", "Why now"]];
  summary.getRange("A12:C15").values = [
    [data.asks[0] || "", "CEO / Legal", "Unblock enterprise deals"],
    [data.asks[1] || "", "Product / Engineering", "Reduce reliability risk before broader rollout"],
    [data.asks[2] || "", "Leadership team", "Keep the board narrative anchored in efficiency and readiness"],
    [data.asks[3] || "", "Exec staff", "Tie priorities to owners and dates"],
  ];

  summary.getRange("A1:C2").style = { wrapText: true, fill: colors.softBlue, fontColor: colors.ink };
  summary.getRange("A1").style = { bold: true, fontSize: 18 };
  summary.getRange("A2").style = { fontSize: 12 };
  summary.getRange("A4:C9").style = { border: true, wrapText: true };
  summary.getRange("E4:F7").style = { border: true, wrapText: true };
  summary.getRange("A11:C15").style = { border: true, wrapText: true };
  summary.getRange("A4:C4").style = { bold: true, fill: colors.softGreen };
  summary.getRange("E4:F4").style = { bold: true, fill: colors.softAmber };
  summary.getRange("A11:C11").style = { bold: true, fill: colors.softRose };

  metricsSheet.getRange("A1:F1").values = [[
    "Month",
    "ARR ($k)",
    "Qualified Pipeline ($k)",
    "Net Burn ($k)",
    "NRR (%)",
    "Sev-1 Incidents",
  ]];
  metricsSheet.getRange("A2:F7").values = data.kpis.map((row) => [
    row.monthLabel,
    row.arrK,
    row.qualifiedPipelineK,
    row.netBurnK,
    row.nrrPct,
    row.sev1Incidents,
  ]);
  metricsSheet.getRange("A1:F7").style = { border: true };
  metricsSheet.getRange("A1:F1").style = { bold: true, fill: colors.softBlue };

  const chart = metricsSheet.charts.add("line", metricsSheet.getRange("A1:C7"));
  chart.setPosition("H2", "N20");
  chart.title = "ARR and Qualified Pipeline Trend";
  chart.hasLegend = true;
  chart.xAxis = { axisType: "textAxis" };
  chart.yAxis = { numberFormatCode: "$#,##0" };

  const integrationRows = data.integrations.map((integration) => [integration.source, integration.status, integration.featureMapping]);
  const sourceRows = [
    ...data.highlights.map((item) => ["Slack/GitHub", "Highlight", item]),
    ...data.risks.map((item) => ["Slack/GitHub", "Risk", item]),
    ...data.asks.map((item) => ["Leadership/Slack", "Ask", item]),
    ...integrationRows,
  ];
  sources.getRange("A1:C1").values = [["Source", "Section", "Detail"]];
  sources.getRange(`A2:C${sourceRows.length + 1}`).values = sourceRows;
  sources.getRange(`A1:C${sourceRows.length + 1}`).style = { border: true, wrapText: true };
  sources.getRange("A1:C1").style = { bold: true, fill: colors.softGreen };

  summary.freezePanes.freezeRows(4);
  metricsSheet.freezePanes.freezeRows(1);
  sources.freezePanes.freezeRows(1);

  setColumnWidths(summary, [180, 180, 260, 30, 280, 280]);
  setColumnWidths(metricsSheet, [100, 100, 140, 110, 90, 120, 30, 120, 120, 120, 120, 120, 120, 120]);
  setColumnWidths(sources, [140, 160, 420]);
  setRowHeights(summary, 0, 1, 30);
  setRowHeights(summary, 4, 8, 34);
  setRowHeights(summary, 11, 14, 38);

  await fs.mkdir(path.dirname(workbookPath), { recursive: true });
  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  await xlsx.save(workbookPath);
}

function createPresentation() {
  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  presentation.theme.colorScheme = {
    name: "Executive Briefing Demo",
    themeColors: {
      accent1: colors.blue,
      accent2: colors.green,
      accent3: colors.amber,
      bg1: colors.paper,
      bg2: colors.white,
      tx1: colors.ink,
      tx2: colors.slate,
    },
  };
  return presentation;
}

function addSlideBackground(slide, accent = colors.blue) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 1280, height: 720 },
    fill: colors.paper,
    line: { style: "solid", fill: colors.paper, width: 0 },
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 1280, height: 18 },
    fill: accent,
    line: { style: "solid", fill: accent, width: 0 },
  });
}

function addText(slide, { left, top, width, height, text, fontSize = 22, color = colors.ink, bold = false }) {
  const shape = slide.shapes.add({
    geometry: "rect",
    position: { left, top, width, height },
    fill: "#00000000",
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  shape.text = text;
  shape.text.fontSize = fontSize;
  shape.text.color = color;
  shape.text.bold = bold;
  shape.text.typeface = bold ? "Poppins" : "Lato";
  shape.text.insets = { left: 0, right: 0, top: 0, bottom: 0 };
}

function addCard(slide, { left, top, width, height, title, body, accent = colors.blue }) {
  slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill: colors.white,
    line: { style: "solid", fill: colors.line, width: 1 },
  });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: left + 18, top: top + 18, width: 64, height: 10 },
    fill: accent,
    line: { style: "solid", fill: accent, width: 0 },
  });
  addText(slide, { left: left + 18, top: top + 40, width: width - 36, height: 34, text: title, fontSize: 24, bold: true });
  addText(slide, { left: left + 18, top: top + 84, width: width - 36, height: height - 100, text: body, fontSize: 16, color: colors.slate });
}

export function buildDeck(data) {
  const presentation = createPresentation();

  const cover = presentation.slides.add();
  addSlideBackground(cover, colors.blue);
  addText(cover, { left: 78, top: 88, width: 740, height: 46, text: "Executive Briefing Machine Demo", fontSize: 34, bold: true });
  addText(cover, { left: 78, top: 150, width: 760, height: 88, text: data.headline, fontSize: 24, color: colors.slate });
  addCard(cover, {
    left: 78,
    top: 300,
    width: 350,
    height: 230,
    title: "Period",
    body: `${data.periodLabel}\n\nGenerated from sample collaboration-style inputs with connector-ready adapters.`,
    accent: colors.green,
  });
  addCard(cover, {
    left: 460,
    top: 300,
    width: 350,
    height: 230,
    title: "Operating readout",
    body: data.narrative.slice(0, 2).join("\n\n"),
    accent: colors.amber,
  });
  addCard(cover, {
    left: 842,
    top: 180,
    width: 360,
    height: 350,
    title: "Watch item",
    body: data.narrative[2],
    accent: colors.rose,
  });

  const metricsSlide = presentation.slides.add();
  addSlideBackground(metricsSlide, colors.green);
  addText(metricsSlide, { left: 78, top: 72, width: 720, height: 40, text: "KPI snapshot", fontSize: 30, bold: true });
  data.metrics.forEach((metric, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    addCard(metricsSlide, {
      left: 78 + col * 380,
      top: 150 + row * 220,
      width: 340,
      height: 180,
      title: `${metric.label}: ${metric.current}`,
      body: metric.delta,
      accent: metric.tone === "positive" ? colors.green : colors.amber,
    });
  });

  const trendSlide = presentation.slides.add();
  addSlideBackground(trendSlide, colors.amber);
  addText(trendSlide, { left: 78, top: 72, width: 720, height: 40, text: "Growth and pipeline trend", fontSize: 30, bold: true });
  addCard(trendSlide, {
    left: 78,
    top: 150,
    width: 350,
    height: 470,
    title: "Readout",
    body: data.narrative.join("\n\n"),
    accent: colors.amber,
  });
  const chart = trendSlide.charts.add("line");
  chart.position = { left: 470, top: 150, width: 700, height: 420 };
  chart.title = "ARR and Qualified Pipeline";
  chart.categories = data.kpis.map((row) => row.monthLabel);
  chart.lineOptions.grouping = "standard";
  chart.hasLegend = true;
  chart.legend.position = "bottom";
  chart.plotAreaFill = colors.white;
  chart.titleTextStyle.fontSize = 20;
  chart.titleTextStyle.fill = colors.ink;
  chart.titleTextStyle.typeface = "Poppins";
  chart.legend.textStyle.fontSize = 14;
  chart.legend.textStyle.typeface = "Lato";
  chart.xAxis.textStyle.fontSize = 14;
  chart.xAxis.textStyle.typeface = "Lato";
  chart.yAxis.textStyle.fontSize = 14;
  chart.yAxis.textStyle.typeface = "Lato";
  const arrSeries = chart.series.add("ARR ($k)");
  arrSeries.values = data.kpis.map((row) => row.arrK);
  arrSeries.categories = chart.categories;
  arrSeries.stroke = { width: 3, style: "solid", fill: colors.blue };
  arrSeries.fill = colors.blue;
  const pipelineSeries = chart.series.add("Qualified Pipeline ($k)");
  pipelineSeries.values = data.kpis.map((row) => row.qualifiedPipelineK);
  pipelineSeries.categories = chart.categories;
  pipelineSeries.stroke = { width: 3, style: "solid", fill: colors.green };
  pipelineSeries.fill = colors.green;

  const updatesSlide = presentation.slides.add();
  addSlideBackground(updatesSlide, colors.rose);
  addText(updatesSlide, { left: 78, top: 72, width: 720, height: 40, text: "Highlights and risks", fontSize: 30, bold: true });
  addCard(updatesSlide, {
    left: 78,
    top: 150,
    width: 520,
    height: 450,
    title: "Highlights",
    body: data.highlights.map((item, index) => `${index + 1}. ${item}`).join("\n\n"),
    accent: colors.green,
  });
  addCard(updatesSlide, {
    left: 640,
    top: 150,
    width: 562,
    height: 450,
    title: "Risks",
    body: data.risks.map((item, index) => `${index + 1}. ${item}`).join("\n\n"),
    accent: colors.rose,
  });

  const askSlide = presentation.slides.add();
  addSlideBackground(askSlide, colors.blue);
  addText(askSlide, { left: 78, top: 72, width: 720, height: 40, text: "Immediate asks and next-week focus", fontSize: 30, bold: true });
  addCard(askSlide, {
    left: 78,
    top: 150,
    width: 520,
    height: 420,
    title: "Immediate asks",
    body: data.asks.map((item, index) => `${index + 1}. ${item}`).join("\n\n"),
    accent: colors.amber,
  });
  addCard(askSlide, {
    left: 640,
    top: 150,
    width: 562,
    height: 420,
    title: "Next week",
    body: [
      "1. Close the mobile crash hotfix and confirm session stability returns to baseline.",
      "2. Unblock enterprise security reviews with legal support and tighter turnaround ownership.",
      "3. Keep board-facing messaging anchored in pipeline credibility, burn discipline, and enterprise readiness.",
    ].join("\n\n"),
    accent: colors.blue,
  });

  return presentation;
}

export async function buildDeckFile(data, deckPath) {
  const presentation = buildDeck(data);
  await fs.mkdir(path.dirname(deckPath), { recursive: true });
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(deckPath);
}

export async function writeSummary(data, summaryPath) {
  const text = `# Executive Briefing Summary

Generated on: ${data.generatedOn}
Period: ${data.periodLabel}

## Headline

${data.headline}

## Narrative

- ${data.narrative.join("\n- ")}

## Highlights

- ${data.highlights.join("\n- ")}

## Risks

- ${data.risks.join("\n- ")}

## Immediate asks

- ${data.asks.join("\n- ")}
`;
  await fs.mkdir(path.dirname(summaryPath), { recursive: true });
  await fs.writeFile(summaryPath, text, "utf8");
}

export async function writeReport(data, reportPath, meta) {
  const report = `# Demo Run Report

Demo: Executive Briefing Machine
Run date: ${data.generatedOn}

## What this implements from the integrated architecture

- connector-ready adapters for Slack, GitHub, KPI files, and local notes
- a \`computer-use\`-mapped manual UI capture adapter stub for UI-only sources
- a reusable orchestration and synthesis layer
- native editable Excel and PowerPoint outputs
- a testable pipeline boundary that can be scheduled or automated later

## Input files

- ${meta.inputFiles.join("\n- ")}

## Output files

- ${meta.outputFiles.join("\n- ")}

## Integration status

- ${data.integrations.map((integration) => `${integration.source}: ${integration.status} (${integration.featureMapping})`).join("\n- ")}

## Derived headline

${data.headline}

## Caveat

This is a connector-ready prototype that can use live Slack and GitHub inputs when credentials are available, but it still falls back to sample local inputs for missing sources. Dashboard and \`computer-use\` capture remain stubbed.
`;
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report, "utf8");
}

export async function writeNarrativePlan(narrativePath) {
  const text = `# Narrative Plan

Audience: founder or business lead reviewing a monthly operating update.

Objective: convert sample collaboration updates and KPI inputs into an executive-ready briefing pack through a connector-ready orchestration layer.

Slide list:
1. Headline and operating readout
2. KPI snapshot
3. Growth and pipeline trend
4. Highlights and risks
5. Immediate asks and next-week focus
`;
  await fs.mkdir(path.dirname(narrativePath), { recursive: true });
  await fs.writeFile(narrativePath, text, "utf8");
}
