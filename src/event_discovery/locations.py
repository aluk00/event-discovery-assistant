from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Location:
    name: str
    latitude: float
    longitude: float
    country_code: str


LOCATIONS: dict[str, Location] = {
    "london": Location("London", 51.5072, -0.1276, "GB"),
    "dublin": Location("Dublin", 53.3498, -6.2603, "IE"),
    "cork": Location("Cork", 51.8985, -8.4756, "IE"),
    "galway": Location("Galway", 53.2707, -9.0568, "IE"),
    "limerick": Location("Limerick", 52.6638, -8.6267, "IE"),
    "waterford": Location("Waterford", 52.2593, -7.1101, "IE"),
    "belfast": Location("Belfast", 54.5973, -5.9301, "GB"),
    "derry": Location("Derry", 54.9966, -7.3086, "GB"),
}

REGIONS: dict[str, list[str]] = {
    "london": ["london"],
    "ireland": ["dublin", "cork", "galway", "limerick", "waterford"],
    "northern ireland": ["belfast", "derry"],
    "northern-ireland": ["belfast", "derry"],
    "ni": ["belfast", "derry"],
    "all": ["london", "dublin", "cork", "galway", "limerick", "waterford", "belfast", "derry"],
}


def resolve_locations(value: str) -> list[Location]:
    key = value.strip().lower()
    if key in LOCATIONS:
        return [LOCATIONS[key]]
    if key in REGIONS:
        return [LOCATIONS[name] for name in REGIONS[key]]

    supported = ", ".join(sorted(set(LOCATIONS) | set(REGIONS)))
    raise SystemExit(f"Unknown location '{value}'. Try one of: {supported}.")
