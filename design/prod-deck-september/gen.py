#!/usr/bin/env python3
"""Generate the deliverables, spend and per-asset artboards for the BOOST deck.

Covers 19 Aug - 20 Sep 2026:
  Deliverables  - every asset line by line, who is on what
  Total spend   - everything pooled, against the day-rate budget
  Per asset     - one slide each, so a single asset's cost is readable
  Template      - the same shape with the standing rules, for the next asset

Crew rules: Adam edits every asset. Diane is only on shoots that need two people,
and bills per shoot day, so a day carrying two assets splits between them.

Type, colour and geometry are measured from 2.0 prod deck.pdf at 2x (1pt -> 2px).
"""

W, H = 1440, 810
MARGIN = 64
CONTENT = W - 2 * MARGIN  # 1312

PAPER = "#F7F6F1"
INK = "#111111"
MUTED = "#6B6B66"
HAIRLINE = "#9B9B96"
ACCENT = "#E8402A"

BUILD, SHOOT, EDIT, FEEDBACK, LIVE = "#A8C7FA", "#A7E8C4", "#FFCBA1", "#9FE0DA", "#FFAEA5"
YELLOW = "#FFE08A"

DISPLAY = "'Archivo Black', 'Arial Black', 'Helvetica Neue', sans-serif"
DW = "font-weight: 900; "
BODY = "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"

ROOT_STYLE = (f"position: relative; width: {W}px; height: {H}px; background: {PAPER}; "
              f"padding: 48px {MARGIN}px 0; box-sizing: border-box; font-family: {BODY};")

RULE = f"2px solid {INK}"
PILL = f"2px solid {INK}"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def primary(text, colour=INK, size=15.2):
    return (f'<div style="font-family: {DISPLAY}; {DW}font-size: {size}px; line-height: 1.15; '
            f'color: {colour};">{esc(text)}</div>')


def secondary(text, colour=INK):
    return f'<div style="font-size: 14px; line-height: 1.25; color: {colour};">{esc(text)}</div>'


def badge(text, fill):
    return (f'<div style="display: inline-flex; align-items: center; justify-content: center; '
            f'padding: 6px 14px; background: {fill}; border: {PILL}; border-radius: 999px; '
            f'font-family: {DISPLAY}; {DW}font-size: 11.5px; letter-spacing: 0.04em; '
            f'color: {INK}; box-sizing: border-box;">{esc(text)}</div>')


def cell(inner, height, align="flex-start"):
    return (f'<div style="border-right: {RULE}; border-bottom: {RULE}; box-sizing: border-box; '
            f'height: {height}px; padding: 0 14px; display: flex; flex-direction: column; '
            f'justify-content: center; align-items: {align}; gap: 5px;">{inner}</div>')


def head_cell(label):
    return (f'<div style="background: {INK}; border-right: {RULE}; border-bottom: {RULE}; '
            f'box-sizing: border-box; height: 41px; display: flex; align-items: center; '
            f'justify-content: center; font-family: {DISPLAY}; {DW}font-size: 12.8px; '
            f'letter-spacing: 0.04em; color: #FFFFFF; text-align: center;">{esc(label)}</div>')


def title(text, size=58):
    return (f'  <div style="display: flex; align-items: flex-start; gap: 16px;">\n'
            f'    <div style="font-family: {DISPLAY}; {DW}font-size: {size}px; '
            f'line-height: {size}px; letter-spacing: -0.015em; color: {INK};">{esc(text)}</div>\n'
            f'    <div style="width: 26px; height: 26px; border-radius: 50%; background: {ACCENT}; '
            f'flex: none; margin-top: 6px;"></div>\n  </div>\n\n'
            f'  <div style="height: 3px; background: {INK}; margin-top: 22px;"></div>\n')


