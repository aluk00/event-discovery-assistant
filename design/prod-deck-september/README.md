# BOOST Ireland — deliverables + spend, 19 Aug to 20 Sep

Design source for two slides added to the re:act prod deck ("2.0 prod deck",
owned by Diane and shared in), plus the crew sheet generated alongside them.

- **Deliverables** (`Main.dc.html`) — every asset in the window line by line:
  format, shoot date and location, edit window, V1 due, and who is on it.
- **Spend** (`Spend.dc.html`) — crew and travel against the day-rate budget.
- **Crew sheet** (`crew-sheet.csv`) — the same rows flattened for a spreadsheet
  Diane and Adam can sort and scan.

All three come off one `ASSETS` list in `gen.py`, so a change to the schedule
moves the slides, the totals and the sheet together.

## Crew rules

Encoded in `gen.py` rather than written into the copy:

- **Adam edits every asset** — billed per delivered asset, `units` on each entry
  (Reactive holds two slots a month, so it carries `units=4`).
- **Diane is only on shoots that need two people** — `two_person=True`, billed
  per distinct *shoot day*. Explain Hurling and Matchday Rituals come off the
  same evening at Parnell Park, so that day bills once, not twice.

## Budget

The rate is per day of work, so `WORK_DAYS` counts build, shoot and edit days
off the August and September calendars — feedback and live days do not count.
Eleven days at GBP 400 gives a GBP 4,400 envelope.

## Fuel

Derived rather than guessed. Dublin to Cork is 260 km each way on the M7/M8,
driven there and back on the 12th:

```
520 km x 6.5 L/100km x EUR 1.93/L x 0.855 GBP/EUR = GBP 55.78
```

Irish pump prices averaged EUR 1.84/L in August 2026 with roughly 9c of excise
restored from 1 September, which is where the EUR 1.93 comes from. Distance,
consumption, pump price and the FX rate are named constants.

Car hire, tolls and parking, and contributor gifting are left as TBC — structure,
not invented costs.

## Art direction

Measured from the deck PDF rather than approximated, at 2x (1pt -> 2px), so the
artboards land at 1440x810:

- **Type** — Archivo Black (display) and Space Grotesk (secondary).
- **Colour** — paper `#F7F6F1`, ink `#111111`, muted `#6B6B66`, hairline
  `#9B9B96`, accent `#E8402A`; stage fills build `#A8C7FA`, shoot `#A7E8C4`,
  edit `#FFCBA1`, feedback `#9FE0DA`, live `#FFAEA5`, held `#FFE08A`.
- **Geometry** — 64px side margins, 1312px content width, 41px black header band,
  2px rules and rounded outlined badges.

Both slides are deliberately bare: title, rule, table, footer. No eyebrows, no
legend rows, no note strips — the badges and column heads carry the meaning.

## Regenerating

`gen.py` writes both artboards and the CSV:

```bash
python3 gen.py
```

Then re-seed the canvas (the output is gitignored; it is ~2.3 MB of editor
payload):

```bash
BASE=<claude design skill base directory>
node "$BASE/seed-canvas.mjs" \
  --template "$BASE/payload.template.html" \
  --out september-shoot-block.html \
  --title "September Shoot Block" \
  --artboard Main.dc.html --artboard Spend.dc.html \
  --canvas canvas.json
node "$BASE/seed-canvas.mjs" --check september-shoot-block.html
```
