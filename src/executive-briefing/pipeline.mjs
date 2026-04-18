import path from "node:path";
import {
  collectFromAdapters,
  createBulletListAdapter,
  createCsvKpiAdapter,
  createGitHubApiAdapter,
  createManualUiCaptureAdapter,
  createMarkdownSectionAdapter,
  parseGitHubRemote,
  parseSlackChannelIds,
  createSlackApiAdapter,
} from "./adapters.mjs";

export function monthLabel(value) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export function periodMonthLabel(value) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function delta(current, previous) {
  return current - previous;
}

function signed(value, suffix = "") {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}${suffix}`;
}

function takeDistinct(limit, ...groups) {
  const seen = new Set();
  const items = [];

  for (const group of groups) {
    for (const item of group) {
      if (!item || seen.has(item)) continue;
      seen.add(item);
      items.push(item);
      if (items.length === limit) {
        return items;
      }
    }
  }

  return items;
}

export function createSampleExecutiveBriefingAdapters({ inputDir, uiCapturePath = null }) {
  return [
    createMarkdownSectionAdapter({
      id: "slack-sample",
      source: "slack",
      filePath: path.join(inputDir, "slack_updates.md"),
      mode: "sample",
      sectionKindMap: { Highlights: "highlight", Risks: "risk", Asks: "ask" },
    }),
    createMarkdownSectionAdapter({
      id: "github-sample",
      source: "github",
      filePath: path.join(inputDir, "github_updates.md"),
      mode: "sample",
      sectionKindMap: { Shipping: "highlight", "Open Risks": "risk", "Delivery Notes": "delivery_note" },
    }),
    createBulletListAdapter({
      id: "leadership-notes",
      source: "local-notes",
      filePath: path.join(inputDir, "leadership_notes.md"),
      mode: "sample",
    }),
    createCsvKpiAdapter({
      id: "kpi-sheet",
      source: "kpi-file",
      filePath: path.join(inputDir, "kpis.csv"),
      mode: "sample",
    }),
    createManualUiCaptureAdapter({ id: "dashboard-ui", filePath: uiCapturePath }),
  ];
}

export async function collectSampleExecutiveBriefingContext({ inputDir, uiCapturePath = null }) {
  return collectFromAdapters(createSampleExecutiveBriefingAdapters({ inputDir, uiCapturePath }));
}

export function createIntegratedExecutiveBriefingAdapters({
  inputDir,
  uiCapturePath = null,
  slack = {},
  github = {},
} = {}) {
  const slackChannels = slack.channels || parseSlackChannelIds(slack.channelIds);
  const hasLiveSlack = Boolean(slack.token && slackChannels.length);
  const remoteOwnerRepo = parseGitHubRemote(github.remoteUrl || "");
  const owner = github.owner || remoteOwnerRepo?.owner;
  const repo = github.repo || remoteOwnerRepo?.repo;
  const hasLiveGitHub = Boolean(github.token && owner && repo);

  return [
    hasLiveSlack
      ? createSlackApiAdapter({
          id: "slack-live",
          token: slack.token,
          channels: slackChannels,
          apiBaseUrl: slack.apiBaseUrl,
          fetchImpl: slack.fetchImpl,
        })
      : createMarkdownSectionAdapter({
          id: "slack-sample",
          source: "slack",
          filePath: path.join(inputDir, "slack_updates.md"),
          mode: "sample",
          sectionKindMap: { Highlights: "highlight", Risks: "risk", Asks: "ask" },
        }),
    hasLiveGitHub
      ? createGitHubApiAdapter({
          id: "github-live",
          owner,
          repo,
          token: github.token,
          apiBaseUrl: github.apiBaseUrl,
          fetchImpl: github.fetchImpl,
        })
      : createMarkdownSectionAdapter({
          id: "github-sample",
          source: "github",
          filePath: path.join(inputDir, "github_updates.md"),
          mode: "sample",
          sectionKindMap: { Shipping: "highlight", "Open Risks": "risk", "Delivery Notes": "delivery_note" },
        }),
    createBulletListAdapter({
      id: "leadership-notes",
      source: "local-notes",
      filePath: path.join(inputDir, "leadership_notes.md"),
      mode: "sample",
    }),
    createCsvKpiAdapter({
      id: "kpi-sheet",
      source: "kpi-file",
      filePath: path.join(inputDir, "kpis.csv"),
      mode: "sample",
    }),
    createManualUiCaptureAdapter({ id: "dashboard-ui", filePath: uiCapturePath }),
  ];
}

export async function collectIntegratedExecutiveBriefingContext(options = {}) {
  return collectFromAdapters(createIntegratedExecutiveBriefingAdapters(options));
}

export function synthesizeExecutiveBriefing(context, { generatedOn = "2026-04-17" } = {}) {
  const latest = context.metrics.at(-1);
  const previous = context.metrics.at(-2);
  if (!latest || !previous) {
    throw new Error("Need at least two KPI rows to synthesize the briefing.");
  }

  const itemsByKind = context.items.reduce((acc, item) => {
    acc[item.kind] ||= [];
    acc[item.kind].push(item);
    return acc;
  }, {});

  const highlightTexts = (itemsByKind.highlight || []).map((item) => item.text);
  const riskTexts = (itemsByKind.risk || []).map((item) => item.text);
  const leadershipNotes = (itemsByKind.leadership_note || []).map((item) => item.text);
  const deliveryNotes = (itemsByKind.delivery_note || []).map((item) => item.text);
  const highlights = takeDistinct(3, highlightTexts, deliveryNotes, leadershipNotes);
  const risks = riskTexts.slice(0, 3);
  const asks = [
    ...(itemsByKind.ask || []).slice(0, 2).map((item) => item.text),
    ...leadershipNotes.slice(0, 2),
  ];

  const metrics = [
    { label: "ARR", current: `$${latest.arrK}k`, delta: signed(delta(latest.arrK, previous.arrK), "k vs last month"), tone: "positive" },
    {
      label: "Qualified Pipeline",
      current: `$${latest.qualifiedPipelineK}k`,
      delta: signed(delta(latest.qualifiedPipelineK, previous.qualifiedPipelineK), "k vs last month"),
      tone: "positive",
    },
    {
      label: "Net Burn",
      current: `$${latest.netBurnK}k`,
      delta: signed(delta(latest.netBurnK, previous.netBurnK), "k vs last month"),
      tone: latest.netBurnK <= 230 ? "positive" : "neutral",
    },
    {
      label: "NRR",
      current: `${latest.nrrPct}%`,
      delta: signed(delta(latest.nrrPct, previous.nrrPct), " pts vs last month"),
      tone: "positive",
    },
    {
      label: "Sev-1 Incidents",
      current: String(latest.sev1Incidents),
      delta: signed(-delta(latest.sev1Incidents, previous.sev1Incidents), " incident improvement"),
      tone: "positive",
    },
  ];

  const headline =
    latest.arrK > previous.arrK && latest.netBurnK < previous.netBurnK && latest.sev1Incidents < previous.sev1Incidents
      ? "Growth and efficiency improved this month, with reliability still the main watch item."
      : "Operating momentum is mixed and requires tighter follow-through.";

  const narrative = [
    `ARR reached $${latest.arrK}k and qualified pipeline rose to $${latest.qualifiedPipelineK}k, keeping the Q3 growth story credible.`,
    `Net burn improved to $${latest.netBurnK}k and NRR moved to ${latest.nrrPct}%, which supports the efficiency narrative leadership wants to maintain.`,
    `The main risk remains mobile reliability and enterprise deal friction around security review turnaround.`,
  ];

  return {
    generatedOn,
    periodLabel: `${periodMonthLabel(previous.month)} to ${periodMonthLabel(latest.month)}`,
    latest,
    previous,
    metrics,
    highlights,
    risks,
    asks,
    deliveryNotes,
    headline,
    narrative,
    integrations: context.integrations,
    kpis: context.metrics.map((row) => ({ ...row, monthLabel: monthLabel(row.month) })),
    contextItemCount: context.items.length,
  };
}
