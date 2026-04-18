# Architecture

This repo currently contains two different architecture states:

- the **current prototype**, which runs end to end on sample local inputs
- the **integrated target architecture**, which adds live connectors, `computer-use`, and recurring automation

## Current Prototype

This is what exists in the repo today.

```mermaid
flowchart LR
    classDef source fill:#E8F1FF,stroke:#2563EB,stroke-width:1.5px,color:#0F172A
    classDef engine fill:#ECFDF5,stroke:#059669,stroke-width:1.5px,color:#0F172A
    classDef synth fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#0F172A
    classDef output fill:#FDF2F8,stroke:#DB2777,stroke-width:1.5px,color:#0F172A

    A["Sample Inputs<br/>Slack notes<br/>GitHub notes<br/>Leadership notes<br/>KPI CSV"]:::source
    B["Codex Prototype Builder<br/>parse + normalize + structure"]:::engine
    C["Narrative Synthesis<br/>headline<br/>highlights<br/>risks<br/>asks"]:::synth
    D["Excel KPI Pack<br/>editable workbook"]:::output
    E["PowerPoint Briefing<br/>editable deck"]:::output
    F["Written Brief<br/>markdown summary"]:::output
    G["Run Report<br/>demo evidence"]:::output

    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    B --> G
```

## Integrated Target Architecture

This is the expanded version if the prototype is wired to live sources.

```mermaid
flowchart LR
    classDef source fill:#E8F1FF,stroke:#2563EB,stroke-width:1.5px,color:#0F172A
    classDef ingest fill:#EEF2FF,stroke:#4F46E5,stroke-width:1.5px,color:#0F172A
    classDef orchestration fill:#ECFDF5,stroke:#059669,stroke-width:1.5px,color:#0F172A
    classDef delivery fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#0F172A
    classDef output fill:#FDF2F8,stroke:#DB2777,stroke-width:1.5px,color:#0F172A

    subgraph S["Live Sources"]
        S1["Slack"]:::source
        S2["Teams"]:::source
        S3["GitHub"]:::source
        S4["Local Docs / Notes"]:::source
        S5["KPI Sheets / CSV / Warehouse"]:::source
        S6["Dashboards / CRM / Internal Tools<br/>via computer-use"]:::source
    end

    subgraph I["Ingestion Layer"]
        I1["Connector Fetchers"]:::ingest
        I2["computer-use Sessions"]:::ingest
        I3["Normalization + Extraction"]:::ingest
    end

    subgraph O["Codex Orchestration"]
        O1["Context Assembly"]:::orchestration
        O2["Narrative + Priority Synthesis"]:::orchestration
        O3["Risk / Ask Detection"]:::orchestration
        O4["Memory + Thread Context"]:::orchestration
    end

    subgraph D["Delivery Layer"]
        D1["Executive Summary"]:::delivery
        D2["Excel KPI Pack"]:::delivery
        D3["PowerPoint Briefing"]:::delivery
        D4["Slack / Teams Draft Update"]:::delivery
    end

    subgraph A["Automation + Review"]
        A1["Scheduled Runs"]:::output
        A2["Heartbeat / Monitoring"]:::output
        A3["Human Review Checkpoint"]:::output
    end

    S1 --> I1
    S2 --> I1
    S3 --> I1
    S4 --> I3
    S5 --> I3
    S6 --> I2

    I1 --> I3
    I2 --> I3
    I3 --> O1
    O4 --> O1
    A1 --> O1
    A2 --> O1

    O1 --> O2
    O1 --> O3

    O2 --> D1
    O2 --> D2
    O2 --> D3
    O3 --> D4

    D1 --> A3
    D2 --> A3
    D3 --> A3
    D4 --> A3
```

## Why both diagrams matter

- The first diagram shows what is already real in this repo.
- The second diagram shows the credible next step without pretending it already exists.
- Together they make the maturity gap explicit: prototype today, connected workflow later.

## What Is Implemented Now

The repo now contains a partial build of the integrated architecture for the `Executive Briefing Machine`:

- `src/executive-briefing/adapters.mjs`
  Maps sample inputs into connector-ready adapter contracts for Slack, GitHub, KPI files, local notes, and a `computer-use`-aligned UI capture stub. It now also contains live Slack and live GitHub API adapters with sample fallbacks.
- `src/executive-briefing/pipeline.mjs`
  Assembles context, selects live-vs-sample adapters based on available credentials, and synthesizes the executive briefing narrative.
- `src/executive-briefing/artifacts.mjs`
  Generates native editable Excel and PowerPoint artifacts.
- `scripts/run_scheduled_executive_briefing.mjs`
  Provides a schedule-friendly entrypoint that refreshes the full demo output set from the same orchestration layer.
- `tests/executive-briefing.test.mjs`
  Verifies sample ingestion, live Slack ingestion, live GitHub ingestion, synthesis, and artifact generation end to end.

## Mapping To Current Codex Features

- Slack: represented by a live `conversations.history` adapter path plus a sample fallback for demos
- GitHub: represented by a live repository API adapter path plus a sample fallback for demos
- `computer-use`: represented by the UI-capture adapter stub for dashboard-only systems
- native `Excel`: used for the KPI workbook output
- native `PowerPoint`: used for the executive briefing deck
- automations: represented by the reusable scheduled runner entrypoint and the Codex automation that can call back into this workspace

## Remaining Work For The Full Target

- add a real `computer-use` capture path for dashboard and portal extraction
- add Teams ingestion and outbound delivery adapters
- connect KPI ingestion to a warehouse export or BI source instead of only local CSV files
