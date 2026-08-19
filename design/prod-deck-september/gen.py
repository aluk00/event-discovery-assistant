#!/usr/bin/env python3
"""Generate the September shoot-block artboards for the BOOST Ireland prod deck.

Two slides (production plan, spending) x two treatments:
  native - lifted from the existing deck tracker pages (thin grey cell rules,
           flat rectangular legend chips, black header band)
  bold   - the punchier 'JANUARY 26' calendar language (heavy black rules,
           rounded outlined pill badges, accent dot by the title)

Type, colour and geometry are measured from 2.0 prod deck.pdf at 2x (1pt -> 2px).
"""

W, H = 1440, 810
MARGIN = 64
CONTENT = W - 2 * MARGIN  # 1312

PAPER = "#F7F6F1"
INK = "#111111"
MUTED = "#6B6B66"
SUBTLE = "#555551"
HAIRLINE = "#9B9B96"
ACCENT = "#E8402A"

BUILD, SHOOT, EDIT, FEEDBACK, LIVE = "#A8C7FA", "#A7E8C4", "#FFCBA1", "#9FE0DA", "#FFAEA5"
YELLOW = "#FFE08A"

DISPLAY = "'Archivo Black', 'Arial Black', 'Helvetica Neue', sans-serif"
DISPLAY_W = "font-weight: 900; "
BODY = "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"


class Native:
    rule_h = 2
    cell_border = f"1.2px solid {HAIRLINE}"
    chip_radius = "0"
    chip_border = f"1.5px solid {INK}"
    badge_radius = "0"
    badge_border = f"1.2px solid {INK}"
    stage_fills_cell = True
    dot = False


class Bold:
    rule_h = 3
    cell_border = f"2px solid {INK}"
    chip_radius = "999px"
    chip_border = f"2px solid {INK}"
    badge_radius = "999px"
    badge_border = f"2px solid {INK}"
    stage_fills_cell = False
    dot = True


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def primary(text, colour=INK):
    return (f'<div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 15.2px; line-height: 1.15; '
            f'color: {colour};">{esc(text)}</div>')


def secondary(text, colour=INK):
    return (f'<div style="font-size: 14px; line-height: 1.25; color: {colour};">{esc(text)}</div>')


def badge(text, fill, t):
    return (f'<div style="display: inline-flex; align-items: center; justify-content: center; '
            f'padding: 6px 14px; background: {fill}; border: {t.badge_border}; '
            f'border-radius: {t.badge_radius}; font-family: {DISPLAY}; {DISPLAY_W}font-size: 11.5px; '
            f'letter-spacing: 0.04em; color: {INK}; box-sizing: border-box;">{esc(text)}</div>')


def cell(inner, t, fill=None, align="flex-start", height=66, justify="center"):
    bg = f"background: {fill}; " if fill else ""
    return (f'<div style="{bg}border-right: {t.cell_border}; border-bottom: {t.cell_border}; '
            f'box-sizing: border-box; height: {height}px; padding: 0 14px; display: flex; '
            f'flex-direction: column; justify-content: {justify}; align-items: {align}; gap: 5px;">'
            f'{inner}</div>')


def head_cell(label, t):
    return (f'<div style="background: {INK}; border-right: {t.cell_border}; '
            f'border-bottom: {t.cell_border}; box-sizing: border-box; height: 41px; display: flex; '
            f'align-items: center; justify-content: center; font-family: {DISPLAY}; '
            f'font-size: 12.8px; letter-spacing: 0.04em; color: #FFFFFF; text-align: center; '
            f'line-height: 1.15;">{esc(label)}</div>')


def chip(label, fill, t):
    return (f'<div style="width: 200px; height: 32px; background: {fill}; border: {t.chip_border}; '
            f'border-radius: {t.chip_radius}; display: flex; align-items: center; '
            f'justify-content: center; font-family: {DISPLAY}; {DISPLAY_W}font-size: 10px; '
            f'letter-spacing: 0.06em; color: {INK}; box-sizing: border-box;">{esc(label)}</div>')


