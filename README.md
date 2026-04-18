<p align="center">
  <a href="https://medium.com/@LakshmiNarayana_U/what-the-latest-codex-can-actually-do-live-slack-live-github-automations-and-editable-outputs-19aa79188577">
    <img src="https://img.shields.io/badge/Medium-Read%20the%20article-12100E?style=for-the-badge&logo=medium&logoColor=white" alt="Read the Medium article" />
  </a>
  <a href="https://laksh-star.github.io/codex-workflow-agents/">
    <img src="https://img.shields.io/badge/GitHub%20Pages-Open%20the%20landing%20page-2563EB?style=for-the-badge&logo=githubpages&logoColor=white" alt="Open the landing page" />
  </a>
  <a href="demo/executive-briefing-machine/README.md">
    <img src="https://img.shields.io/badge/Workflow-Executive%20Briefing%20Machine-0F766E?style=for-the-badge" alt="Executive Briefing Machine" />
  </a>
</p>

<h1 align="center">Codex Workflow Agents</h1>

<p align="center">
  Working demo repo for a user-facing business workflow built on top of the latest Codex capabilities.
</p>

<p align="center">
  <strong>From coding assistant to workflow operator.</strong><br />
  Live GitHub context, live-tested Slack signal, scheduled runs, and editable business outputs.
</p>

<p align="center">
  <a href="https://laksh-star.github.io/codex-workflow-agents/">
    <img src="docs/landing-page-preview.png" alt="Landing page preview" width="900" />
  </a>
</p>

## What this repo is

This repo centers on one working hybrid demo:

- `Executive Briefing Machine`

The demo storyline is based on **Directing Business Consulting Advisory**, a boutique AI consulting and advisory firm.

The workflow combines:

- GitHub context from the live repo
- a live-tested Slack path for advisory updates and operating signal
- curated KPI data for business-quality narrative coherence
- curated leadership notes for board and execution framing
- scheduled reruns
- editable Excel and PowerPoint outputs

This is intentionally presented as a **hybrid workflow demo**: real enough to run and inspect, explicit about what is live, what is curated, and what is still future architecture.

## Read first

- [Published Medium article](https://medium.com/@LakshmiNarayana_U/what-the-latest-codex-can-actually-do-live-slack-live-github-automations-and-editable-outputs-19aa79188577)
- [Landing page](https://laksh-star.github.io/codex-workflow-agents/)
- [Architecture](docs/architecture.md)
- [Executive Briefing Machine demo](demo/executive-briefing-machine/README.md)
- [Setup](SETUP.md)
- [Testing](TESTING.md)

## Demo status

| Source | Status | Purpose |
| --- | --- | --- |
| GitHub | Live | PRs, issues, and roadmap signal |
| Slack | Live-tested | Advisory updates, asks, blockers, customer signal |
| KPI data | Curated | Boutique AI advisory operating metrics |
| Leadership notes | Curated | Board and execution framing |
| Teams | Stubbed | Not wired yet |
| `computer-use` dashboards | Stubbed | Architectural path exists, live capture does not |

## What each run produces

- an editable Excel KPI pack
- an editable PowerPoint briefing deck
- a markdown executive summary
- a run report showing integration status and demo boundaries

Latest demo artifacts:

- [Executive Briefing Demo Workbook](outputs/executive-briefing-machine-demo/executive-briefing-demo.xlsx)
- [Executive Briefing Demo Deck](outputs/executive-briefing-machine-demo/executive-briefing-demo.pptx)
- [Executive Briefing Demo Summary](outputs/executive-briefing-machine-demo/briefing-summary.md)
- [Executive Briefing Demo Run Report](outputs/executive-briefing-machine-demo/demo-run-report.md)

## What is implemented

- live GitHub ingestion for merged PRs, open PRs, and roadmap issues
- a live-tested Slack path with consulting-aware filtering and classification
- reusable orchestration and synthesis logic under `src/executive-briefing/`
- scheduled runner for recurring briefing refreshes
- editable Excel and PowerPoint generation
- tests for ingestion, synthesis, and artifact generation
- public demo packaging through docs, landing page, and setup/testing notes

## What is not implemented yet

- live KPI ingestion from a source-of-truth spreadsheet, warehouse, or BI tool
- live leadership notes from a thread or document source
- live Teams ingestion
- live `computer-use` dashboard capture
- outbound Slack or Teams delivery of the finished briefing

## Run locally

```bash
npm test
npm run build:executive-demo
npm run run:scheduled-executive-demo
```

Optional live environment variables:

```bash
SLACK_BOT_TOKEN=...
SLACK_CHANNEL_IDS=C12345678,C23456789
GITHUB_TOKEN=...
GITHUB_OWNER=Laksh-star
GITHUB_REPO=codex-workflow-agents
```

## Repo structure

```text
docs/
  architecture.md
  index.html
demo/
  executive-briefing-machine/
outputs/
  executive-briefing-machine-demo/
scripts/
src/
tests/
```

## Additional context

The original broader strategy package for non-coding workflow agents is still included:

- [Use Case Matrix](docs/use-case-matrix.md)
- [Positioning](docs/positioning.md)
- [Prompt Templates](docs/prompts.md)
- [Workflow Prioritization Workbook](outputs/product-strategy/codex-non-coding-workflows.xlsx)
- [Strategy Deck](outputs/product-strategy/codex-non-coding-workflows.pptx)

## GitHub Pages

The static landing page lives at [docs/index.html](docs/index.html).

If GitHub Pages is enabled for the `docs/` folder on `main`, that page works as the public entry point for the article, launch posts, or demo walkthroughs.
