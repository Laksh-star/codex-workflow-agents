import fs from "node:fs/promises";

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

export async function collectFromAdapters(adapters) {
  const results = await Promise.all(adapters.map((adapter) => adapter.collect()));
  return {
    items: results.flatMap((result) => result.items),
    metrics: results.flatMap((result) => result.metrics),
    integrations: results.flatMap((result) => result.integrations),
  };
}
