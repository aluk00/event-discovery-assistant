// Theme, components and renderers for the TYPE-A production calendar.
// Every board is generated. Day counts and pay are computed from the SAME
// schedule data as the calendars, so the two can never drift apart.
import { writeFileSync } from 'node:fs';

const T = {
  ground: '#FBF8EF', card: '#FFFDF7', ink: '#2B3F6C', dim: '#7A87A8',
  gold: '#E9C87F', hatch: '#DAD5C8', hatch2: '#C9C3B4', out: '#BDC6DA', hair: '#E4E0D3',
};
const CO = {
  WPP:   { bg: '#1B4FE8', fg: '#FBF8EF' },
  VAY:   { bg: '#F5A9D0', fg: '#2B3F6C' },
  REACT: { bg: '#C6E86A', fg: '#2B3F6C' },
  TAS:   { bg: '#DCCFF0', fg: '#2B3F6C' },
};
const STAGE = {
  BUILD:    { fill: '#EFE0F7' }, SHOOT: { fill: '#F8CFA4' }, EDIT: { fill: '#F9C9DC' },
  FEEDBACK: { fill: '#F4E7B0' }, LIVE:  { fill: '#DCEFA6' },
};

// The roster and how each person is paid. One place to edit.
const PEOPLE = [
  { k: 'AL', name: 'Anaïs',  basis: 'owner' },
  { k: 'DM', name: 'Diane',  basis: 'day',   bg: '#F8CFA4' },
  { k: 'AD', name: 'Adam',   basis: 'asset', bg: '#F9C9DC' },
  { k: 'AN', name: 'Anita',  basis: 'day',   bg: '#EFE0F7' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (n) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const HELMET = `<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@500;600;700;800&display=swap">
  <style>
    body { margin: 0; font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif; color: ${T.ink}; }
    a { color: ${T.ink}; } a:hover { color: #1B4FE8; }
    .disp { font-family: 'Archivo Black', 'Helvetica Neue', Arial Black, sans-serif; font-weight: 400; letter-spacing: -0.02em; }
    .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0; border: 3px solid ${T.ink}; background: ${T.ink}; }
    .hd { background: ${T.card}; padding: 12px 10px; text-align: center; font-weight: 800; font-size: 12.5px;
          letter-spacing: 0.12em; text-transform: uppercase; margin: 0 1.5px 1.5px 0; }
    .cell { background: ${T.card}; min-height: 150px; padding: 10px 10px 12px; display: flex; flex-direction: column; gap: 6px; margin: 0 1.5px 1.5px 0; }
    .num { font-family: 'Archivo Black', 'Helvetica Neue', Arial Black, sans-serif; font-size: 17px; }
    .out { color: ${T.out}; }
    .tag { font-weight: 800; font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; border: 2px solid ${T.ink};
           border-radius: 999px; padding: 2px 8px; background: ${T.card}; white-space: nowrap; }
    .pill { display: flex; align-items: center; gap: 6px; border: 2.5px solid ${T.ink}; border-radius: 999px;
            box-shadow: 2px 2px 0 ${T.ink}; padding: 4px 9px 4px 4px; font-weight: 800; font-size: 10.5px;
            letter-spacing: 0.02em; text-transform: uppercase; line-height: 1.15; }
    .prop { border-style: dashed; box-shadow: none; }
    .chip { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 21px; height: 21px;
            border-radius: 999px; border: 2px solid ${T.ink}; background: ${T.card}; color: ${T.ink}; font-weight: 800; font-size: 9px; }
    .note { font-size: 10.5px; font-weight: 700; color: ${T.dim}; line-height: 1.35; }
    .warn { font-size: 10.5px; font-weight: 800; color: #C2410C; line-height: 1.35; }
    .oot { background: repeating-linear-gradient(45deg, ${T.hatch} 0 6px, ${T.hatch2} 6px 12px); }
    .mark { display: flex; align-items: center; gap: 12px; }
    .mark img { height: 34px; width: auto; display: block; }
    .mark span { font-weight: 800; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.dim}; }
    .th { padding: 12px 13px; background: ${T.ink}; color: ${T.ground}; font-size: 10.5px; font-weight: 800; letter-spacing: 0.11em; }
    .td { padding: 12px 13px; background: ${T.card}; border-bottom: 2px solid ${T.hair}; font-size: 13px; font-weight: 700; }
    .n { font-family: 'Archivo Black', sans-serif; font-size: 16px; text-align: center; }
  </style>
</helmet>`;

const wrap = (inner) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
${HELMET}
${inner}
</x-dc>
<script data-dc-script data-props='{}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
`;

const mark = (label) => `  <div class="mark">
    <img src="typea-logo.webp" alt="TYPE-A studios">
    <span>${esc(label)}</span>
  </div>`;

const pill = (t) => {
  const c = CO[t.co];
  const cls = 'pill' + (t.proposed ? ' prop' : '');
  return `      <div class="${cls}" style="background: ${c.bg}; color: ${c.fg};"><span class="chip">${esc(t.who)}</span>${esc(t.text)}</div>`;
};

// ---------------------------------------------------------------- calendars

function monthBoard(m) {
  const cells = [];
  for (const lead of m.lead) cells.push(`    <div class="cell"><span class="num out">${lead}</span></div>`);
  for (let d = 1; d <= m.days; d++) {
    const e = m.cells[d];
    if (!e) { cells.push(`    <div class="cell"><span class="num">${String(d).padStart(2, '0')}</span></div>`); continue; }
    const fill = e.away ? '' : e.stage ? ` style="background: ${STAGE[e.stage].fill};"` : '';
    const head = e.badge
      ? `      <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;"><span class="num">${String(d).padStart(2, '0')}</span><span class="tag"${e.badgeBg ? ` style="background: ${e.badgeBg};"` : ''}>${esc(e.badge)}</span></div>`
      : `      <span class="num">${String(d).padStart(2, '0')}</span>`;
    const body = [
      ...(e.tags || []).map(pill),
      ...(e.notes || []).map((n) => `      <div class="note">${esc(n)}</div>`),
      ...(e.warns || []).map((n) => `      <div class="warn">${esc(n)}</div>`),
    ].join('\n');
    cells.push(`    <div class="cell${e.away ? ' oot' : ''}"${fill}>\n${head}\n${body}\n    </div>`);
  }
  for (const tr of m.trail) cells.push(`    <div class="cell"><span class="num out">${tr}</span></div>`);

  const legend = Object.values(STAGE)
    .map((s) => `<span style="width: 26px; height: 20px; background: ${s.fill}; border: 2.5px solid ${T.ink};"></span>`).join('');
  const colegend = Object.values(CO)
    .map((c) => `<span style="width: 26px; height: 20px; background: ${c.bg}; border: 2.5px solid ${T.ink}; border-radius: 999px;"></span>`).join('');

  return wrap(`<div style="width: 1600px; box-sizing: border-box; background: ${T.ground}; padding: 40px 48px 44px; display: flex; flex-direction: column; gap: 22px;">

  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 30px;">
    <div class="disp" style="font-size: 62px; line-height: 0.95;">${esc(m.title)}</div>
    <div style="display: flex; align-items: center; gap: 18px;">
      <div style="display: flex; align-items: center; gap: 7px;">
        <span style="font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.dim};">Day = stage</span>${legend}
      </div>
      <div style="display: flex; align-items: center; gap: 7px;">
        <span style="font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.dim};">Pill = client</span>${colegend}
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="hd">Sunday</div><div class="hd">Monday</div><div class="hd">Tuesday</div><div class="hd">Wednesday</div><div class="hd">Thursday</div><div class="hd">Friday</div><div class="hd">Saturday</div>
${cells.join('\n')}
  </div>

${mark(m.mark)}

</div>`);
}

