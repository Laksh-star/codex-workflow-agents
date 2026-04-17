#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="/Users/ln-mini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

"$NODE_BIN" "$ROOT_DIR/scripts/build_strategy_workbook.mjs"
"$NODE_BIN" "$ROOT_DIR/scripts/build_strategy_deck.mjs"
