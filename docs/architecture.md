# Architecture

This repo now has three meaningful architecture states:

1. the **original sample-input prototype**
2. the **current hybrid live demo**
3. the **target fully integrated workflow**

That distinction matters because the repo is no longer just a concept package. It now has a real hybrid business workflow running on top of live Slack and GitHub.

## 1. Original sample-input prototype

This was the first working shape of the `Executive Briefing Machine`.

```mermaid
flowchart LR
    classDef source fill:#E8F1FF,stroke:#2563EB,stroke-width:1.5px,color:#0F172A
    classDef engine fill:#ECFDF5,stroke:#059669,stroke-width:1.5px,color:#0F172A
    classDef synth fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#0F172A
    classDef output fill:#FDF2F8,stroke:#DB2777,stroke-width:1.5px,color:#0F172A

    A["Sample Inputs<br/>Slack notes<br/>GitHub notes<br/>Leadership notes<br/>KPI CSV"]:::source
    B["Codex Prototype Builder<br/>parse + normalize + structure"]:::engine
    C["Narrative Synthesis<br/>headline<br/>highlights<br/>risks<br/>asks"]:::synth
    D["Excel KPI Pack"]:::output
    E["PowerPoint Briefing"]:::output
    F["Written Summary"]:::output
    G["Run Report"]:::output

    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    B --> G
```

## 2. Current hybrid live demo

This is the architecture the repo actually implements today.

```mermaid
flowchart LR
    classDef live fill:#E0F2FE,stroke:#0284C7,stroke-width:1.5px,color:#0F172A
    classDef curated fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#0F172A
    classDef stub fill:#F1F5F9,stroke:#64748B,stroke-width:1.5px,color:#0F172A
    classDef engine fill:#DCFCE7,stroke:#059669,stroke-width:1.5px,color:#0F172A
    classDef output fill:#FCE7F3,stroke:#DB2777,stroke-width:1.5px,color:#0F172A

    S1["Live Slack<br/>seeded advisory channel"]:::live
    S2["Live GitHub<br/>repo PRs + issues"]:::live
    S3["Curated KPI CSV<br/>boutique AI firm metrics"]:::curated
    S4["Curated leadership notes<br/>board and execution framing"]:::curated
    S5["computer-use path<br/>not live yet"]:::stub

    I1["Adapter layer<br/>Slack + GitHub + file adapters"]:::engine
    I2["Filtering and classification<br/>advisory-aware scoring"]:::engine
    I3["Narrative synthesis"]:::engine
    I4["Scheduled runner"]:::engine

    O1["Excel KPI pack"]:::output
    O2["PowerPoint briefing deck"]:::output
    O3["Markdown summary"]:::output
    O4["Run report"]:::output

    S1 --> I1
    S2 --> I1
    S3 --> I1
    S4 --> I1
    S5 -.-> I1

    I1 --> I2
    I2 --> I3
    I4 --> I3

    I3 --> O1
    I3 --> O2
    I3 --> O3
    I3 --> O4
```

## 3. Target fully integrated workflow

This is the expanded version if every meaningful source becomes live.

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
        S4["Leadership docs / notes"]:::source
        S5["KPI sheets / warehouse / BI"]:::source
        S6["Dashboards / CRM / internal tools<br/>via computer-use"]:::source
    end

    subgraph I["Ingestion Layer"]
        I1["Connector fetchers"]:::ingest
        I2["computer-use sessions"]:::ingest
        I3["Normalization + source scoring"]:::ingest
    end

    subgraph O["Codex Orchestration"]
        O1["Context assembly"]:::orchestration
        O2["Narrative + priority synthesis"]:::orchestration
        O3["Risk / ask / opportunity detection"]:::orchestration
        O4["Confidence + fallback reporting"]:::orchestration
    end

    subgraph D["Delivery Layer"]
        D1["Executive summary"]:::delivery
        D2["Excel KPI pack"]:::delivery
        D3["PowerPoint briefing"]:::delivery
        D4["Slack / Teams follow-up"]:::delivery
    end

    subgraph A["Automation + Review"]
        A1["Scheduled runs"]:::output
        A2["Human review checkpoint"]:::output
        A3["Audit trail / run report"]:::output
    end

    S1 --> I1
    S2 --> I1
    S3 --> I1
    S4 --> I1
    S5 --> I1
    S6 --> I2

    I1 --> I3
    I2 --> I3
    I3 --> O1

    A1 --> O1
    O1 --> O2
    O1 --> O3
    O1 --> O4

    O2 --> D1
    O2 --> D2
    O2 --> D3
    O3 --> D4
    O4 --> A2
    O4 --> A3
```

## What is real today

- live Slack ingestion
- live GitHub ingestion
- curated KPI data
- curated leadership framing
- scheduled execution path
- editable Excel and PowerPoint outputs

## What is still synthetic or incomplete

- KPI data is curated, not live from a source-of-truth system
- leadership framing is curated, not live from a thread or doc source
- Teams is not wired
- `computer-use` is only represented as a future path
- outbound delivery is not yet part of the live run

## Why the new middle diagram matters

The old “current prototype” versus “target architecture” split is no longer enough.

The repo now has a middle state that is the actual product story:

- not fully live
- not merely mocked
- a hybrid workflow with real connectors, curated business context, and real deliverables

That is the state most worth showing in a repo, article, or GitHub Pages landing page.