def header(title, sublabel, chip_rows, t):
    dot = ""
    if t.dot:
        dot = (f'<div style="width: 26px; height: 26px; border-radius: 50%; background: {ACCENT}; '
               f'flex: none; margin-top: 6px;"></div>')
    rows = "".join(
        f'<div style="display: flex; gap: 8px;">{"".join(chip(label, f, t) for label, f in row)}</div>'
        for row in chip_rows
    )
    return f'''  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 40px;">
    <div style="display: flex; flex-direction: column;">
      <div style="display: flex; align-items: flex-start; gap: 16px;">
        <div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 58px; line-height: 58px; letter-spacing: -0.015em;
        color: {INK};">{esc(title)}</div>
        {dot}
      </div>
      <div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 16px; line-height: 16px; letter-spacing: 0.06em;
      color: {SUBTLE}; margin-top: 20px;">{esc(sublabel)}</div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 2px;">
      {rows}
    </div>
  </div>

  <div style="height: {t.rule_h}px; background: {INK}; margin-top: 12px;"></div>
'''


def table(columns, rows, t):
    tracks = " ".join(f"{w}fr" for _, w in columns)
    cells = "".join(head_cell(label, t) for label, _ in columns)
    for row in rows:
        cells += "\n    " + "".join(row)
    return (f'\n  <div style="display: grid; grid-template-columns: {tracks}; width: {CONTENT}px; '
            f'box-sizing: border-box; border-top: {t.cell_border}; border-left: {t.cell_border}; '
            f'margin-top: 22px;">\n    {cells}\n  </div>\n')


def notes(lines):
    items = "".join(
        f'<div style="font-size: 14px; line-height: 1.3; color: {MUTED};">{esc(label)}</div>'
        for label in lines
    )
    return (f'\n  <div style="display: flex; gap: 40px; margin-top: 22px;">{items}</div>\n')


def footer():
    return f'''
  <div style="position: absolute; left: {MARGIN}px; right: {MARGIN}px; bottom: 24px; display: flex;
  justify-content: space-between; align-items: baseline;">
    <div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 20px; color: {INK};">re:act</div>
    <div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.06em;
    color: {MUTED};">BOOST IRELAND  ·  SEP 26</div>
  </div>
'''


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
<div style="position: relative; width: {W}px; height: {H}px; background: {PAPER}; padding: 48px {MARGIN}px 0;
box-sizing: border-box; font-family: {BODY};">
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


# ---------------------------------------------------------------- production

PROD_COLUMNS = [("DATE", 190), ("STAGE", 150), ("MOVEMENT", 300),
                ("SHOOT / LOCATION", 372), ("NOTES", 300)]

# date, date-sub, stage label, stage colour (None = no stage), movement, movement-sub,
# shoot, shoot-sub, note
PROD_ROWS = [
    ("TUE 8 SEP", "Pre-pro lock", "BUILD", BUILD, "", "", "PRE-PRODUCTION PACKS",
     "Final versions to client", "OSG + storyboards locked for all three assets"),
    ("THU 10 SEP", "Travel day", "TRAVEL", None, "LHR → DUB", "Return fare quoted · not booked",
     "NO SHOOT", "", "Dublin check-in · kit check ahead of two shoot days"),
    ("FRI 11 SEP", "Shoot day 1", "SHOOT", SHOOT, "Dublin, local", "",
     "PARNELL PARK · 18:45", "Dublin hurling championship",
     "Explain Hurling in 10 Seconds + Matchday Rituals · two reels, twelve boards"),
    ("SAT 12 SEP", "Shoot day 2", "SHOOT", SHOOT, "DUB ⇄ CORK", "Driving · 520 km return",
     "UCC FRESHERS’ FESTIVAL", "Cork",
     "First Week Promises · BOOST multipack gifting for contributors"),
    ("SUN 13 SEP", "Travel day", "TRAVEL", None, "DUB → LHR", "Return leg of the quoted fare",
     "NO SHOOT", "", "Rushes backed up and handed to edit the same day"),
    ("13–15 SEP", "Post", "EDIT", EDIT, "", "", "ALL THREE ASSETS", "",
     "13 Sep first pass · 14 Sep full cut · 15 Sep final pass"),
    ("WED 16 SEP", "V1 out", "FEEDBACK", FEEDBACK, "", "", "V1 SENT TO CLIENT", "",
     "All three edits · client review 17–20 Sep"),
]


