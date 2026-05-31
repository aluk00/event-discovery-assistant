from __future__ import annotations

from datetime import UTC, datetime, timedelta

from event_discovery.http import get_json
from event_discovery.locations import Location
from event_discovery.model import Event


def search_ticketmaster(
    api_key: str,
    location: Location,
    keyword: str | None = None,
    days: int = 14,
    limit: int = 50,
) -> list[Event]:
    now = datetime.now(UTC)
    end = now + timedelta(days=days)
    data = get_json(
        "https://app.ticketmaster.com/discovery/v2/events.json",
        {
            "apikey": api_key,
            "city": location.name,
            "countryCode": location.country_code,
            "classificationName": "music",
            "keyword": keyword,
            "startDateTime": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "endDateTime": end.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "size": min(limit, 100),
            "sort": "date,asc",
        },
    )
    events = ((data.get("_embedded") or {}).get("events") or [])[:limit]
    return [_normalize(item, location) for item in events]


def _normalize(item: dict, location: Location) -> Event:
    dates = item.get("dates") or {}
    start = dates.get("start") or {}
    embedded = item.get("_embedded") or {}
    venues = embedded.get("venues") or []
    venue = venues[0] if venues else {}
    classifications = item.get("classifications") or []
    genres = []
    for classification in classifications:
        genre = classification.get("genre") or {}
        if genre.get("name"):
            genres.append(genre["name"])

    return Event(
        title=item.get("name") or "Untitled event",
        source="ticketmaster",
        source_event_id=str(item.get("id") or ""),
        start=start.get("dateTime") or start.get("localDate"),
        venue=venue.get("name"),
        city=(venue.get("city") or {}).get("name") or location.name,
        genres=genres,
        ticket_url=item.get("url"),
        raw_url=item.get("url"),
    )
