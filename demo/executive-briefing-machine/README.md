# Executive Briefing Machine Demo

This is a real sample-input to sample-output prototype of the `Executive Briefing Machine` workflow.

## Inputs

- [slack_updates.md](inputs/slack_updates.md)
- [github_updates.md](inputs/github_updates.md)
- [leadership_notes.md](inputs/leadership_notes.md)
- [kpis.csv](inputs/kpis.csv)

## Outputs

Running the demo builder produces:

- an editable Excel KPI pack
- an editable PowerPoint executive briefing deck
- a written markdown briefing summary
- a run report with verification notes

## Build

```bash
node scripts/build_executive_briefing_demo.mjs
```

Artifacts are written to `outputs/executive-briefing-machine-demo/`.
