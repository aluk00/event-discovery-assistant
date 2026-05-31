from __future__ import annotations

import argparse
import json

from event_discovery.config import get_env, load_dotenv
from event_discovery.connectors.eventbrite import search_eventbrite
from event_discovery.connectors.skiddle import search_skiddle
from event_discovery.connectors.ticketmaster import search_ticketmaster


def main() -> None:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)
    search = subparsers.add_parser("search")
    search.add_argument("--city", default="London")
    search.add_argument("--days", type=int, default=14)
    search.add_argument("--keyword")
    search.add_argument("--source", choices=["all", "skiddle", "eventbrite", "ticketmaster"], default="all")
    args = parser.parse_args()

    load_dotenv()
    if args.city.lower() != "london":
        raise SystemExit("This prototype is currently configured for London only.")

    events = []
    if args.source in ("all", "skiddle") and get_env("SKIDDLE_API_KEY"):
        events.extend(search_skiddle(get_env("SKIDDLE_API_KEY"), args.keyword, args.days))
    if args.source in ("all", "ticketmaster") and get_env("TICKETMASTER_API_KEY"):
        events.extend(search_ticketmaster(get_env("TICKETMASTER_API_KEY"), args.keyword, args.days))
    if args.source in ("all", "eventbrite") and get_env("EVENTBRITE_PRIVATE_TOKEN"):
        events.extend(search_eventbrite(get_env("EVENTBRITE_PRIVATE_TOKEN"), args.keyword, args.days))

    print(json.dumps([event.to_dict() for event in events], indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
