from __future__ import annotations

import pytest

from event_discovery.locations import resolve_locations


def test_single_city_resolves_to_one_location():
    locations = resolve_locations("London")

    assert [location.name for location in locations] == ["London"]
    assert locations[0].country_code == "GB"


def test_lookup_is_case_and_whitespace_insensitive():
    assert resolve_locations("  DUBLIN ") == resolve_locations("dublin")


def test_region_resolves_to_every_city_in_it():
    names = [location.name for location in resolve_locations("Northern Ireland")]

    assert names == ["Belfast", "Derry"]


def test_all_covers_every_supported_city():
    assert len(resolve_locations("All")) == 8


def test_unknown_location_exits_with_a_helpful_message():
    with pytest.raises(SystemExit) as excinfo:
        resolve_locations("Atlantis")

    assert "Atlantis" in str(excinfo.value)
    assert "london" in str(excinfo.value)