def production(t):
    rows = []
    for date, dsub, stage, colour, mov, msub, shoot, ssub, note in PROD_ROWS:
        date_cell = cell(primary(date) + secondary(dsub, MUTED), t)

        if colour is None:
            stage_inner = primary(stage, HAIRLINE)
            stage_cell = cell(stage_inner, t, justify="center")
        elif t.stage_fills_cell:
            stage_cell = cell(primary(stage), t, fill=colour)
        else:
            stage_cell = cell(badge(stage, colour, t), t)

        mov_inner = primary(mov) + (secondary(msub, MUTED) if msub else "") if mov \
            else secondary("—", HAIRLINE)
        shoot_inner = primary(shoot) + (secondary(ssub) if ssub else "")

        rows.append([date_cell, stage_cell, cell(mov_inner, t),
                     cell(shoot_inner, t), cell(secondary(note), t)])

    body = header("SEPTEMBER ’26", "SHOOT BLOCK 8–16 SEP  ·  COLOUR = PRODUCTION STAGE",
                  [[("BUILD", BUILD), ("SHOOT", SHOOT), ("EDIT", EDIT)],
                   [("FEEDBACK", FEEDBACK), ("LIVE", LIVE)]], t)
    body += table(PROD_COLUMNS, rows, t)
    body += notes(["Travel and accommodation are quoted for 10–13 Sep, not yet booked.",
                   "The Cork leg on 12 Sep is driven — 520 km return from Dublin, same day."])
    body += footer()
    return document(body)


# ------------------------------------------------------------------ spending

SPEND_COLUMNS = [("LINE ITEM", 260), ("BASIS", 452), ("UNITS", 250),
                 ("STATUS", 190), ("COST", 160)]

AGREED, QUOTED, ESTIMATE, OPEN = SHOOT, BUILD, FEEDBACK, YELLOW

# Budget envelope: the client rate is per day of work, so count the working days
# off the September calendar rather than the length of the trip.
WORK_DAYS = ["1 Sep build", "7 Sep pre-pro revisions", "11 Sep shoot", "12 Sep shoot",
             "13 Sep edit", "14 Sep edit", "15 Sep edit"]
DAY_RATE = 400.00
BUDGET = len(WORK_DAYS) * DAY_RATE

# Fuel: Dublin-Cork is 260 km each way on the M7/M8, driven there and back on the
# 12th. Irish pump prices averaged EUR 1.84/L in August 2026 with a further ~9c of
# excise restored from 1 September, so the shoot lands near EUR 1.93/L.
KM = 520
L_PER_100KM = 6.5
EUR_PER_L = 1.93
EUR_TO_GBP = 0.855
FUEL = round(KM / 100 * L_PER_100KM * EUR_PER_L * EUR_TO_GBP, 2)

DIANE = 2 * 150.00
ADAM = 3 * 150.00
FLIGHTS = 164.66
STAY = 134.00

COSTED = DIANE + ADAM + FLIGHTS + STAY + FUEL
PADDING = round(COSTED * 0.10, 2)
PROJECTED = round(COSTED + PADDING, 2)
HEADROOM = round(BUDGET - PROJECTED, 2)


def money(v):
    return f"£{v:,.2f}"


