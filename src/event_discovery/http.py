from __future__ import annotations

import json
from time import sleep
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


def get_json(
    url: str,
    params: dict[str, object | None] | None = None,
    headers: dict[str, str] | None = None,
    attempts: int = 3,
) -> dict:
    query = urlencode({k: v for k, v in (params or {}).items() if v is not None})
    full_url = f"{url}?{query}" if query else url
    request = Request(full_url, headers=headers or {})
    for attempt in range(attempts):
        try:
            with urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            if exc.code == 429 and attempt < attempts - 1:
                sleep(1.5 * (attempt + 1))
                continue
            raise RuntimeError(f"API request failed with {exc.code}: {body}") from exc

    raise RuntimeError("API request failed.")
