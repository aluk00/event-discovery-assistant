from __future__ import annotations

from datetime import date, timedelta

from event_discovery.http import get_json
from event_discovery.locations import Location
from event_discovery.model import Event


def search_skiddle(
    api_key: str,
    location: Location,
    keyword: str | None = None,
    days: int = 14,
    limit: int = 50,
) -> list[Event]:
    today = date.today()
    max_date = today + timedelta(days=days)
    data = get_json(
        "https://www.skiddle.com/api/v1/events/search/",
        {
            "api_key": api_key,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "radius": 20,
            "eventcode": "CLUB",
            "keyword": keyword,
            "description": 1,
            "minDate": today.isoformat(),
            "maxDate": max_date.isoformat(),
            "order": "date",
            "limit": min(limit, 100),
        },
    )
    results = data.get("results") or []
    return [_normalize(item, location) for item in results[:limit]]


def _normalize(item: dict, location: Location) -> Event:
    venue = item.get("venue") or {}
    artists = item.get("artists") or []
    genres = item.get("genres") or []
    return Event(
        title=item.get("eventname") or item.get("name") or "Untitled event",
        source="skiddle",
        source_event_id=str(item.get("id") or item.get("eventid") or ""),
        start=item.get("date"),
        venue=venue.get("name") if isinstance(venue, dict) else None,
        city=(venue.get("town") if isinstance(venue, dict) else None) or location.name,
        artists=[a.get("name") for a in artists if isinstance(a, dict) and a.get("name")],
        genres=[g.get("name") for g in genres if isinstance(g, dict) and g.get("name")],
        ticket_url=item.get("link"),
        raw_url=item.get("link"),
    )
