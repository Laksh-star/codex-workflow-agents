# Use Case Matrix

| Persona | Use case | Inputs | Outputs | Latest differentiators | ROI |
|---|---|---|---|---|---|
| Solo founder | Personal Chief of Staff | Slack or Teams messages, meeting notes, task follow-ups, calendar or portal context | priority queue, drafted replies, reminders, action digest | Slack and Teams triage, reply drafting, thread heartbeats, `computer-use` for tools without APIs | Very high |
| Solo founder | Executive Briefing Machine | collaboration threads, GitHub updates, KPI files, dashboards, local notes | board update deck, KPI workbook, summary memo | native `PowerPoint`, native `Excel`, automations, `computer-use` for dashboard capture | Very high |
| Team manager | Daily Leadership Digest | team chat, repo activity, project status, unresolved blockers | daily brief, escalation summary, owner tracker | Slack, Teams, GitHub synthesis, recurring automations, optional workbook tracker | Very high |
| Sales and CS | Deal Desk Assistant | account threads, renewal notes, CRM or admin portal screens, meeting notes | QBR deck, renewal-risk tracker, account brief | `computer-use` for UI-only systems, `PowerPoint`, `Excel`, recurring account monitoring | Very high |
| Product and support | Customer Voice Aggregator | feedback notes, support threads, research links, interview summaries | theme tracker, evidence table, product review deck | cross-channel synthesis, web research, native workbook and deck generation | High |

## Prioritization logic

- Build recurring workflows before one-off prompts.
- Prefer workflows with visible output artifacts over invisible background automation.
- Use `computer-use` as a bridge when an important workflow depends on a UI-only system.
- Use editable office artifacts as the proof that Codex can deliver real business outputs.

## Packaging recommendation

- Tier 1: Personal Chief of Staff, Daily Leadership Digest
- Tier 2: Executive Briefing Machine
- Tier 3: Deal Desk Assistant, Customer Voice Aggregator

## Buyer narrative

- Normal AI assistants summarize.
- Codex collects live context, operates tools, follows up later, and delivers editable business artifacts.
- The differentiator is end-to-end workflow execution, not better chat phrasing.
