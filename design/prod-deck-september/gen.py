#!/usr/bin/env python3
"""Generate the crew + spend artboards for the BOOST Ireland prod deck.

Two slides covering 19 Aug - 20 Sep 2026:
  Deliverables - line by line, who is on what, built to be scanned
  Spend        - crew and travel against the day-rate budget

Crew rules: Adam edits every asset. Diane is only on shoots that need two people.

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


def title(text):
    return (f'  <div style="display: flex; align-items: flex-start; gap: 16px;">\n'
            f'    <div style="font-family: {DISPLAY}; {DW}font-size: 58px; line-height: 58px; '
            f'letter-spacing: -0.015em; color: {INK};">{esc(text)}</div>\n'
            f'    <div style="width: 26px; height: 26px; border-radius: 50%; background: {ACCENT}; '
            f'flex: none; margin-top: 6px;"></div>\n  </div>\n\n'
            f'  <div style="height: 3px; background: {INK}; margin-top: 22px;"></div>\n')


def table(columns, rows):
    tracks = " ".join(f"{w}fr" for _, w in columns)
    cells = "".join(head_cell(label) for label, _ in columns)
    for row in rows:
        cells += "\n    " + "".join(row)
    return (f'\n  <div style="display: grid; grid-template-columns: {tracks}; width: {CONTENT}px; '
            f'box-sizing: border-box; border-top: {RULE}; border-left: {RULE}; '
            f'margin-top: 22px;">\n    {cells}\n  </div>\n')


def footer(stamp):
    return (f'\n  <div style="position: absolute; left: {MARGIN}px; right: {MARGIN}px; bottom: 24px; '
            f'display: flex; justify-content: space-between; align-items: baseline;">\n'
            f'    <div style="font-family: {DISPLAY}; {DW}font-size: 20px; color: {INK};">re:act</div>\n'
            f'    <div style="font-family: {BODY}; font-weight: 700; font-size: 14px; '
            f'letter-spacing: 0.06em; color: {MUTED};">{esc(stamp)}</div>\n  </div>\n')


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
# One list drives the deliverables slide, the spend maths and the crew sheet.
# two_person marks a shoot that needs Diane as well as the shooter; units is how
# many billable assets the line represents (Reactive holds two slots a month).

ASSETS = [
    dict(name="EP Bag Check", fmt="Stories + carousel", build="18 Aug",
         shoot="No shoot", location="", edit="18 Aug", v1="19 Aug",
         review="20–23 Aug", live="28 Aug", two_person=False, units=1, status="IN REVIEW"),
    dict(name="Red Card Holiday Rules", fmt="9:16 Reel · vox pop", build="TBC",
         shoot="22 Aug", location="Airport / holiday travellers", edit="23–24 Aug", v1="24 Aug",
         review="24–28 Aug", live="TBC", two_person=True, units=1, status="SHOOTING"),
    dict(name="Explain Hurling in 10 Seconds", fmt="9:16 Reel · vox pop", build="31 Aug",
         shoot="11 Sep", location="Parnell Park, Dublin · 18:45", edit="13–15 Sep", v1="16 Sep",
         review="17–20 Sep", live="TBC", two_person=True, units=1, status="PRE-PRO"),
    dict(name="Matchday Rituals", fmt="9:16 Reel · vox pop", build="31 Aug",
         shoot="11 Sep", location="Parnell Park, Dublin · 18:45", edit="13–15 Sep", v1="16 Sep",
         review="17–20 Sep", live="TBC", two_person=True, units=1, status="PRE-PRO"),
    dict(name="First Week Promises", fmt="9:16 Reel · vox pop", build="1 Sep",
         shoot="12 Sep", location="UCC Freshers’ Festival, Cork", edit="13–15 Sep", v1="16 Sep",
         review="17–20 Sep", live="TBC", two_person=True, units=1, status="PRE-PRO"),
    dict(name="Reactive × 4", fmt="TikTok / Reel", build="Week of posting",
         shoot="No shoot", location="", edit="Week of posting", v1="Week of posting",
         review="—", live="Two slots a month", two_person=False, units=4, status="SLOTS HELD"),
]

# Days of work in the window, off the August and September calendars. Only build,
# shoot and edit days count against the rate — feedback and live days do not.
WORK_DAYS = ["22 Aug shoot", "23 Aug edit", "24 Aug edit", "31 Aug build",
             "1 Sep build", "7 Sep edit", "11 Sep shoot", "12 Sep shoot",
             "13 Sep edit", "14 Sep edit", "15 Sep edit"]
DAY_RATE = 400.00
BUDGET = len(WORK_DAYS) * DAY_RATE

ADAM_PER_ASSET = 150.00
DIANE_PER_DAY = 150.00

ASSET_COUNT = sum(a["units"] for a in ASSETS)
# Hurling and Matchday share the 11 Sep shoot, so bill Diane by distinct date.
# dict.fromkeys dedupes while holding calendar order; sorted() would read "11 Sep,
# 12 Sep, 22 Aug".
TWO_PERSON_DAYS = list(dict.fromkeys(a["shoot"] for a in ASSETS if a["two_person"]))

ADAM = ASSET_COUNT * ADAM_PER_ASSET
DIANE = len(TWO_PERSON_DAYS) * DIANE_PER_DAY

# Dublin-Cork is 260 km each way on the M7/M8, driven there and back on the 12th.
# Irish pump prices averaged EUR 1.84/L in August 2026 with ~9c of excise restored
# from 1 September, so the shoot lands near EUR 1.93/L.
KM, L_PER_100KM, EUR_PER_L, EUR_TO_GBP = 520, 6.5, 1.93, 0.855
FUEL = round(KM / 100 * L_PER_100KM * EUR_PER_L * EUR_TO_GBP, 2)
FLIGHTS, STAY = 164.66, 134.00

COSTED = ADAM + DIANE + FLIGHTS + STAY + FUEL
PADDING = round(COSTED * 0.10, 2)
PROJECTED = round(COSTED + PADDING, 2)
HEADROOM = round(BUDGET - PROJECTED, 2)


def money(v):
    return f"£{v:,.2f}"


# ---------------------------------------------------------- deliverables slide

DELIV_COLUMNS = [("ASSET", 322), ("FORMAT", 190), ("SHOOT", 300),
                 ("EDIT", 170), ("V1 DUE", 140), ("CREW", 190)]

STATUS_FILL = {"IN REVIEW": FEEDBACK, "SHOOTING": SHOOT, "PRE-PRO": BUILD, "SLOTS HELD": YELLOW}


def deliverables():
    rows = []
    for a in ASSETS:
        shoot = primary(a["shoot"]) + (secondary(a["location"], MUTED) if a["location"] else "")
        crew = badge("DIANE + ADAM" if a["two_person"] else "ADAM",
                     SHOOT if a["two_person"] else BUILD)
        rows.append([
            cell(primary(a["name"]) + badge(a["status"], STATUS_FILL[a["status"]]), 80),
            cell(secondary(a["fmt"]), 80),
            cell(shoot, 80),
            cell(primary(a["edit"]), 80),
            cell(primary(a["v1"]), 80),
            cell(crew, 80),
        ])
    body = title("DELIVERABLES")
    body += table(DELIV_COLUMNS, rows)
    body += footer("BOOST IRELAND  ·  19 AUG – 20 SEP")
    return document(body)


# ----------------------------------------------------------------- spend slide

SPEND_COLUMNS = [("LINE", 300), ("BASIS", 520), ("UNITS", 232), ("COST", 260)]


def spend_rows():
    return [
        ("ADAM", "Edits every asset", f"{ASSET_COUNT} assets × {money(ADAM_PER_ASSET)}", money(ADAM)),
        ("DIANE", "Two-person shoots only · " + ", ".join(TWO_PERSON_DAYS),
         f"{len(TWO_PERSON_DAYS)} days × {money(DIANE_PER_DAY)}", money(DIANE)),
        ("FLIGHTS", "London Heathrow → Dublin, return · 1 passenger", "10–13 Sep", money(FLIGHTS)),
        ("ACCOMMODATION", "Dublin · incl. taxes and fees", "10–13 Sep", money(STAY)),
        ("FUEL", f"Dublin ⇄ Cork · {L_PER_100KM} L/100km at €{EUR_PER_L}/L · €1 = £{EUR_TO_GBP}",
         f"{KM} km", money(FUEL)),
        ("CAR HIRE", "Dublin ⇄ Cork for the UCC shoot", "12 Sep", "TBC"),
        ("TOLLS + PARKING", "M7 / M8, Parnell Park, UCC", "11–12 Sep", "TBC"),
        ("PADDING", "10% contingency on the costed lines", "10%", money(PADDING)),
    ]


def total_block(label, value, value_colour, sub):
    return (f'<div style="display: flex; flex-direction: column; justify-content: center;">'
            f'<div style="display: flex; align-items: baseline; gap: 14px;">'
            f'<div style="font-family: {DISPLAY}; {DW}font-size: 12px; letter-spacing: 0.06em; '
            f'color: {HAIRLINE};">{esc(label)}</div>'
            f'<div style="font-family: {DISPLAY}; {DW}font-size: 22px; '
            f'color: {value_colour};">{esc(value)}</div></div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 11px; '
            f'letter-spacing: 0.04em; color: {HAIRLINE}; margin-top: 3px;">{esc(sub)}</div></div>')


def spend():
    rows = []
    for line, basis, units, cost in spend_rows():
        priced = cost.startswith("£")
        rows.append([
            cell(primary(line), 48),
            cell(secondary(basis), 48),
            cell(secondary(units, MUTED), 48),
            cell(primary(cost, INK if priced else HAIRLINE, 17), 48, align="flex-end"),
        ])

    open_lines = sum(1 for r in spend_rows() if not r[3].startswith("£"))
    blocks = (total_block("PROJECTED", money(PROJECTED), "#FFFFFF",
                          f"{open_lines} lines still to price")
              + total_block("BUDGET", money(BUDGET), "#FFFFFF",
                            f"{len(WORK_DAYS)} work days × £{DAY_RATE:,.0f}")
              + total_block("HEADROOM", money(HEADROOM), SHOOT, "Before the open lines"))

    body = title("SPEND")
    body += table(SPEND_COLUMNS, rows)
    body += (f'\n  <div style="display: flex; align-items: center; justify-content: space-between; '
             f'width: {CONTENT}px; box-sizing: border-box; background: {INK}; padding: 0 18px; '
             f'height: 54px; margin-top: -2px;">{blocks}</div>\n')
    body += footer("BOOST IRELAND  ·  19 AUG – 20 SEP")
    return document(body)


OUTPUT = {"Main.dc.html": deliverables(), "Spend.dc.html": spend()}


# ------------------------------------------------------------------ crew sheet
# Same ASSETS list, flattened for a spreadsheet Diane and Adam can sort and scan.

SHEET_HEADER = ["Asset", "Format", "Status", "Build", "Shoot", "Location", "Edit",
                "V1 due", "Client review", "Live", "Crew", "Adam fee", "Diane fee"]


def sheet_rows():
    billed = set()
    for a in ASSETS:
        # Diane is billed once per shoot day, not once per asset - Hurling and
        # Matchday come off the same evening at Parnell Park.
        diane = ""
        if a["two_person"] and a["shoot"] not in billed:
            billed.add(a["shoot"])
            diane = f"{DIANE_PER_DAY:.2f}"
        yield [a["name"], a["fmt"], a["status"], a["build"], a["shoot"], a["location"],
               a["edit"], a["v1"], a["review"], a["live"],
               "Diane + Adam" if a["two_person"] else "Adam",
               f"{a['units'] * ADAM_PER_ASSET:.2f}", diane]


def write_sheet(path="crew-sheet.csv"):
    import csv
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(SHEET_HEADER)
        w.writerows(sheet_rows())
    return path


if __name__ == "__main__":
    for name, html in OUTPUT.items():
        with open(name, "w", encoding="utf-8") as fh:
            fh.write(html)
        print(f"{name}: {len(html)} bytes")
    print(f"{write_sheet()}: {ASSET_COUNT} assets, {len(TWO_PERSON_DAYS)} two-person days")
    print(f"adam={ADAM} diane={DIANE} costed={COSTED} padding={PADDING}")
    print(f"projected={PROJECTED} budget={BUDGET} headroom={HEADROOM}")
