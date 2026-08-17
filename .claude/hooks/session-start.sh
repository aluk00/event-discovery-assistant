#!/bin/bash
# SessionStart hook for Claude Code on the web.
#
# A cloud session starts from a fresh clone, so nothing is installed and no
# .env exists. This script gets the project to the point where the CLI, the
# tests and the linter can all be run straight away.
set -euo pipefail

# Only run in remote (web) sessions. Local machines keep their own setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
VENV_DIR="$PROJECT_DIR/.venv"

cd "$PROJECT_DIR"

# Reuse the venv if the container image already cached one.
if [ ! -x "$VENV_DIR/bin/python" ]; then
  python3 -m venv "$VENV_DIR"
fi

"$VENV_DIR/bin/python" -m pip install --quiet --upgrade pip
"$VENV_DIR/bin/python" -m pip install --quiet --editable ".[dev]"

# Put the venv on PATH for the rest of the session, so `pytest`, `ruff` and
# `event-discovery` resolve without activating anything by hand.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo "export VIRTUAL_ENV=\"$VENV_DIR\""
    echo "export PATH=\"$VENV_DIR/bin:\$PATH\""
  } >> "$CLAUDE_ENV_FILE"
fi

# .env is gitignored, so a fresh clone never has one. Seed it from the example
# with empty keys: connectors without a key are skipped rather than crashing.
# Real keys set as environment variables always win, because load_dotenv() uses
# os.environ.setdefault and will not overwrite them.
if [ ! -f "$PROJECT_DIR/.env" ] && [ -f "$PROJECT_DIR/.env.example" ]; then
  cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
fi

echo "Environment ready: .venv installed with dev extras (pytest, ruff)."
