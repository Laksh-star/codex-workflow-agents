# Setup

This repo can run the `Executive Briefing Machine` in two modes:

- sample-input mode with no credentials
- live-input mode with Slack and GitHub credentials

## Required environment variables

Copy [.env.example](/Users/ln-mini/Downloads/for_codex_super_use_cases/.env.example) into your local shell environment or your preferred `.env` loader.

```bash
export SLACK_BOT_TOKEN=...
export SLACK_CHANNEL_IDS=C12345678,C23456789

export GITHUB_TOKEN=...
export GITHUB_OWNER=Laksh-star
export GITHUB_REPO=codex-workflow-agents
```

## Slack requirements

- `SLACK_BOT_TOKEN`
- `SLACK_CHANNEL_IDS`

Use channel IDs, not channel names.

The current implementation reads channel history through Slack `conversations.history`, so the app token needs the relevant history scopes for the channel types you use.

## GitHub requirements

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`

If the local git remote points to the target repo, `GITHUB_OWNER` and `GITHUB_REPO` can be inferred. Keeping them explicit is still cleaner for testing.

The current implementation reads:

- recent merged pull requests
- open pull requests
- open issues

So the token should have read access for repository `Pull requests` and `Issues`.

## Test commands

Run these after exporting the variables:

```bash
npm test
node scripts/build_executive_briefing_demo.mjs
node scripts/run_scheduled_executive_briefing.mjs
```

## Expected behavior

- if Slack and GitHub credentials are valid, the pipeline uses live inputs for those sources
- if one source is missing credentials, that source falls back to the sample input file
- `computer-use` remains a stub and does not need credentials yet

## What I should test after you confirm env

Once you confirm the env is set, I should verify:

1. live Slack ingestion succeeds for the specified channel IDs
2. live GitHub ingestion succeeds for the target repo
3. the scheduled runner completes without falling back unexpectedly
4. the generated report reflects live integration status instead of sample-only status
