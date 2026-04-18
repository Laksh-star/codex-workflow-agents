# Codex Workflow Agents

User-facing workflow demos built on top of the latest Codex capabilities.

This repo currently centers on one working demo:

- `Executive Briefing Machine`

It takes a mix of live and curated business inputs, synthesizes an operating narrative, and outputs:

- an editable Excel KPI pack
- an editable PowerPoint briefing deck
- a written executive summary
- a run report showing what was live, curated, or stubbed

## What this repo is now

This is no longer just a strategy package for non-coding workflows. It now contains a working hybrid business workflow demo for a boutique AI advisory firm:

- live Slack ingestion
- live GitHub ingestion
- curated KPI data
- curated leadership framing
- scheduled rerun support
- editable business artifacts

The current demo theme is:

- `Directing Business Consulting Advisory`
- a boutique AI consulting and advisory firm

## Live vs curated vs stubbed

For the current `Executive Briefing Machine` demo:

| Source | Status | Notes |
| --- | --- | --- |
| Slack | Live | Reads a seeded advisory demo channel with realistic operating updates |
| GitHub | Live | Reads merged PRs, open PRs, and open issues from this repo |
| KPI data | Curated | Boutique AI advisory metrics in local CSV form |
| Leadership notes | Curated | Local leadership framing for the advisory storyline |
| Teams | Stubbed | Not wired yet |
| `computer-use` dashboard capture | Stubbed | Architecture path exists, live extraction does not |

That makes this an honest **hybrid demo**, not a fully live production workflow.

## Why it matters

The interesting part is not “Codex can summarize text.” The interesting part is that Codex can:

- collect context from real systems
- synthesize that context into a decision-oriented narrative
- rerun on a schedule
- output editable Excel and PowerPoint deliverables

That is the product shape this repo is exploring.

## Start here

- [Live demo overview](docs/index.html)
- [Architecture](docs/architecture.md)
- [Executive Briefing Machine demo](demo/executive-briefing-machine/README.md)
- [Setup](SETUP.md)
- [Testing](TESTING.md)

## Current artifacts

- [Executive Briefing Demo Workbook](outputs/executive-briefing-machine-demo/executive-briefing-demo.xlsx)
- [Executive Briefing Demo Deck](outputs/executive-briefing-machine-demo/executive-briefing-demo.pptx)
- [Executive Briefing Demo Summary](outputs/executive-briefing-machine-demo/briefing-summary.md)
- [Executive Briefing Demo Run Report](outputs/executive-briefing-machine-demo/demo-run-report.md)

The earlier product-strategy package is still included:

- [Workflow Prioritization Workbook](outputs/product-strategy/codex-non-coding-workflows.xlsx)
- [Strategy Deck](outputs/product-strategy/codex-non-coding-workflows.pptx)
- [Use Case Matrix](docs/use-case-matrix.md)
- [Positioning](docs/positioning.md)
- [Prompt Templates](docs/prompts.md)

## How to run it

```bash
npm test
npm run build:executive-demo
npm run run:scheduled-executive-demo
```

Live context is optional. The executive briefing scripts can use:

```bash
SLACK_BOT_TOKEN=...
SLACK_CHANNEL_IDS=C12345678,C23456789
GITHUB_TOKEN=...
GITHUB_OWNER=Laksh-star
GITHUB_REPO=codex-workflow-agents
```

## What is implemented

- live Slack adapter with advisory-aware filtering
- live GitHub adapter for repo activity and roadmap issues
- reusable orchestration and synthesis pipeline under `src/executive-briefing/`
- native Excel and PowerPoint artifact generation
- scheduled runner entrypoint
- tests covering ingestion, synthesis, and artifact creation

## What is not implemented yet

- live KPI ingestion from a warehouse, BI tool, or source-of-truth spreadsheet
- live leadership notes from a dedicated thread or document source
- live Teams ingestion
- live `computer-use` capture for dashboards and internal portals
- outbound Slack/Teams delivery of finished briefing updates

## Suggested GitHub Pages setup

This repo now includes a static landing page at:

- [docs/index.html](docs/index.html)

If you enable GitHub Pages from the `docs/` folder on `main`, this can act as the public demo page linked from a Medium article or launch post.
