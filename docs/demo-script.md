# Demo Script

## Goal

Show that Codex is more than a summarizer by proving four behaviors in one flow:

1. collects context from live systems
2. operates a tool without an API using `computer-use`
3. sets up or demonstrates recurring follow-through
4. delivers editable Excel and PowerPoint outputs

## Recommended demo

Use the Executive Briefing Machine as the anchor workflow and weave in the Chief of Staff motion.

## Flow

### 1. Start from a business question

Prompt example:

```text
Build this week's executive briefing using Slack updates, the latest product notes, and our KPI tracker. Pull anything missing from the dashboard UI and prepare the board-ready workbook and deck.
```

### 2. Show context collection

- pull updates from Slack or Teams
- include GitHub if product or delivery progress matters
- read any local notes or source files

What to say:

Codex is starting with live operating context, not a blank template.

### 3. Show `computer-use`

- open a dashboard or internal portal that lacks a clean connector
- capture the needed KPI, status, or screenshot context
- return to the workflow without manual handoff

What to say:

This is where Codex stops being connector-bound. It can bridge systems that only expose a UI.

### 4. Show automation

- create or describe a weekly rerun
- call out that the same workflow can refresh without rebuilding from scratch

What to say:

The value is recurring. Codex can re-run this operating motion instead of making you restate the task each week.

### 5. Show deliverables

- open the workbook
- open the deck
- point out that both remain editable

What to say:

The output is not a dead summary. It lands in the tools teams already use.

## Variants

- For executives: demo Chief of Staff plus Executive Briefing Machine.
- For managers: demo Daily Leadership Digest plus owner tracker workbook.
- For revenue teams: demo Deal Desk Assistant with a CRM or admin portal surfaced through `computer-use`.

## Demo success bar

- the user sees at least one live source
- `computer-use` resolves a real gap
- an automation path is clear
- the final artifacts are immediately usable
