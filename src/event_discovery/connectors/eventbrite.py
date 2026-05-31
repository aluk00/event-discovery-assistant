from __future__ import annotations

from event_discovery.http import get_json
from event_discovery.model import Event


def search_eventbrite(
    private_token: str,
    keyword: str | None = None,
    days: int = 14,
    limit: int = 50,
) -> list[Event]:
    orgs = get_json(
        "https://www.eventbriteapi.com/v3/users/me/organizations/",
        headers={"Authorization": f"Bearer {private_token}"},
    ).get("organizations") or []
    if not orgs:
        return []

    organization_id = orgs[0].get("id")
    if not organization_id:
        return []

    # Eventbrite public discovery access is limited. This endpoint returns
    # events owned by the authenticated account's organization.
    data = get_json(
        f"https://www.eventbriteapi.com/v3/organizations/{organization_id}/events/",
        {"page_size": min(limit, 50), "order_by": "start_asc"},
        {"Authorization": f"Bearer {private_token}"},
    )
    events = data.get("events") or []
    if keyword:
        keyword_lower = keyword.lower()
        events = [
            event
            for event in events
            if keyword_lower in ((event.get("name") or {}).get("text") or "").lower()
        ]
    return [_normalize(item) for item in events]


def _normalize(item: dict) -> Event:
    name = item.get("name") or {}
    start = item.get("start") or {}
    end = item.get("end") or {}
    return Event(
        title=name.get("text") or "Untitled event",
        source="eventbrite",
        source_event_id=str(item.get("id") or ""),
        start=start.get("utc") or start.get("local"),
        end=end.get("utc") or end.get("local"),
        ticket_url=item.get("url"),
        raw_url=item.get("url"),
    )