# item, basis, units, status, status colour, cost
SPEND_ROWS = [
    ("DIANE", "Shoot crew, on both shoot days", "2 days × £150",
     "RATE AGREED", AGREED, money(DIANE)),
    ("ADAM", "Edit, charged per delivered asset", "3 assets × £150",
     "RATE AGREED", AGREED, money(ADAM)),
    ("FLIGHTS", "London Heathrow → Dublin, return · 1 passenger", "10–13 Sep",
     "QUOTED", QUOTED, money(FLIGHTS)),
    ("ACCOMMODATION", "Dublin · signature twin, incl. taxes and fees", "10–13 Sep",
     "QUOTED", QUOTED, money(STAY)),
    ("FUEL", f"Dublin ⇄ Cork · {L_PER_100KM} L/100km at €{EUR_PER_L}/L · €1 = £{EUR_TO_GBP}",
     f"{KM} km", "ESTIMATE", ESTIMATE, money(FUEL)),
    ("CAR HIRE", "Dublin ⇄ Cork for the UCC shoot", "12 Sep",
     "TO CONFIRM", OPEN, "TBC"),
    ("TOLLS + PARKING", "M7 / M8 tolls, Parnell Park and UCC", "11–12 Sep",
     "TO CONFIRM", OPEN, "TBC"),
    ("CONTRIBUTOR GIFTING", "BOOST multipacks, First Week Promises", "12 Sep",
     "TO CONFIRM", OPEN, "TBC"),
    ("PADDING", "10% contingency on the costed lines above", "10%",
     "ESTIMATE", ESTIMATE, money(PADDING)),
]


def total_block(label, value, value_colour="#FFFFFF", sub=""):
    subline = ""
    if sub:
        subline = (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 11px; '
                   f'letter-spacing: 0.04em; color: {HAIRLINE}; margin-top: 3px;">{esc(sub)}</div>')
    return (f'<div style="display: flex; flex-direction: column; justify-content: center;">'
            f'<div style="display: flex; align-items: baseline; gap: 14px;">'
            f'<div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 12px; '
            f'letter-spacing: 0.06em; color: {HAIRLINE};">{esc(label)}</div>'
            f'<div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 22px; '
            f'color: {value_colour};">{esc(value)}</div></div>{subline}</div>')


def totals_band():
    blocks = (total_block("PROJECTED", money(PROJECTED), "#FFFFFF", "Three lines still to price")
              + total_block("BUDGET", money(BUDGET), "#FFFFFF",
                            f"{len(WORK_DAYS)} work days × £{DAY_RATE:,.0f}")
              + total_block("HEADROOM", money(HEADROOM), AGREED))
    return (f'\n  <div style="display: flex; align-items: center; justify-content: space-between; '
            f'width: {CONTENT}px; box-sizing: border-box; background: {INK}; padding: 0 18px; '
            f'height: 54px; margin-top: -1px;">{blocks}</div>\n')


def spending(t):
    rows = []
    for item, basis, units, status, colour, cost in SPEND_ROWS:
        priced = cost.startswith("£")
        cost_html = (f'<div style="font-family: {DISPLAY}; {DISPLAY_W}font-size: 17px; '
                     f'line-height: 1.1; color: {INK if priced else HAIRLINE};">{esc(cost)}</div>')
        rows.append([
            cell(primary(item), t, height=46),
            cell(secondary(basis), t, height=46),
            cell(secondary(units), t, height=46),
            cell(badge(status, colour, t), t, height=46),
            cell(cost_html, t, height=46, align="flex-end"),
        ])

    body = header("SEPTEMBER ’26", "SHOOT BLOCK SPEND  ·  ALL FIGURES GBP",
                  [[("RATE AGREED", AGREED), ("QUOTED", QUOTED)],
                   [("ESTIMATE", ESTIMATE), ("TO CONFIRM", OPEN)]], t)
    body += table(SPEND_COLUMNS, rows, t)
    body += totals_band()
    body += notes([
        "Diane is costed for the two shoot days only — add build and edit days if she is on those.",
        "Car hire, tolls and parking, and contributor gifting are still to price.",
    ])
    body += footer()
    return document(body)


OUTPUT = {
    "Main.dc.html": production(Native),
    "Spending.dc.html": spending(Native),
    "ProductionBold.dc.html": production(Bold),
    "SpendingBold.dc.html": spending(Bold),
}

if __name__ == "__main__":
    for name, html in OUTPUT.items():
        with open(name, "w", encoding="utf-8") as fh:
            fh.write(html)
        print(f"{name}: {len(html)} bytes")
