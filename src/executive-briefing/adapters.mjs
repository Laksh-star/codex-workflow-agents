import fs from "node:fs/promises";

function defaultFetch(url, options) {
  return fetch(url, options);
}

export function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return {
      month: row.month,
      arrK: Number(row.arr_k),
      qualifiedPipelineK: Number(row.qualified_pipeline_k),
      netBurnK: Number(row.net_burn_k),
      nrrPct: Number(row.nrr_pct),
      sev1Incidents: Number(row.sev1_incidents),
    };
  });
}

export function parseSectionedBullets(text) {
  const lines = text.split(/\r?\n/);
  const sections = {};
  let current = "Notes";
  sections[current] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      current = line.replace(/^## /, "").trim();
      sections[current] = [];
      continue;
    }
    if (line.startsWith("- ")) {
      sections[current].push(line.slice(2).trim());
    }
  }

  return sections;
}

export function createMarkdownSectionAdapter({ id, source, filePath, mode = "sample", sectionKindMap }) {
  return {
    id,
    source,
    mode,
    async collect() {
      const text = await fs.readFile(filePath, "utf8");
      const sections = parseSectionedBullets(text);
      const items = [];

      for (const [section, bullets] of Object.entries(sections)) {
        const mappedKind = sectionKindMap[section] || "note";
        for (const bullet of bullets) {
          items.push({
            adapterId: id,
            source,
            mode,
            kind: mappedKind,
            section,
            text: bullet,
          });
        }
      }

      return {
        items,
        metrics: [],
        integrations: [
          {
            adapterId: id,
            source,
            mode,
            status: "implemented",
            featureMapping: source === "slack" ? "Slack-ready connector contract" : "GitHub-ready connector contract",
          },
        ],
      };
    },
  };
}

export function createBulletListAdapter({ id, source, filePath, mode = "sample", kind = "leadership_note" }) {
  return {
    id,
    source,
    mode,
    async collect() {
      const text = await fs.readFile(filePath, "utf8");
      const items = text
        .split(/\r?\n/)
        .filter((line) => line.startsWith("- "))
        .map((line) => ({
          adapterId: id,
          source,
          mode,
          kind,
          section: "Notes",
          text: line.slice(2).trim(),
        }));

      return {
        items,
        metrics: [],
        integrations: [
          {
            adapterId: id,
            source,
            mode,
            status: "implemented",
            featureMapping: "Local document ingestion",
          },
        ],
      };
    },
  };
}

export function createCsvKpiAdapter({ id, source, filePath, mode = "sample" }) {
  return {
    id,
    source,
    mode,
    async collect() {
      const text = await fs.readFile(filePath, "utf8");
      return {
        items: [],
        metrics: parseCsv(text),
        integrations: [
          {
            adapterId: id,
            source,
            mode,
            status: "implemented",
            featureMapping: "Spreadsheet/file ingestion",
          },
        ],
      };
    },
  };
}

export function createManualUiCaptureAdapter({ id = "dashboard-ui", source = "computer-use", mode = "target", filePath = null }) {
  return {
    id,
    source,
    mode,
    async collect() {
      if (!filePath) {
        return {
          items: [],
          metrics: [],
          integrations: [
            {
              adapterId: id,
              source,
              mode,
              status: "stubbed",
              featureMapping: "computer-use for UI-only dashboards and internal tools",
            },
          ],
        };
      }

      const text = await fs.readFile(filePath, "utf8");
      return {
        items: [
          {
            adapterId: id,
            source,
            mode,
            kind: "ui_capture",
            section: "UI Capture",
            text,
          },
        ],
        metrics: [],
        integrations: [
          {
            adapterId: id,
            source,
            mode,
            status: "implemented",
            featureMapping: "computer-use for UI-only dashboards and internal tools",
          },
        ],
      };
    },
  };
}

export function parseGitHubRemote(remoteUrl) {
  const cleaned = String(remoteUrl || "").trim();
  if (!cleaned) return null;

  const httpsMatch = cleaned.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (httpsMatch) {
    return { owner: httpsMatch[1], repo: httpsMatch[2] };
  }

  return null;
}

function itemSummary(prefix, entity) {
  return `${prefix} #${entity.number}: ${entity.title}`;
}