// --------------------------------------------------------------- pay sheets

// Distinct days worked per person, from the calendar data itself.
function daysByPerson(m) {
  const out = {};
  for (const [d, e] of Object.entries(m.cells)) {
    for (const t of e.tags || []) (out[t.who] ||= new Set()).add(Number(d));
  }
  return out;
}

// Mon-start weeks that contain at least one day of this month.
function weeksOf(m, byPerson) {
  const weeks = new Map();
  for (let d = 1; d <= m.days; d++) {
    const date = new Date(Date.UTC(m.year, m.month, d));
    const mon = new Date(date);
    mon.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    const key = mon.toISOString().slice(0, 10);
    if (!weeks.has(key)) weeks.set(key, { mon, days: [] });
    weeks.get(key).days.push(d);
  }
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const all = [...weeks.values()].map(({ mon, days }) => ({
    label: 'w/c ' + mon.getUTCDate() + ' ' + MON[mon.getUTCMonth()],
    range: days[0] + '–' + days[days.length - 1] + ' ' + MON[m.month],
    counts: PEOPLE.map((p) => days.filter((d) => byPerson[p.k]?.has(d)).length),
  }));
  // Trim leading and trailing empty weeks; keep empty weeks in the middle,
  // because a quiet week inside the month is worth seeing.
  const busy = (w) => w.counts.some(Boolean);
  let a = all.findIndex(busy);
  let b = all.length - 1 - [...all].reverse().findIndex(busy);
  return a < 0 ? [] : all.slice(a, b + 1);
}

