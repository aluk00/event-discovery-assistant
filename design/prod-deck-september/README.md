# September shoot block — production plan + spending

Two slides drafted for the BOOST Ireland / re:act deck ("2.0 prod deck"), covering
the September shoot block: the production plan for 8–16 Sep and the spending
breakdown for the same window.

Each slide exists in two treatments so the art direction can be chosen:

| Treatment | Artboards | Look |
| --- | --- | --- |
| Deck native | `Main.dc.html`, `Spending.dc.html` | The existing tracker pages: 1.2px grey cell rules, flat rectangular legend chips, stage colour flooding the whole cell |
| Bolder | `ProductionBold.dc.html`, `SpendingBold.dc.html` | The `JANUARY '26` calendar language in the deck palette: 2px black rules, rounded outlined badges, accent dot beside the title |

## Art direction

Measured from the deck PDF rather than approximated, at 2x (1pt -> 2px), so the
slides drop in at 1440x810:

- **Type** — Archivo Black (display, 58px title / 15.2px cell primary / 12.8px
  table head) and Space Grotesk (14px cell secondary). Both are on Google Fonts.
- **Colour** — paper `#F7F6F1`, ink `#111111`, muted `#6B6B66`, cell hairline
  `#9B9B96`, accent `#E8402A`.
- **Production stages** — build `#A8C7FA`, shoot `#A7E8C4`, edit `#FFCBA1`,
  feedback `#9FE0DA`, live `#FFAEA5`, status yellow `#FFE08A`.
- **Geometry** — 64px side margins (32pt), 1312px content width, 41px table
  header band, 66px production rows / 46px spending rows.

## Cost model

The budget envelope is a day rate against days of work, not the length of the
trip, so `WORK_DAYS` counts the build, shoot and edit days off the September
calendar (7 days x GBP 400 = GBP 2,800).

Costed lines: Diane at GBP 150/day for the two shoot days, Adam at GBP 150 per
delivered asset across three assets, the quoted flight and accommodation, and
fuel. Padding is 10% on the costed lines.

Fuel is derived rather than guessed — Dublin to Cork is 260 km each way on the
M7/M8, driven there and back on the 12th:

```
520 km x 6.5 L/100km x EUR 1.93/L x 0.855 GBP/EUR = GBP 55.78
```

Irish pump prices averaged EUR 1.84/L in August 2026 with roughly 9c of excise
restored from 1 September, which is where the EUR 1.93 comes from. All three
inputs are constants at the top of the spending section, so they are easy to
re-point when the real numbers land.

Car hire, tolls and parking, and contributor gifting are left as TBC — they are
structure, not invented costs. Two assumptions are printed on the slide itself:
Diane is costed for shoot days only, and the flight and accommodation figures
are quotes rather than bookings.

## Regenerating

`gen.py` is the single source for all four artboards — edit it rather than the
generated `.dc.html` files, which it overwrites:

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
  --artboard Main.dc.html --artboard Spending.dc.html \
  --artboard ProductionBold.dc.html --artboard SpendingBold.dc.html \
  --canvas canvas.json
node "$BASE/seed-canvas.mjs" --check september-shoot-block.html
```

`canvas.json` lays the four artboards out in two rows, one per treatment.
