# BOOST Ireland — deliverables + spend, 19 Aug to 20 Sep

Design source for the slides added to the re:act prod deck ("2.0 prod deck",
owned by Diane and shared in), plus the crew sheet generated alongside them.

Nine artboards across three canvas pages:

| Page | Artboards |
| --- | --- |
| Overview | `Main` (deliverables, every asset line by line) and `TotalSpend` (everything pooled, against the budget) |
| Per asset | One slide per asset — what that single asset costs and why |
| Template | The same shape with the standing rules, ready for the next asset |

Everything — slides, `canvas.json`, `crew-sheet.csv`, and `deck.json` for the
PowerPoint build — comes off one `ASSETS` list in `gen.py`, so a schedule change
moves the lot together.

## Crew rules

Encoded in `gen.py` rather than written into the copy:

- **Adam edits every asset he is on** — billed per delivered asset via `units`.
  Reactive holds two slots a month, so it carries `units=4`; EP Bag Check is
  built in-house rather than edited, so it carries `units=0` and no fee.
- **Diane is only on shoots that need two people** — `two_person=True`, billed
  per *shoot day*. Explain Hurling and Matchday Rituals come off the same
  evening at Parnell Park, so that day bills once and splits between them.

## Allocating shared costs

The per-asset slides exist because a pooled total cannot answer "what did this
one cost". Three kinds of line:

- **Direct** — Adam's edit fee, and fuel for the leg an asset is the reason for.
- **Per day, split** — Diane's day divides across the assets shot that day.
- **Per trip, split** — flights and the Dublin stay divide across the assets the
  trip serves (`trip=True`).

Money is allocated in **pennies**, with remainders handed to the earliest share,
so the per-asset slides sum to the total slide exactly rather than drifting a
penny per division. That is why Explain Hurling reads GBP 357.02 and Matchday
Rituals GBP 357.01.

An asset with nothing chargeable renders a single NO SPEND line rather than an
empty table.

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

Car hire and tolls/parking are left as TBC — structure, not invented costs.
Contributor gifting is free, so it is not a spend line.

## Art direction

Measured from the deck PDF rather than approximated, at 2x (1pt -> 2px), so the
artboards land at 1440x810:

- **Type** — Archivo Black (display) and Space Grotesk (secondary).
- **Colour** — paper `#F7F6F1`, ink `#111111`, muted `#6B6B66`, hairline
  `#9B9B96`, accent `#E8402A`; stage fills build `#A8C7FA`, shoot `#A7E8C4`,
  edit `#FFCBA1`, feedback `#9FE0DA`, live `#FFAEA5`, held `#FFE08A`.
- **Geometry** — 64px side margins, 1312px content width, 41px black header band,
  2px rules and rounded outlined badges.

Every slide is deliberately bare: title, rule, table(s), footer. No eyebrows, no
legend rows, no note strips — the badges and column heads carry the meaning.

## Regenerating

`gen.py` writes the artboards, `canvas.json`, `deck.json` and the CSV in one run:

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
  $(for f in *.dc.html; do printf -- "--artboard %s " "$f"; done) \
  --canvas canvas.json
node "$BASE/seed-canvas.mjs" --check september-shoot-block.html
```

## PowerPoint

`build_pptx.js` turns `deck.json` into an editable 9-slide deck at 10 x 5.625in,
matching the existing deck's page size so the slides import straight into it
(Slides: File -> Import slides). Real text and tables, not images.

```bash
npm install pptxgenjs
node build_pptx.js
```

## Adding an asset

Append a `dict(...)` to `ASSETS` and a slug to `SLUGS`, then re-run. The new
asset picks up its own spend slide, its share of any trip it is flagged onto,
a row in the deliverables table, a row in the sheet and a PowerPoint slide.