def table(columns, rows, gap=22):
    tracks = " ".join(f"{w}fr" for _, w in columns)
    cells = "".join(head_cell(label) for label, _ in columns)
    for row in rows:
        cells += "\n    " + "".join(row)
    return (f'\n  <div style="display: grid; grid-template-columns: {tracks}; width: {CONTENT}px; '
            f'box-sizing: border-box; border-top: {RULE}; border-left: {RULE}; '
            f'margin-top: {gap}px;">\n    {cells}\n  </div>\n')


def band(blocks, gap=-2):
    return (f'\n  <div style="display: flex; align-items: center; justify-content: space-between; '
            f'width: {CONTENT}px; box-sizing: border-box; background: {INK}; padding: 0 18px; '
            f'height: 54px; margin-top: {gap}px;">{blocks}</div>\n')


def total_block(label, value, value_colour, sub):
    return (f'<div style="display: flex; flex-direction: column; justify-content: center;">'
            f'<div style="display: flex; align-items: baseline; gap: 14px;">'
            f'<div style="font-family: {DISPLAY}; {DW}font-size: 12px; letter-spacing: 0.06em; '
            f'color: {HAIRLINE};">{esc(label)}</div>'
            f'<div style="font-family: {DISPLAY}; {DW}font-size: 22px; '
            f'color: {value_colour};">{esc(value)}</div></div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 11px; '
            f'letter-spacing: 0.04em; color: {HAIRLINE}; margin-top: 3px;">{esc(sub)}</div></div>')


def footer(stamp):
    return (f'\n  <div style="position: absolute; left: {MARGIN}px; right: {MARGIN}px; bottom: 24px; '
            f'display: flex; justify-content: space-between; align-items: baseline;">\n'
            f'    <div style="font-family: {DISPLAY}; {DW}font-size: 20px; color: {INK};">re:act</div>\n'
            f'    <div style="font-family: {BODY}; font-weight: 700; font-size: 14px; '
            f'letter-spacing: 0.06em; color: {MUTED};">{esc(stamp)}</div>\n  </div>\n')


STAMP = "BOOST IRELAND  ·  19 AUG – 20 SEP"


