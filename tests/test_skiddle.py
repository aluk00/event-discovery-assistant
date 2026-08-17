from __future__ import annotations

from event_discovery.connectors.skiddle import _normalize
from event_discovery.locations import LOCATIONS


def test_normalize_maps_a_full_payload():
    event = _normalize(
        {
            "id": "1234",
            "eventname": "Warehouse Session",
            "date": "2026-09-01",
            "venue": {"name": "Corsica Studios", "town": "Southwark"},
            "artists": [{"name": "Artist One"}, {"name": "Artist Two"}],
            "genres": [{"name": "techno"}],
            "link": "https://www.skiddle.com/events/1234",
        },
        LOCATIONS["london"],
    )

    assert event.title == "Warehouse Session"
    assert event.source == "skiddle"
    assert event.source_event_id == "1234"
    assert event.venue == "Corsica Studios"
    assert event.city == "Southwark"
    assert event.artists == ["Artist One", "Artist Two"]
    assert event.genres == ["techno"]
    assert event.ticket_url == "https://www.skiddle.com/events/1234"


def test_normalize_falls_back_when_fields_are_missing():
    event = _normalize({}, LOCATIONS["belfast"])

    assert event.title == "Untitled event"
    assert event.source_event_id == ""
    assert event.venue is None
    assert event.city == "Belfast"
    assert event.artists == []


def test_to_dict_round_trips_every_field():
    event = _normalize({"eventname": "Club Night", "id": "9"}, LOCATIONS["dublin"])
    data = event.to_dict()

    assert data["title"] == "Club Night"
    assert data["city"] == "Dublin"
    assert data["price"] is None