function payBoard(m) {
  const byPerson = daysByPerson(m);
  const weeks = weeksOf(m, byPerson);
  const totals = PEOPLE.map((p) => byPerson[p.k]?.size || 0);

  const headCells = ['WEEK', 'DATES', ...PEOPLE.map((p) => p.name.toUpperCase())]
    .map((h, i) => `      <div class="th"${i > 1 ? ' style="text-align: center;"' : ''}>${esc(h)}</div>`).join('\n');

  const rows = weeks.map((w) => {
    const cs = w.counts.map((n) => `      <div class="td n"${n ? '' : ` style="color: ${T.out};"`}>${n || '—'}</div>`).join('\n');
    return `      <div class="td" style="font-weight: 800;">${esc(w.label)}</div>
      <div class="td" style="color: ${T.dim}; font-weight: 600;">${esc(w.range)}</div>
${cs}`;
  }).join('\n');

  const totalRow = `      <div class="td" style="background: #DCEFA6; border-bottom: none; font-weight: 800;">TOTAL DAYS</div>
      <div class="td" style="background: #DCEFA6; border-bottom: none;"></div>
${totals.map((n) => `      <div class="td n" style="background: #DCEFA6; border-bottom: none;">${n}</div>`).join('\n')}`;

  const owed = PEOPLE.filter((p) => p.basis !== 'owner').map((p) => {
    const days = byPerson[p.k]?.size || 0;
    const rate = m.rates?.[p.k];
    const qty = p.basis === 'asset' ? (m.assets?.[p.k] ?? 0) : days;
    const unit = p.basis === 'asset' ? (qty === 1 ? 'asset' : 'assets') : (qty === 1 ? 'day' : 'days');
    const line = rate ? qty + ' ' + unit + ' × ' + money(rate) : qty + ' ' + unit + ' · no rate agreed';
    return `      <div style="display: flex; align-items: center; gap: 13px; border-bottom: 2px dashed ${T.out}; padding-bottom: 13px;">
        <span style="flex: none; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 999px; border: 2.5px solid ${T.ink}; background: ${p.bg}; font-weight: 800; font-size: 10px;">${p.k}</span>
        <div style="display: flex; flex-direction: column; gap: 2px; flex-grow: 1;">
          <span style="font-size: 14px; font-weight: 800;">${esc(p.name)}</span>
          <span style="font-size: 11.5px; font-weight: 700; color: ${T.dim};">${esc(line)}</span>
        </div>
        <span class="disp" style="font-size: 22px;">${rate ? money(rate * qty) : '—'}</span>
      </div>`;
  }).join('\n');

  return wrap(`<div style="width: 1180px; box-sizing: border-box; background: ${T.ground}; padding: 40px 44px 44px; display: flex; flex-direction: column; gap: 22px;">

  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;">
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <div class="disp" style="font-size: 44px; line-height: 0.95;">${esc(m.title)}</div>
      <div style="font-weight: 800; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.dim};">Pay sheet · ${esc(m.payPeriod)}</div>
    </div>
    <div style="font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.dim}; text-align: right; line-height: 1.6;">
      Invoice by ${esc(m.invoiceBy)}
    </div>
  </div>

  <div style="border: 3px solid ${T.ink}; box-shadow: 6px 6px 0 ${T.ink}; overflow: hidden;">
    <div style="display: grid; grid-template-columns: 150px 140px repeat(${PEOPLE.length}, minmax(0, 1fr));">
${headCells}
${rows}
${totalRow}
    </div>
  </div>

  <div style="background: ${T.card}; border: 3px solid ${T.ink}; box-shadow: 6px 6px 0 ${T.ink}; padding: 22px 24px; display: flex; flex-direction: column; gap: 15px;">
    <div class="disp" style="font-size: 18px;">OWED FOR ${esc(m.title.split(' ')[0])}</div>
${owed}
  </div>

${mark(m.mark)}

</div>`);
}

export { T, CO, STAGE, PEOPLE, esc, money, wrap, mark, pill, monthBoard, payBoard, writeFileSync };