def document(body):
    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&display=swap">
  <style>
    body {{ margin: 0; background: {PAPER}; }}
    a {{ color: {ACCENT}; }} a:hover {{ color: #B92E1B; }}
  </style>
</helmet>
<div style="{ROOT_STYLE}">
{body}
</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":{W},"height":{H}}}}}'>
class Component extends DCLogic {{
  renderVals() {{
    return {{}};
  }}
}}
</script>
</body>
</html>
'''


# ----------------------------------------------------------------- the work
# One list drives every slide and the crew sheet.
#   two_person - the shoot needs Diane as well as the shooter
#   trip       - the asset relies on the 10-13 Sep Dublin trip
#   fuel       - the asset is the reason for the Cork drive
#   units      - billable assets on the line (Reactive holds two slots a month)

ASSETS = [
    dict(name="EP Bag Check", fmt="Stories + carousel", build="18 Aug",
         shoot="No shoot", location="", edit="18 Aug", v1="19 Aug",
         review="20–23 Aug", live="28 Aug", two_person=False, trip=False, fuel=False,
         units=0, status="IN REVIEW"),
    dict(name="Red Card Holiday Rules", fmt="9:16 Reel · vox pop", build="TBC",
         shoot="22 Aug", location="Airport / holiday travellers", edit="23–24 Aug", v1="24 Aug",
         review="24–28 Aug", live="TBC", two_person=True, trip=False, fuel=False,
         units=1, status="SHOOTING"),
    dict(name="Explain Hurling in 10 Seconds", fmt="9:16 Reel · vox pop", build="31 Aug",
         shoot="11 Sep", location="Parnell Park, Dublin · 18:45", edit="13–15 Sep", v1="16 Sep",
         review="17–20 Sep", live="TBC", two_person=True, trip=True, fuel=False,
         units=1, status="PRE-PRO"),
    dict(name="Matchday Rituals", fmt="9:16 Reel · vox pop", build="31 Aug",
         shoot="11 Sep", location="Parnell Park, Dublin · 18:45", edit="13–15 Sep", v1="16 Sep",
         review="17–20 Sep", live="TBC", two_person=True, trip=True, fuel=False,
         units=1, status="PRE-PRO"),
    dict(name="First Week Promises", fmt="9:16 Reel · vox pop", build="1 Sep",
         shoot="12 Sep", location="UCC Freshers’ Festival, Cork", edit="13–15 Sep", v1="16 Sep",
         review="17–20 Sep", live="TBC", two_person=True, trip=True, fuel=True,
         units=1, status="PRE-PRO"),
    dict(name="Reactive × 4", fmt="TikTok / Reel", build="Week of posting",
         shoot="No shoot", location="", edit="Week of posting", v1="Week of posting",
         review="—", live="Two slots a month", two_person=False, trip=False, fuel=False,
         units=4, status="SLOTS HELD"),
]

# Days of work in the window, off the August and September calendars. Only build,
# shoot and edit days count against the rate — feedback and live days do not.
WORK_DAYS = ["22 Aug shoot", "23 Aug edit", "24 Aug edit", "31 Aug build",
             "1 Sep build", "7 Sep edit", "11 Sep shoot", "12 Sep shoot",
             "13 Sep edit", "14 Sep edit", "15 Sep edit"]
DAY_RATE = 400.00
BUDGET = len(WORK_DAYS) * DAY_RATE

ADAM_PER_ASSET_P = 15000     # pennies, per delivered asset
DIANE_PER_DAY_P = 15000      # pennies, per two-person shoot day
FLIGHTS_P, STAY_P = 16466, 13400

# Dublin-Cork is 260 km each way on the M7/M8, driven there and back on the 12th.
# Irish pump prices averaged EUR 1.84/L in August 2026 with ~9c of excise restored
# from 1 September, so the shoot lands near EUR 1.93/L.
KM, L_PER_100KM, EUR_PER_L, EUR_TO_GBP = 520, 6.5, 1.93, 0.855
FUEL_P = round(KM / 100 * L_PER_100KM * EUR_PER_L * EUR_TO_GBP * 100)

PADDING_RATE = 0.10


def money(pennies):
    return f"£{pennies / 100:,.2f}"


def split(total_p, n):
    """Split pennies evenly, handing the remainder to the earliest shares.

    Allocating in pennies rather than pounds keeps the per-asset slides summing
    to the total slide exactly, instead of drifting a penny on each division.
    """
    base, rem = divmod(total_p, n)
    return [base + (1 if i < rem else 0) for i in range(n)]


TRIP_ASSETS = [a for a in ASSETS if a["trip"]]
TRIP_SHARE = dict(zip((a["name"] for a in TRIP_ASSETS),
                      split(FLIGHTS_P + STAY_P, len(TRIP_ASSETS))))

# Diane bills the day, not the asset, so a day carrying two assets splits.
SHOOT_DAYS = {}
for a in ASSETS:
    if a["two_person"]:
        SHOOT_DAYS.setdefault(a["shoot"], []).append(a)
DIANE_SHARE, DIANE_DAYMATES = {}, {}
for day, on_day in SHOOT_DAYS.items():
    for a, share in zip(on_day, split(DIANE_PER_DAY_P, len(on_day))):
        DIANE_SHARE[a["name"]] = share
        DIANE_DAYMATES[a["name"]] = [o["name"] for o in on_day if o is not a]


def asset_lines(a):
    """Cost lines for one asset: (line, basis, pennies or None for TBC)."""
    n = a["units"]
    lines = []
    if n:
        unit = ("per delivered asset" if n == 1
                else f"{n} × {money(ADAM_PER_ASSET_P)}, per delivered asset")
        lines.append(("ADAM · EDIT", f"Edits every asset · {unit}", n * ADAM_PER_ASSET_P))

    if a["two_person"]:
        mates = DIANE_DAYMATES[a["name"]]
        basis = f"Two-person shoot, {a['shoot']}"
        if mates:
            basis += " · day shared with " + ", ".join(mates)
        lines.append(("DIANE · SHOOT", basis, DIANE_SHARE[a["name"]]))

    if a["trip"]:
        lines.append(("TRAVEL", f"Flights + Dublin stay, 10–13 Sep · split {len(TRIP_ASSETS)} ways",
                      TRIP_SHARE[a["name"]]))
    if a["fuel"]:
        lines.append(("FUEL", f"Dublin ⇄ Cork · {KM} km at €{EUR_PER_L}/L", FUEL_P))
    if a["trip"]:
        lines.append(("CAR HIRE + TOLLS", "Shared across the trip", None))

    if not lines:
        return [("NO SPEND", "Built in-house · no edit fee, no shoot, no travel", 0)]

    costed = sum(p for _, _, p in lines if p is not None)
    lines.append(("PADDING", f"{PADDING_RATE:.0%} contingency on the costed lines",
                  round(costed * PADDING_RATE)))
    return lines


def asset_total(a):
    return sum(p for _, _, p in asset_lines(a) if p is not None)


ADAM_P = sum(a["units"] * ADAM_PER_ASSET_P for a in ASSETS)
DIANE_P = len(SHOOT_DAYS) * DIANE_PER_DAY_P
PADDING_P = sum(p for a in ASSETS for line, _, p in asset_lines(a)
                if line == "PADDING" and p is not None)
PROJECTED_P = sum(asset_total(a) for a in ASSETS)
COSTED_P = PROJECTED_P - PADDING_P
BUDGET_P = round(BUDGET * 100)
HEADROOM_P = BUDGET_P - PROJECTED_P


# --------------------------------------------------------------------- slides

SLUGS = {
    "EP Bag Check": "EPBagCheck",
    "Red Card Holiday Rules": "RedCard",
    "Explain Hurling in 10 Seconds": "ExplainHurling",
    "Matchday Rituals": "MatchdayRituals",
    "First Week Promises": "FirstWeekPromises",
    "Reactive × 4": "Reactive",
}

DELIV_COLUMNS = [("ASSET", 322), ("FORMAT", 190), ("SHOOT", 300),
                 ("EDIT", 170), ("V1 DUE", 140), ("CREW", 190)]
STATUS_FILL = {"IN REVIEW": FEEDBACK, "SHOOTING": SHOOT, "PRE-PRO": BUILD, "SLOTS HELD": YELLOW}

TOTAL_COLUMNS = [("LINE", 300), ("BASIS", 520), ("UNITS", 232), ("COST", 260)]
FACT_COLUMNS = [("FORMAT", 380), ("SHOOT", 400), ("EDIT", 280), ("V1 DUE", 252)]
LINE_COLUMNS = [("LINE", 340), ("BASIS", 712), ("COST", 260)]


def still_to_price(n):
    return f"{n} line{'s' if n != 1 else ''} still to price"


def cost_cell(text, priced, height=48):
    return cell(primary(text, INK if priced else HAIRLINE, 17), height, align="flex-end")


def crew_label(a):
    who = (["Diane"] if a["two_person"] else []) + (["Adam"] if a["units"] else [])
    return " + ".join(who) or "In-house"


def deliverables():
    rows = []
    for a in ASSETS:
        shoot = primary(a["shoot"]) + (secondary(a["location"], MUTED) if a["location"] else "")
        crew = badge(crew_label(a).upper(), SHOOT if a["two_person"] else BUILD)
        rows.append([
            cell(primary(a["name"]) + badge(a["status"], STATUS_FILL[a["status"]]), 80),
            cell(secondary(a["fmt"]), 80),
            cell(shoot, 80),
            cell(primary(a["edit"]), 80),
            cell(primary(a["v1"]), 80),
            cell(crew, 80),
        ])
    return document(title("DELIVERABLES") + table(DELIV_COLUMNS, rows) + footer(STAMP))


def total_spend_rows():
    return [
        ("ADAM", "Edits every asset", f"{sum(a['units'] for a in ASSETS)} assets "
         f"× {money(ADAM_PER_ASSET_P)}", money(ADAM_P)),
        ("DIANE", "Two-person shoots only · " + ", ".join(SHOOT_DAYS),
         f"{len(SHOOT_DAYS)} days × {money(DIANE_PER_DAY_P)}", money(DIANE_P)),
        ("FLIGHTS", "London Heathrow → Dublin, return · 1 passenger", "10–13 Sep", money(FLIGHTS_P)),
        ("ACCOMMODATION", "Dublin · incl. taxes and fees", "10–13 Sep", money(STAY_P)),
        ("FUEL", f"Dublin ⇄ Cork · {L_PER_100KM} L/100km at €{EUR_PER_L}/L · €1 = £{EUR_TO_GBP}",
         f"{KM} km", money(FUEL_P)),
        ("CAR HIRE", "Dublin ⇄ Cork for the UCC shoot", "12 Sep", "TBC"),
        ("TOLLS + PARKING", "M7 / M8, Parnell Park, UCC", "11–12 Sep", "TBC"),
        ("PADDING", f"{PADDING_RATE:.0%} contingency on the costed lines", "10%", money(PADDING_P)),
    ]


def total_spend():
    rows = total_spend_rows()
    grid = [[cell(primary(line), 48), cell(secondary(basis), 48),
             cell(secondary(units, MUTED), 48), cost_cell(cost, cost.startswith("£"))]
            for line, basis, units, cost in rows]
    open_lines = sum(1 for r in rows if not r[3].startswith("£"))
    blocks = (total_block("PROJECTED", money(PROJECTED_P), "#FFFFFF",
                          still_to_price(open_lines))
              + total_block("BUDGET", money(BUDGET_P), "#FFFFFF",
                            f"{len(WORK_DAYS)} work days × £{DAY_RATE:,.0f}")
              + total_block("HEADROOM", money(HEADROOM_P), SHOOT, "Before the open lines"))
    return document(title("TOTAL SPEND") + table(TOTAL_COLUMNS, grid) + band(blocks) + footer(STAMP))


def facts(fmt, shoot, location, edit, v1):
    shoot_cell = primary(shoot) + (secondary(location, MUTED) if location else "")
    return table(FACT_COLUMNS, [[cell(secondary(fmt), 62), cell(shoot_cell, 62),
                                 cell(primary(edit), 62), cell(primary(v1), 62)]])


def asset_spend(a):
    rows = [[cell(primary(line), 48), cell(secondary(basis), 48),
             cost_cell(money(p) if p is not None else "TBC", p is not None)]
            for line, basis, p in asset_lines(a)]
    open_lines = sum(1 for _, _, p in asset_lines(a) if p is None)
    blocks = (total_block("THIS ASSET", money(asset_total(a)), "#FFFFFF",
                          still_to_price(open_lines) if open_lines else "Fully costed")
              + total_block("ALL ASSETS", money(PROJECTED_P), HAIRLINE, "19 Aug – 20 Sep"))
    body = title(a["name"].upper(), 42)
    body += facts(a["fmt"], a["shoot"], a["location"], a["edit"], a["v1"])
    body += table(LINE_COLUMNS, rows)
    body += band(blocks)
    return document(body + footer(STAMP))


def template_rows():
    return [
        ("ADAM · EDIT", "Edits every asset · per delivered asset", money(ADAM_PER_ASSET_P)),
        ("DIANE · SHOOT", "Only when the shoot needs two people · one day splits across "
                          "the assets shot that day", f"{money(DIANE_PER_DAY_P)} / day"),
        ("TRAVEL", "Flights + stay, split across the assets the trip serves", "[ADD]"),
        ("FUEL", f"Driven legs · km × L/100km × pump price × FX · {KM} km Dublin ⇄ Cork "
                 f"came to {money(FUEL_P)}", "[ADD]"),
        ("CAR HIRE + TOLLS", "Split across the assets the trip serves", "[ADD]"),
        ("PADDING", f"{PADDING_RATE:.0%} contingency on the costed lines", "[10%]"),
    ]


def spend_template():
    rows = template_rows()
    grid = [[cell(primary(line), 48), cell(secondary(basis), 48),
             cost_cell(cost, cost.startswith("£"))] for line, basis, cost in rows]
    blocks = (total_block("THIS ASSET", "[TOTAL]", "#FFFFFF", "Costed lines plus padding")
              + total_block("NO SHOOT", money(ADAM_PER_ASSET_P + round(ADAM_PER_ASSET_P * PADDING_RATE)),
                            HAIRLINE, "Edit-only asset, floor cost"))
    body = title("[ASSET NAME]", 42)
    body += facts("[FORMAT]", "[SHOOT DATE]", "[LOCATION]", "[EDIT WINDOW]", "[V1 DUE]")
    body += table(LINE_COLUMNS, grid)
    body += band(blocks)
    return document(body + footer("BOOST IRELAND  ·  SPEND TEMPLATE"))


OUTPUT = {"Main.dc.html": deliverables(), "TotalSpend.dc.html": total_spend(),
          "Template.dc.html": spend_template()}
for _a in ASSETS:
    OUTPUT[f"{SLUGS[_a['name']]}.dc.html"] = asset_spend(_a)


# --------------------------------------------------------------------- canvas

PAGES = [{"id": "page-1", "name": "Overview"},
         {"id": "page-2", "name": "Per asset"},
         {"id": "page-3", "name": "Template"}]

STEP_X, STEP_Y, PER_ROW = 1560, 960, 3


def canvas():
    boards = [
        {"file": "Main.dc.html", "title": "Deliverables", "x": 0, "y": 0,
         "w": W, "h": H, "page": "page-1"},
        {"file": "TotalSpend.dc.html", "title": "Total spend", "x": STEP_X, "y": 0,
         "w": W, "h": H, "page": "page-1"},
    ]
    for i, a in enumerate(ASSETS):
        boards.append({"file": f"{SLUGS[a['name']]}.dc.html", "title": a["name"],
                       "x": (i % PER_ROW) * STEP_X, "y": (i // PER_ROW) * STEP_Y,
                       "w": W, "h": H, "page": "page-2"})
    boards.append({"file": "Template.dc.html", "title": "Spend template", "x": 0, "y": 0,
                   "w": W, "h": H, "page": "page-3"})
    return {"artboards": boards, "pages": PAGES,
            "launch": {"view": "canvas", "page": "page-2"}}


# ------------------------------------------------------------------ crew sheet
# Same ASSETS list, flattened for a spreadsheet Diane and Adam can sort and scan.

SHEET_HEADER = ["Asset", "Format", "Status", "Build", "Shoot", "Location", "Edit",
                "V1 due", "Client review", "Live", "Crew", "Adam fee", "Diane fee",
                "Travel share", "Padding", "Asset total"]


def sheet_rows():
    for a in ASSETS:
        by_line = {line: p for line, _, p in asset_lines(a)}

        def gbp(line):
            p = by_line.get(line)
            return f"{p / 100:.2f}" if p else ""

        travel = (by_line.get("TRAVEL") or 0) + (by_line.get("FUEL") or 0)
        yield [a["name"], a["fmt"], a["status"], a["build"], a["shoot"], a["location"],
               a["edit"], a["v1"], a["review"], a["live"],
               crew_label(a),
               gbp("ADAM · EDIT"), gbp("DIANE · SHOOT"),
               f"{travel / 100:.2f}" if travel else "", gbp("PADDING"),
               f"{asset_total(a) / 100:.2f}"]


def write_sheet(path="crew-sheet.csv"):
    import csv
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(SHEET_HEADER)
        w.writerows(sheet_rows())
    return path


# ------------------------------------------------------------------ deck data
# Structured export for build_pptx.js, so the PowerPoint build and the artboards
# read from the same numbers rather than being kept in step by hand.


def deck_data():
    slides = [
        {"kind": "deliverables", "title": "DELIVERABLES", "stamp": STAMP,
         "columns": [[c, w] for c, w in DELIV_COLUMNS],
         "rows": [{"name": a["name"], "status": a["status"],
                   "fill": STATUS_FILL[a["status"]], "fmt": a["fmt"],
                   "shoot": a["shoot"], "location": a["location"], "edit": a["edit"],
                   "v1": a["v1"], "crew": crew_label(a),
                   "crew_fill": SHOOT if a["two_person"] else BUILD} for a in ASSETS]},
        {"kind": "total", "title": "TOTAL SPEND", "stamp": STAMP,
         "columns": [[c, w] for c, w in TOTAL_COLUMNS],
         "rows": [{"line": line, "basis": basis, "units": units, "cost": cost}
                  for line, basis, units, cost in total_spend_rows()],
         "band": [["PROJECTED", money(PROJECTED_P), still_to_price(
             sum(1 for r in total_spend_rows() if not r[3].startswith("£")))],
             ["BUDGET", money(BUDGET_P), f"{len(WORK_DAYS)} work days × £{DAY_RATE:,.0f}"],
             ["HEADROOM", money(HEADROOM_P), "Before the open lines"]]},
    ]
    for a in ASSETS:
        open_lines = sum(1 for _, _, p in asset_lines(a) if p is None)
        slides.append({
            "kind": "asset", "title": a["name"].upper(), "stamp": STAMP,
            "facts": [a["fmt"], a["shoot"], a["location"], a["edit"], a["v1"]],
            "rows": [{"line": line, "basis": basis,
                      "cost": money(p) if p is not None else "TBC"}
                     for line, basis, p in asset_lines(a)],
            "band": [["THIS ASSET", money(asset_total(a)),
                      still_to_price(open_lines) if open_lines else "Fully costed"],
                     ["ALL ASSETS", money(PROJECTED_P), "19 Aug – 20 Sep"]]})
    slides.append({
        "kind": "asset", "title": "[ASSET NAME]", "stamp": "BOOST IRELAND  ·  SPEND TEMPLATE",
        "facts": ["[FORMAT]", "[SHOOT DATE]", "[LOCATION]", "[EDIT WINDOW]", "[V1 DUE]"],
        "rows": [{"line": line, "basis": basis, "cost": cost}
                 for line, basis, cost in template_rows()],
        "band": [["THIS ASSET", "[TOTAL]", "Costed lines plus padding"],
                 ["NO SHOOT", money(ADAM_PER_ASSET_P + round(ADAM_PER_ASSET_P * PADDING_RATE)),
                  "Edit-only asset, floor cost"]]})
    return {"slides": slides,
            "palette": {"paper": PAPER, "ink": INK, "muted": MUTED,
                        "hairline": HAIRLINE, "accent": ACCENT, "shoot": SHOOT}}


if __name__ == "__main__":
    import json

    for name, html in OUTPUT.items():
        with open(name, "w", encoding="utf-8") as fh:
            fh.write(html)
    for name, payload in (("canvas.json", canvas()), ("deck.json", deck_data())):
        with open(name, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2, ensure_ascii=False)
            fh.write("\n")
    write_sheet()

    print(f"{len(OUTPUT)} artboards, canvas.json, deck.json, crew-sheet.csv")
    for a in ASSETS:
        print(f"  {a['name']:<32} {money(asset_total(a)):>10}")
    print(f"  {'projected':<32} {money(PROJECTED_P):>10}")
    print(f"  {'budget':<32} {money(BUDGET_P):>10}")
    print(f"  {'headroom':<32} {money(HEADROOM_P):>10}")
