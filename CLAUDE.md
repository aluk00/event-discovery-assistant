# Event Discovery Assistant

Event aggregation prototype for London, Ireland and Northern Ireland music and
nightlife listings. Python 3.11+, standard library only at runtime.

## Environment

In Claude Code on the web, `.claude/hooks/session-start.sh` runs before the
session starts. It creates `.venv`, installs the package with its dev extras,
and puts `.venv/bin` on `PATH` — so `pytest`, `ruff` and `event-discovery` are
ready to use with no activation step.

## Commands

```bash
pytest                  # test suite
ruff check .            # linter
event-discovery search --city London --days 14 --keyword techno
```

`.github/workflows/ci.yml` runs the same `ruff check .` and `pytest` on every
push to `main` and on every pull request, so both should pass before pushing.

Without the package installed, the CLI also runs from source:

```bash
PYTHONPATH=src python3 -m event_discovery.cli search --city London --days 14
```

## Layout

- `src/event_discovery/cli.py` — argument parsing, fans out across connectors
- `src/event_discovery/locations.py` — city and region lookup (`resolve_locations`)
- `src/event_discovery/model.py` — the normalized `Event` dataclass
- `src/event_discovery/http.py` — `get_json` helper with 429 retry handling
- `src/event_discovery/connectors/` — one module per source, each returning `Event`s
- `tests/` — pytest suite

## Conventions

- Runtime code stays on the standard library; `pytest` and `ruff` are dev-only.
- Every connector normalizes its payload into `Event` rather than leaking
  source-specific shapes upward.
- Connectors are skipped when their API key is absent, so the CLI works with any
  subset of keys configured.
- Line length is 120 (`ruff check .` is the gate; formatting is not enforced).

## Secrets

API keys live in `.env`, which is gitignored and must never be committed.
`load_dotenv()` uses `os.environ.setdefault`, so real environment variables take
precedence over the file. The session hook seeds `.env` from `.env.example` with
empty values when it is missing.
