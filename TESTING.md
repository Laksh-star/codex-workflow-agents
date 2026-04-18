# Testing Report

Test date: 2026-04-17

Workspace: `/Users/ln-mini/Downloads/for_codex_super_use_cases`

## Overall result

- Build pipeline: pass
- Documentation package: pass
- PowerPoint artifact: pass
- Excel artifact: pass with one renderer caveat

The package rebuilds successfully and generates valid `.xlsx` and `.pptx` Office files. The deck passed both structural and rendered preview checks. The workbook passed structural export and import checks, but the bundled workbook preview renderer did not faithfully display the title rows during image rendering even though those rows are present in the exported sheet XML.

## Commands run

```bash
./scripts/build_all.sh
file outputs/product-strategy/codex-non-coding-workflows.xlsx outputs/product-strategy/codex-non-coding-workflows.pptx
unzip -l outputs/product-strategy/codex-non-coding-workflows.xlsx
unzip -l outputs/product-strategy/codex-non-coding-workflows.pptx
```

Structural inspection commands:

```bash
node --input-type=module -e "import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool'; ..."
node --input-type=module -e "import { FileBlob, PresentationFile } from '@oai/artifact-tool'; ..."
python3 - <<'PY'
import zipfile, re
...
PY
```

Rendered preview commands:

```bash
node --input-type=module -e "import { FileBlob, PresentationFile } from '@oai/artifact-tool'; ..."
node --input-type=module -e "import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool'; ..."
```

## What was verified

### 1. Build and artifact generation

Verified that [scripts/build_all.sh](scripts/build_all.sh) completes successfully and regenerates:

- [codex-non-coding-workflows.xlsx](outputs/product-strategy/codex-non-coding-workflows.xlsx)
- [codex-non-coding-workflows.pptx](outputs/product-strategy/codex-non-coding-workflows.pptx)
- [narrative_plan.md](outputs/product-strategy/narrative_plan.md)

### 2. File type validation

Verified via `file`:

- workbook is recognized as `Microsoft Excel 2007+`
- deck is recognized as `Microsoft PowerPoint 2007+`

### 3. Archive structure

Verified the workbook archive contains the expected core parts:

- `xl/workbook.xml`
- `xl/styles.xml`
- three worksheet XML files

Verified the deck archive contains the expected core parts:

- `ppt/presentation.xml`
- slide master and theme files
- seven slide XML files
- seven notes slide XML files

### 4. Workbook structural import

Imported the workbook through the bundled artifact runtime and confirmed:

- sheet count is `3`
- sheet names are `Summary`, `Use Case Matrix`, and `Differentiators`

Inspected the `Summary` sheet and confirmed the KPI block and launch-priority table values are present.

### 5. Deck structural import

Imported the deck through the bundled artifact runtime and confirmed:

- slide count is `7`

Extracted slide text directly from the deck archive and confirmed that the narrative matches the intended flow:

1. title and thesis
2. differentiation map
3. portfolio and packaging
4. top workflow designs
5. `computer-use` role
6. demo sequence
7. closing recommendation

### 6. Visual spot-checks

Rendered and visually inspected:

- slide 1 preview
- slide 5 preview

Both looked coherent and readable. The deck appears presentation-ready at a spot-check level.

Rendered and visually inspected the workbook `Summary` sheet preview:

- the KPI and priority table content is present
- the preview path compresses the sheet heavily
- the title rows do not appear in the bundled preview even though the exported worksheet XML contains them

## Findings

### Passes

- the workspace package is complete and internally consistent
- strategy docs and workflow docs are present
- the rebuild path is repeatable
- the PowerPoint deck is structurally valid and visually coherent in sampled previews
- the workbook is structurally valid and imports correctly

### Caveat

- The workbook preview renderer in the bundled runtime is not a perfect proxy for Excel. It omitted the title rows from the rendered preview while those rows were present in `xl/worksheets/sheet1.xml`. This means the workbook should be spot-checked once in Excel or Numbers before using it externally as a polished artifact.

## Recommended next check

Open these files in Office-native apps and do one manual acceptance pass:

- [codex-non-coding-workflows.xlsx](outputs/product-strategy/codex-non-coding-workflows.xlsx)
- [codex-non-coding-workflows.pptx](outputs/product-strategy/codex-non-coding-workflows.pptx)

The highest-value manual check is the workbook summary sheet, since that is where the preview/runtime discrepancy showed up.

## Executive Briefing Pipeline Verification

Test date: 2026-04-18

### Overall result

- Connector-ready pipeline: pass
- Live Slack adapter path: pass in test with stubbed API responses
- Live GitHub adapter path: pass in test with stubbed API responses
- Scheduled runner entrypoint: pass
- Executive briefing artifacts: pass

### Commands run

```bash
npm test
node scripts/build_executive_briefing_demo.mjs
node scripts/run_scheduled_executive_briefing.mjs
```

### What was verified

1. The Node test suite passed `7` tests covering:
   - sample context collection
   - GitHub remote parsing
   - Slack channel ID parsing
   - live Slack ingestion with injected API responses
   - live GitHub ingestion with injected API responses
   - executive briefing synthesis
   - workbook, deck, summary, and report generation
2. `node scripts/build_executive_briefing_demo.mjs` completed successfully and regenerated:
   - [executive-briefing-demo.xlsx](outputs/executive-briefing-machine-demo/executive-briefing-demo.xlsx)
   - [executive-briefing-demo.pptx](outputs/executive-briefing-machine-demo/executive-briefing-demo.pptx)
   - [briefing-summary.md](outputs/executive-briefing-machine-demo/briefing-summary.md)
   - [demo-run-report.md](outputs/executive-briefing-machine-demo/demo-run-report.md)
3. `node scripts/run_scheduled_executive_briefing.mjs` completed successfully and regenerated the same artifact set plus:
   - [narrative_plan.md](outputs/executive-briefing-machine-demo/narrative_plan.md)

### Current caveat

- The live Slack and live GitHub paths are verified through deterministic injected responses in tests. They still depend on valid runtime credentials and source access at execution time.
- `computer-use` remains represented by a manual UI-capture stub rather than a live automated capture flow.
