# TYPE-A Production Calendar

Canvas: https://claude.ai/code/artifact/9e8e97d8-544a-4e9a-823f-6ce49ee4fda0

Each month is a pair: a calendar and a pay sheet. The pay sheet is **computed
from the calendar data**, so moving or reassigning a job updates the day counts
and the money automatically — there is no second place to keep in sync.

## Adding a month

Add a block to `months.mjs` and re-run. Nothing else changes.

```js
const november = {
  year: 2026, month: 10,              // month is 0-indexed: 10 = November
  payPeriod: '1 – 30 November 2026',
  invoiceBy: '30 Nov',
  mark: 'Production · Nov 26',
  rates: { DM: 150, AD: 150, AN: 0 }, // per day, except Adam
  assets: { AD: 2 },                  // Adam bills per delivered asset
  title: "NOVEMBER '26",
  lead: [1],                          // trailing days of Oct shown greyed
  days: 30,
  trail: [],                          // leading days of Dec shown greyed
  cells: {
    3: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'REACT', who: 'DM', text: 'SOMETHING · SHOOT' } ] },
  },
};
```

Then add it to the loop at the bottom of `months.mjs` and to `canvas.json` as a
new column, and regenerate:

```bash
node months.mjs && node sheets.mjs
```

`lead` is how many days of the previous month fill the first row (the 1st's
weekday, Sunday-start); `trail` fills the last row to a whole number of weeks.

## Rates

`rates` and `assets` live per month in `months.mjs`, so a rate change part-way
through the year only affects the months after it.

- **Diane** — per day
- **Adam** — per delivered asset, not per day (`assets` sets the count)
- **Anita** — no rate agreed yet; her rows show `no rate agreed` until one is set

Rates and the basis for Diane and Adam come from the September spending slide
in PR #3.

## Files

- `build.mjs` — theme, calendar renderer, pay-sheet renderer
- `months.mjs` — the schedule; the only file with dates and owners in it
- `sheets.mjs` — the deliverables list
- `canvas.json` — artboard layout
- `typea-logo.webp` — studio mark, bottom of every board

## Conventions

- Day cell colour = stage (build, shoot, edit, feedback, live)
- Pill colour = client; chip on the pill = owner (AL, DM, AD, AN)
- Solid pill = date fixed with a client; dashed = proposed
- Hatched cell = Anaïs unavailable
