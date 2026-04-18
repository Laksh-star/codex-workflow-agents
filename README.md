# Codex Non-Coding Workflow Package

Prototype non-coding business workflow agents built on Codex.

This workspace turns the product strategy in [PLAN.md](PLAN.md) into reusable operating assets:

- strategy docs for positioning and launch
- workflow specs for the top 5 non-coding use cases
- prompt templates for demos and automations
- editable Excel and PowerPoint artifacts for packaging and storytelling

## Start Here

- Read the [Executive Briefing Machine Demo](demo/executive-briefing-machine/README.md) for the real end-to-end sample-input prototype.
- Read [docs/architecture.md](docs/architecture.md) for the current-vs-target architecture and what is now implemented from the integrated design.
- Read [TESTING.md](TESTING.md) for build and verification notes.
- Use [scripts/build_executive_briefing_demo.mjs](scripts/build_executive_briefing_demo.mjs) to regenerate the demo outputs.

## Integrated Build Progress

The repo now implements a meaningful part of the integrated target architecture for the `Executive Briefing Machine`:

- connector-ready adapters for Slack updates, GitHub updates, KPI files, and local notes
- live Slack API ingestion when `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_IDS` are present
- live GitHub API ingestion when `GITHUB_TOKEN` is present
- a `computer-use`-mapped adapter stub for UI-only sources
- a reusable orchestration and synthesis layer under `src/executive-briefing/`
- native editable `Excel` and `PowerPoint` outputs
- a scheduled runner entrypoint under `scripts/run_scheduled_executive_briefing.mjs`
- a test suite that validates ingestion, synthesis, and artifact generation across sample and live-backed adapter paths

What is still not implemented:

- live Teams connector calls from repo code
- live `computer-use` capture sessions
- outbound Slack or Teams posting from the generated briefing
- warehouse or dashboard-native KPI ingestion beyond local files

## Included assets

- [Use Case Matrix](docs/use-case-matrix.md)
- [Architecture](docs/architecture.md)
- [Positioning](docs/positioning.md)
- [Demo Script](docs/demo-script.md)
- [Prompt Templates](docs/prompts.md)
- [Testing Report](TESTING.md)
- [Chief of Staff Workflow](docs/workflows/chief-of-staff.md)
- [Executive Briefing Machine Workflow](docs/workflows/executive-briefing-machine.md)
- [Daily Leadership Digest Workflow](docs/workflows/daily-leadership-digest.md)
- [Deal Desk Assistant Workflow](docs/workflows/deal-desk-assistant.md)
- [Customer Voice Aggregator Workflow](docs/workflows/customer-voice-aggregator.md)
- [Executive Briefing Machine Demo](demo/executive-briefing-machine/README.md)

## Generated deliverables

Run the builders to regenerate the editable artifacts:

```bash
./scripts/build_all.sh
npm run build:executive-demo
npm run run:scheduled-executive-demo
npm test
```

Outputs are written to `outputs/product-strategy/`.

The executive briefing scripts optionally use these environment variables for live context:

```bash
SLACK_BOT_TOKEN=...
SLACK_CHANNEL_IDS=C12345678,C23456789
GITHUB_TOKEN=...
GITHUB_OWNER=Laksh-star
GITHUB_REPO=codex-workflow-agents
```

- [Workflow Prioritization Workbook](outputs/product-strategy/codex-non-coding-workflows.xlsx)
- [Strategy Deck](outputs/product-strategy/codex-non-coding-workflows.pptx)
- [Deck Narrative Plan](outputs/product-strategy/narrative_plan.md)
- [Executive Briefing Demo Workbook](outputs/executive-briefing-machine-demo/executive-briefing-demo.xlsx)
- [Executive Briefing Demo Deck](outputs/executive-briefing-machine-demo/executive-briefing-demo.pptx)
- [Executive Briefing Demo Summary](outputs/executive-briefing-machine-demo/briefing-summary.md)
- [Executive Briefing Demo Run Report](outputs/executive-briefing-machine-demo/demo-run-report.md)

## Workspace structure

```text
docs/
  workflows/
outputs/
  product-strategy/
scripts/
PLAN.md
README.md
```

## Recommended use

1. Read the matrix and positioning docs to align on packaging.
2. Use the workflow specs as implementation briefs or sales/demo guides.
3. Use the workbook for prioritization and launch scoring.
4. Use the deck for stakeholder reviews, demos, or GTM alignment.