export function parseSlackChannelIds(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSlackText(text) {
  return String(text || "")
    .replace(/<([^>|]+)\|([^>]+)>/g, "$2")
    .replace(/<([^>]+)>/g, "$1")
    .replace(/<!here>/g, "@here")
    .replace(/<!channel>/g, "@channel")
    .replace(/<!everyone>/g, "@everyone")
    .replace(/<@[^>]+>/g, "@teammate")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\*Sent using\*\s*ChatGPT/gi, "")
    .replace(/Sent using\s+ChatGPT/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

const slackRiskPattern = /\b(blocked|blocker|risk|incident|sev[- ]?1|outage|latency|security|bug|slip|delay|escalat|hotfix|crash)\b/i;
const slackAskPattern = /\b(need|please|decision|approve|approval|help|review|required|owner|can someone|by eod|unblock)\b/i;
const slackBusinessPattern =
  /\b(arr|nrr|pipeline|revenue|renewal|churn|customer|enterprise|deal|burn|budget|forecast|launch|shipping|release|rollout|activation|signup|trial|growth|retention|reliability|roadmap|support|legal|security)\b/i;
const slackNoisePattern =
  /\b(has joined the channel|joined the channel|left the channel|invite @|set the channel|renamed the channel|archived the channel|unarchived the channel|thread below|processed:\s*\d|data scanned:|window:|verticals covered:)\b/i;
const slackStructuredSectionPattern =
  /^(?:_?DEMO \/ Synthetic operating update_?\s*)?(Client delivery status|Revenue and pipeline readout|Customer signal|Risk watch|Immediate asks(?: for leadership)?):\s*/i;

function parseSlackMessageContext(text) {
  const cleaned = text
    .replace(/^_?DEMO \/ Synthetic operating update_?\s*/i, "")
    .replace(/\*Sent using\*\s*ChatGPT/gi, "")
    .replace(/Sent using\s+ChatGPT/gi, "")
    .trim();

  const sectionMatch = cleaned.match(slackStructuredSectionPattern);
  if (!sectionMatch) {
    return { text: cleaned, sectionHint: null };
  }

  return {
    text: cleaned.slice(sectionMatch[0].length).trim(),
    sectionHint: sectionMatch[1].toLowerCase(),
  };
}

function classifySlackMessage(text, sectionHint = null) {
  if (sectionHint?.startsWith("risk watch")) {
    return "risk";
  }
  if (sectionHint?.startsWith("immediate asks")) {
    return "ask";
  }
  if (
    sectionHint?.startsWith("client delivery status") ||
    sectionHint?.startsWith("revenue and pipeline readout") ||
    sectionHint?.startsWith("customer signal")
  ) {
    return "highlight";
  }
  if (slackRiskPattern.test(text)) {
    return "risk";
  }
  if (slackAskPattern.test(text)) {
    return "ask";
  }
  return "highlight";
}

function slackSectionLabel(kind) {
  if (kind === "risk") return "Slack Risks";
  if (kind === "ask") return "Slack Asks";
  return "Slack Highlights";
}

function isSlackSystemMessage(message) {
  const subtype = String(message?.subtype || "");
  return [
    "bot_message",
    "channel_join",
    "channel_leave",
    "channel_topic",
    "channel_purpose",
    "channel_name",
    "channel_archive",
    "channel_unarchive",
    "channel_posting_permissions",
    "group_join",
    "group_leave",
    "message_changed",
    "message_deleted",
  ].includes(subtype);
}

function scoreSlackMessage(message, text, sectionHint = null) {
  let score = 0;
  const isLinkOnly = /^(https?:\/\/\S+|www\.\S+)$/i.test(text);
  const alphaChars = (text.match(/[a-z]/gi) || []).length;

  if (!isSlackSystemMessage(message) && !message?.bot_id && !message?.app_id) {
    score += 3;
  } else {
    score -= 4;
  }

  if (slackRiskPattern.test(text)) score += 3;
  if (slackAskPattern.test(text)) score += 2;
  if (slackBusinessPattern.test(text)) score += 2;
  if (sectionHint) score += 4;
  if (slackNoisePattern.test(text)) score -= 6;
  if (text.length > 450) score -= 3;
  if ((text.match(/\n/g) || []).length > 4) score -= 2;
  if (isLinkOnly) score -= 6;
  if (alphaChars < 20) score -= 3;

  return score;
}

export function createSlackApiAdapter({
  id = "slack-live",
  source = "slack",
  token,
  channels = [],
  apiBaseUrl = "https://slack.com/api",
  mode = "live",
  fetchImpl = defaultFetch,
  limit = 15,
}) {
  return {
    id,
    source,
    mode,
    async collect() {
      const resolvedChannels = channels
        .map((channel) =>
          typeof channel === "string"
            ? { id: channel, label: channel }
            : { id: channel?.id, label: channel?.label || channel?.id },
        )
        .filter((channel) => channel.id);

      if (!token || resolvedChannels.length === 0) {
        return {
          items: [],
          metrics: [],
          integrations: [
            {
              adapterId: id,
              source,
              mode,
              status: "stubbed",
              featureMapping: "Live Slack API adapter requires SLACK_BOT_TOKEN and SLACK_CHANNEL_IDS",
            },
          ],
        };
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      };

      const channelPayloads = await Promise.all(
        resolvedChannels.map(async (channel) => {
          const response = await fetchImpl(`${apiBaseUrl}/conversations.history`, {
            method: "POST",
            headers,
            body: JSON.stringify({ channel: channel.id, limit: Math.min(limit, 15) }),
          });

          if (!response.ok) {
            throw new Error(`Slack API request failed for ${channel.label}: ${response.status} ${response.statusText}`);
          }

          const payload = await response.json();
          if (!payload.ok) {
            throw new Error(`Slack API request failed for ${channel.label}: ${payload.error || "unknown_error"}`);
          }

          return { channel, messages: payload.messages || [] };
        }),
      );

      const items = channelPayloads
        .flatMap(({ channel, messages }) =>
          messages
            .map((message) => {
              const normalizedText = normalizeSlackText(message.text);
              const { text, sectionHint } = parseSlackMessageContext(normalizedText);
              const score = scoreSlackMessage(message, text, sectionHint);
              if (!text || score < 2) {
                return null;
              }

              const kind = classifySlackMessage(text, sectionHint);
              return {
                adapterId: id,
                source,
                mode,
                kind,
                section: slackSectionLabel(kind),
                text: `${channel.label}: ${text}`,
                ts: Number(message.ts || 0),
                score,
              };
            })
            .filter(Boolean),
        )
        .sort((left, right) => right.score - left.score || right.ts - left.ts)
        .slice(0, 6)
        .map(({ ts, score, ...item }) => item);

      return {
        items,
        metrics: [],
        integrations: [
          {
            adapterId: id,
            source,
            mode,
            status: "implemented",
            featureMapping: `Live Slack API adapter for ${resolvedChannels.length} channel(s)`,
          },
        ],
      };
    },
  };
}

export function createGitHubApiAdapter({
  id = "github-live",
  source = "github",
  owner,
  repo,
  token,
  apiBaseUrl = "https://api.github.com",
  mode = "live",
  fetchImpl = defaultFetch,
}) {
  return {
    id,
    source,
    mode,
    async collect() {
      if (!owner || !repo) {
        throw new Error("GitHub adapter requires owner and repo.");
      }
      if (!token) {
        return {
          items: [],
          metrics: [],
          integrations: [
            {
              adapterId: id,
              source,
              mode,
              status: "stubbed",
              featureMapping: "Live GitHub API adapter requires GITHUB_TOKEN",
            },
          ],
        };
      }

      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "codex-workflow-agents",
      };
      const endpoints = {
        mergedPulls: `${apiBaseUrl}/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=10`,
        openPulls: `${apiBaseUrl}/repos/${owner}/${repo}/pulls?state=open&sort=updated&direction=desc&per_page=10`,
        openIssues: `${apiBaseUrl}/repos/${owner}/${repo}/issues?state=open&sort=updated&direction=desc&per_page=10`,
      };

      const [mergedPullsResponse, openPullsResponse, openIssuesResponse] = await Promise.all([
        fetchImpl(endpoints.mergedPulls, { headers }),
        fetchImpl(endpoints.openPulls, { headers }),
        fetchImpl(endpoints.openIssues, { headers }),
      ]);

      const responses = [mergedPullsResponse, openPullsResponse, openIssuesResponse];
      for (const response of responses) {
        if (!response.ok) {
          throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
        }
      }

      const [mergedPullsRaw, openPulls, openIssuesRaw] = await Promise.all(responses.map((response) => response.json()));
      const mergedPulls = mergedPullsRaw.filter((pull) => pull.merged_at).slice(0, 3);
      const openIssues = openIssuesRaw.filter((issue) => !issue.pull_request).slice(0, 3);

      const items = [
        ...mergedPulls.map((pull) => ({
          adapterId: id,
          source,
          mode,
          kind: "highlight",
          section: "GitHub Merged Pulls",
          text: itemSummary("Merged PR", pull),
        })),
        ...openIssues.map((issue) => ({
          adapterId: id,
          source,
          mode,
          kind: "risk",
          section: "GitHub Open Issues",
          text: itemSummary("Open issue", issue),
        })),
        ...openPulls.slice(0, 3).map((pull) => ({
          adapterId: id,
          source,
          mode,
          kind: "delivery_note",
          section: "GitHub Open Pulls",
          text: itemSummary("Open PR", pull),
        })),
      ];

      return {
        items,
        metrics: [],
        integrations: [
          {
            adapterId: id,
            source,
            mode,
            status: "implemented",
            featureMapping: `Live GitHub API adapter for ${owner}/${repo}`,
          },
        ],
      };
    },
  };
}

export async function collectFromAdapters(adapters) {
  const results = await Promise.all(adapters.map((adapter) => adapter.collect()));
  return {
    items: results.flatMap((result) => result.items),
    metrics: results.flatMap((result) => result.metrics),
    integrations: results.flatMap((result) => result.integrations),
  };
}
