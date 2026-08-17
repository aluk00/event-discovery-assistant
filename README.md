# Event Discovery Assistant

Starter event aggregation project for London, Ireland, and Northern Ireland
music, nightlife, DJ sets, club nights, gigs, and live events.

## Current sources

- Skiddle Events API
- Eventbrite API
- Ticketmaster Discovery API

## Later sources

- Resident Advisor, only if the access method is acceptable and stable
- DICE, if a usable partner token is available
- Venue/promoter calendars

## Setup

1. Copy `.env.example` to `.env`.
2. Paste regenerated API keys into `.env`.
3. Run:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
event-discovery search --city London --days 14 --keyword techno
```

Without installing the package, run directly from the source folder:

```bash
PYTHONPATH=src python3 -m event_discovery.cli search --city London --days 14 --keyword techno
```

Useful examples:

```bash
PYTHONPATH=src python3 -m event_discovery.cli search --city Ireland --days 30 --keyword techno
PYTHONPATH=src python3 -m event_discovery.cli search --city "Northern Ireland" --days 30 --keyword house
PYTHONPATH=src python3 -m event_discovery.cli search --city All --days 14 --keyword electronic
```

The command prints normalized event results as JSON.

## Development

Install the dev extras to get the test suite and the linter:

```bash
pip install -e ".[dev]"
pytest
ruff check .
```

In Claude Code on the web this is done automatically by
`.claude/hooks/session-start.sh` before each session starts.

## Security

Never commit `.env` or raw API keys to GitHub. If keys were posted in chat,
regenerate them before using this project seriously.
