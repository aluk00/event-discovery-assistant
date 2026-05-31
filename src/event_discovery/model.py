from __future__ import annotations

from dataclasses import asdict, dataclass, field


@dataclass
class Event:
    title: str
    source: str
    source_event_id: str
    start: str | None = None
    end: str | None = None
    venue: str | None = None
    city: str | None = None
    artists: list[str] = field(default_factory=list)
    genres: list[str] = field(default_factory=list)
    price: str | None = None
    currency: str | None = None
    ticket_url: str | None = None
    raw_url: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)
