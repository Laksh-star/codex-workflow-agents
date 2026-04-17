import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(rootDir, "outputs", "product-strategy");
const outputPath = path.join(outDir, "codex-non-coding-workflows.pptx");
const narrativePath = path.join(outDir, "narrative_plan.md");

const W = 1280;
const H = 720;
const colors = {
  ink: "#0F172A",
  slate: "#334155",
  muted: "#64748B",
  line: "#CBD5E1",
  paper: "#F8FAFC",
  white: "#FFFFFF",
  blue: "#2563EB",
  green: "#0F766E",
  amber: "#D97706",
  rose: "#BE123C",
};

const font = {
  title: "Poppins",
  body: "Lato",
};

const presentation = Presentation.create({
  slideSize: { width: W, height: H },
});

presentation.theme.colorScheme = {
  name: "Codex Strategy",
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

function addBackground(slide, accent = colors.blue) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: W, height: H },
    fill: colors.paper,
    line: { style: "solid", fill: colors.paper, width: 0 },
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: W, height: 18 },
    fill: accent,
    line: { style: "solid", fill: accent, width: 0 },
  });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: 930, top: 42, width: 280, height: 70 },
    fill: `${accent}15`,
    line: { style: "solid", fill: `${accent}40`, width: 1 },
  });
}

function addText(slide, { left, top, width, height, text, fontSize = 24, color = colors.ink, bold = false, align = "left" }) {
  const box = slide.shapes.add({
    geometry: "rect",
    position: { left, top, width, height },
    fill: "#00000000",
    line: { style: "solid", fill: "#00000000", width: 0 },
  });
  box.text = text;
  box.text.fontSize = fontSize;
  box.text.color = color;
  box.text.bold = bold;
  box.text.typeface = bold ? font.title : font.body;
  box.text.alignment = align;
  box.text.verticalAlignment = "top";
  box.text.insets = { left: 0, right: 0, top: 0, bottom: 0 };
  return box;
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
    position: { left: left + 18, top: top + 18, width: 72, height: 10 },
    fill: accent,
    line: { style: "solid", fill: accent, width: 0 },
  });
  addText(slide, { left: left + 18, top: top + 40, width: width - 36, height: 42, text: title, fontSize: 24, bold: true });
  addText(slide, { left: left + 18, top: top + 92, width: width - 36, height: height - 110, text: body, fontSize: 16, color: colors.slate });
}

function addTitleSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.blue);
  addText(slide, { left: 78, top: 90, width: 760, height: 46, text: "Codex-First Non-Coding Workflows", fontSize: 34, bold: true });
  addText(slide, {
    left: 78,
    top: 150,
    width: 720,
    height: 140,
    text: "Position Codex as an operator for recurring business workflows that collect context, operate tools, follow up later, and deliver editable business artifacts.",
    fontSize: 22,
    color: colors.slate,
  });
  addCard(slide, {
    left: 78,
    top: 330,
    width: 360,
    height: 250,
    title: "Core wedge",
    body: "Connected work context plus automation plus computer-use plus editable Excel and PowerPoint deliverables.",
    accent: colors.green,
  });
  addCard(slide, {
    left: 470,
    top: 330,
    width: 330,
    height: 250,
    title: "Why now",
    body: "This capability bundle moves Codex beyond chat summaries into repeatable business operations.",
    accent: colors.amber,
  });
  addCard(slide, {
    left: 830,
    top: 150,
    width: 360,
    height: 430,
    title: "Top 5",
    body: "1. Personal Chief of Staff\n2. Executive Briefing Machine\n3. Daily Leadership Digest\n4. Deal Desk Assistant\n5. Customer Voice Aggregator",
    accent: colors.rose,
  });
}

function addDifferentiationSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.green);
  addText(slide, { left: 78, top: 72, width: 840, height: 40, text: "Why Codex is differentiated", fontSize: 30, bold: true });
  const cards = [
    ["Connectors", "Slack, Teams, GitHub, and local files provide live operating context instead of static prompt input.", colors.blue],
    ["Automations", "Recurring runs and heartbeats keep the workflow alive after the first prompt.", colors.green],
    ["Computer-use", "UI-only systems and dashboards remain in-bounds, even when no API exists.", colors.amber],
    ["Editable artifacts", "Excel and PowerPoint outputs make the workflow useful in real business handoffs.", colors.rose],
  ];
  cards.forEach(([title, body, accent], idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    addCard(slide, {
      left: 78 + col * 560,
      top: 150 + row * 235,
      width: 520,
      height: 200,
      title,
      body,
      accent,
    });
  });
}

function addPortfolioSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.amber);
  addText(slide, { left: 78, top: 72, width: 760, height: 40, text: "Portfolio and packaging", fontSize: 30, bold: true });
  addCard(slide, {
    left: 78,
    top: 150,
    width: 340,
    height: 440,
    title: "Tier 1",
    body: "Personal Chief of Staff\n\nDaily Leadership Digest\n\nHigh frequency, low adoption friction, strong recurring value.",
    accent: colors.blue,
  });
  addCard(slide, {
    left: 470,
    top: 150,
    width: 340,
    height: 440,
    title: "Tier 2",
    body: "Executive Briefing Machine\n\nBest visible proof of the editable artifact wedge.",
    accent: colors.green,
  });
  addCard(slide, {
    left: 862,
    top: 150,
    width: 340,
    height: 440,
    title: "Tier 3",
    body: "Deal Desk Assistant\n\nCustomer Voice Aggregator\n\nVertical packs with strong business value and computer-use leverage.",
    accent: colors.rose,
  });
}

function addWorkflowSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.blue);
  addText(slide, { left: 78, top: 72, width: 820, height: 40, text: "Top workflow designs", fontSize: 30, bold: true });
  const items = [
    ["Chief of Staff", "Triage messages, track commitments, draft replies, and schedule follow-through."],
    ["Executive Briefing", "Collect operating context, pull KPI data, and output board-ready workbook plus deck."],
    ["Leadership Digest", "Summarize progress, blockers, decisions, and escalations every day."],
    ["Deal Desk", "Assemble account context across collaboration threads and UI-only systems."],
    ["Customer Voice", "Cluster feedback themes, quantify frequency, and package evidence for product review."],
  ];
  items.forEach(([title, body], idx) => {
    addCard(slide, {
      left: 78 + (idx % 2) * 560,
      top: 150 + Math.floor(idx / 2) * 160,
      width: 520,
      height: 128,
      title,
      body,
      accent: idx % 2 === 0 ? colors.green : colors.amber,
    });
  });
}

function addComputerUseSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.rose);
  addText(slide, { left: 78, top: 72, width: 740, height: 40, text: "Where computer-use matters", fontSize: 30, bold: true });
  addCard(slide, {
    left: 78,
    top: 150,
    width: 360,
    height: 420,
    title: "Bridge missing integrations",
    body: "Use computer-use when the source of truth sits in a browser-only dashboard, CRM, admin console, or internal portal.",
    accent: colors.rose,
  });
  addCard(slide, {
    left: 470,
    top: 150,
    width: 360,
    height: 420,
    title: "Best-fit workflows",
    body: "Executive Briefing Machine for dashboard capture, Deal Desk Assistant for CRM and portal access, Chief of Staff for last-mile context retrieval.",
    accent: colors.amber,
  });
  addCard(slide, {
    left: 862,
    top: 150,
    width: 340,
    height: 420,
    title: "Guardrail",
    body: "Use it as a strategic bridge, not the default path for every task. Lead with connectors when they exist and fall back to UI operation when they do not.",
    accent: colors.blue,
  });
}

function addDemoSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.green);
  addText(slide, { left: 78, top: 72, width: 840, height: 40, text: "Recommended demo sequence", fontSize: 30, bold: true });
  const steps = [
    "1. Start with a business question, not a feature list.",
    "2. Pull live context from collaboration tools and local files.",
    "3. Use computer-use for one missing dashboard or portal input.",
    "4. Show the recurring automation path.",
    "5. Finish with editable Excel and PowerPoint outputs.",
  ];
  addCard(slide, {
    left: 78,
    top: 160,
    width: 560,
    height: 360,
    title: "Flow",
    body: steps.join("\n"),
    accent: colors.green,
  });
  addCard(slide, {
    left: 680,
    top: 160,
    width: 522,
    height: 360,
    title: "Success bar",
    body: "The audience should see live context, a real integration gap solved through computer-use, a recurring rerun path, and outputs that are immediately usable without major cleanup.",
    accent: colors.blue,
  });
}

function addCloseSlide() {
  const slide = presentation.slides.add();
  addBackground(slide, colors.amber);
  addText(slide, { left: 78, top: 100, width: 760, height: 48, text: "Build the operator, not another summarizer", fontSize: 34, bold: true });
  addText(slide, {
    left: 78,
    top: 180,
    width: 860,
    height: 180,
    text: "The strongest go-to-market story is recurring business workflows that collect context, operate missing systems, follow up later, and land in editable office artifacts.",
    fontSize: 24,
    color: colors.slate,
  });
  addCard(slide, {
    left: 78,
    top: 390,
    width: 1124,
    height: 180,
    title: "Next action",
    body: "Lead with Personal Chief of Staff and Daily Leadership Digest, use Executive Briefing Machine as the flagship demo, and expand into Deal Desk and Customer Voice once the core wedge is proven.",
    accent: colors.rose,
  });
}

addTitleSlide();
addDifferentiationSlide();
addPortfolioSlide();
addWorkflowSlide();
addComputerUseSlide();
addDemoSlide();
addCloseSlide();

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  narrativePath,
  `# Narrative Plan

Audience: product, GTM, and stakeholder teams evaluating Codex's strongest non-coding business workflow wedge.

Objective: position Codex as an operator for recurring business workflows that combines connectors, automations, computer-use, and editable business artifacts.

Narrative arc:
1. Define the wedge.
2. Explain why the feature bundle is differentiated.
3. Show the top workflow portfolio and packaging.
4. Highlight where computer-use is strategically important.
5. End with the recommended demo and next action.

Slide list:
1. Title and thesis
2. Differentiation map
3. Portfolio and packaging
4. Top workflow designs
5. Computer-use role
6. Demo sequence
7. Closing recommendation
`,
  "utf8",
);

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(outputPath);

console.log(outputPath);
