# Codex Non-Coding Workflow Package

Prototype non-coding business workflow agents built on Codex.

This workspace turns the product strategy in [PLAN.md](PLAN.md) into reusable operating assets:

- strategy docs for positioning and launch
- workflow specs for the top 5 non-coding use cases
- prompt templates for demos and automations
- editable Excel and PowerPoint artifacts for packaging and storytelling

## Start Here

- Read the [Executive Briefing Machine Demo](demo/executive-briefing-machine/README.md) for the real end-to-end sample-input prototype.
- Read [TESTING.md](TESTING.md) for build and verification notes.
- Use [scripts/build_executive_briefing_demo.mjs](scripts/build_executive_briefing_demo.mjs) to regenerate the demo outputs.

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
```

Outputs are written to `outputs/product-strategy/`.

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
