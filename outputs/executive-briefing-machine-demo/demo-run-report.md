# Demo Run Report

Demo: Executive Briefing Machine
Run date: 2026-04-17

## What this implements from the integrated architecture

- connector-ready adapters for Slack, GitHub, KPI files, and local notes
- a `computer-use`-mapped manual UI capture adapter stub for UI-only sources
- a reusable orchestration and synthesis layer
- native editable Excel and PowerPoint outputs
- a testable pipeline boundary that can be scheduled or automated later

## Input files

- /Users/ln-mini/Downloads/for_codex_super_use_cases/demo/executive-briefing-machine/inputs/slack_updates.md
- /Users/ln-mini/Downloads/for_codex_super_use_cases/demo/executive-briefing-machine/inputs/github_updates.md
- /Users/ln-mini/Downloads/for_codex_super_use_cases/demo/executive-briefing-machine/inputs/leadership_notes.md
- /Users/ln-mini/Downloads/for_codex_super_use_cases/demo/executive-briefing-machine/inputs/kpis.csv

## Output files

- /Users/ln-mini/Downloads/for_codex_super_use_cases/outputs/executive-briefing-machine-demo/executive-briefing-demo.xlsx
- /Users/ln-mini/Downloads/for_codex_super_use_cases/outputs/executive-briefing-machine-demo/executive-briefing-demo.pptx
- /Users/ln-mini/Downloads/for_codex_super_use_cases/outputs/executive-briefing-machine-demo/briefing-summary.md
- /Users/ln-mini/Downloads/for_codex_super_use_cases/outputs/executive-briefing-machine-demo/demo-run-report.md
- /Users/ln-mini/Downloads/for_codex_super_use_cases/outputs/executive-briefing-machine-demo/narrative_plan.md

## Integration status

- slack: implemented (Live Slack API adapter for 2 channel(s))
- github: implemented (Live GitHub API adapter for Laksh-star/codex-workflow-agents)
- local-notes: implemented (Local document ingestion)
- kpi-file: implemented (Spreadsheet/file ingestion)
- computer-use: stubbed (computer-use for UI-only dashboards and internal tools)

## Derived headline

Growth and efficiency improved this month, with reliability still the main watch item.

## Caveat

This is a connector-ready prototype that can use live Slack and GitHub inputs when credentials are available, but it still falls back to sample local inputs for missing sources. Dashboard and `computer-use` capture remain stubbed.
