// Builds the Google Slides deck from the SAME month data as the canvas boards.
// node deck.mjs  ->  TYPE-A-Production-Calendar.pptx
import pptxgen from 'pptxgenjs';
import { readFileSync } from 'node:fs';
import { august, september, october } from './months.mjs';
import { PEOPLE } from './build.mjs';

const INK = '2B3F6C', GROUND = 'FBF8EF', CARD = 'FFFDF7', DIM = '7A87A8', OUT = 'BDC6DA';
const CO = { WPP: '1B4FE8', VAY: 'F5A9D0', REACT: 'C6E86A', TAS: 'DCCFF0' };
const CO_FG = { WPP: 'FBF8EF', VAY: INK, REACT: INK, TAS: INK };
const STAGE = { BUILD: 'EFE0F7', SHOOT: 'F8CFA4', EDIT: 'F9C9DC', FEEDBACK: 'F4E7B0', LIVE: 'DCEFA6' };
const AWAY = 'DAD5C8';
const DISPLAY = 'Arial Black', BODY = 'Arial';

const LOGO_BIG = 'image/png;base64,' + readFileSync('typea-logo-big.png').toString('base64');
const LOGO = 'image/png;base64,' + readFileSync('typea-logo-small.png').toString('base64');

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';            // 13.3 x 7.5
pres.author = 'TYPE-A STUDIO LTD';
pres.title = 'TYPE-A Production Calendar';

const W = 13.3, H = 7.5, M = 0.42;

function logoMark(slide, label) {
  slide.addImage({ data: LOGO, x: M, y: H - 0.62, w: 0.72, h: 0.385 });
  slide.addText(label, { x: M + 0.84, y: H - 0.6, w: 5, h: 0.34, fontFace: BODY, fontSize: 8,
    bold: true, charSpacing: 1.4, color: DIM, valign: 'middle', margin: 0 });
}

function base(bg) {
  const s = pres.addSlide();
  s.background = { color: bg || GROUND };
  return s;
}

// ------------------------------------------------------------------- title
{
  const s = base(INK);
  s.addImage({ data: LOGO_BIG, x: (W - 3.9) / 2, y: 1.75, w: 3.9, h: 2.085 });
  s.addText('PRODUCTION CALENDAR', { x: 0, y: 4.15, w: W, h: 0.75, align: 'center',
    fontFace: DISPLAY, fontSize: 40, color: GROUND, charSpacing: -0.5 });
  s.addText('AUGUST — OCTOBER 2026', { x: 0, y: 4.95, w: W, h: 0.4, align: 'center',
    fontFace: BODY, fontSize: 13, bold: true, charSpacing: 3, color: 'E9C87F' });
}

// ---------------------------------------------------------------- calendars
const DOW = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function calendarSlide(m) {
  const s = base();
  s.addText(m.title, { x: M, y: 0.3, w: 6, h: 0.62, fontFace: DISPLAY, fontSize: 30, color: INK, margin: 0, valign: 'middle' });

  let lx = W - M - 0.34 * 5;
  s.addText('DAY = STAGE', { x: lx - 1.5, y: 0.42, w: 1.45, h: 0.28, align: 'right', fontFace: BODY,
    fontSize: 7, bold: true, charSpacing: 1, color: DIM, margin: 0, valign: 'middle' });
  for (const k of Object.keys(STAGE)) {
    s.addShape(pres.ShapeType.rect, { x: lx, y: 0.45, w: 0.3, h: 0.22, fill: { color: STAGE[k] }, line: { color: INK, width: 1.25 } });
    s.addText(k[0], { x: lx, y: 0.45, w: 0.3, h: 0.22, align: 'center', valign: 'middle', fontFace: BODY, fontSize: 6, bold: true, color: INK, margin: 0 });
    lx += 0.34;
  }
  let cx = W - M - 0.34 * 4;
  s.addText('■ = CLIENT', { x: cx - 1.5, y: 0.74, w: 1.45, h: 0.28, align: 'right', fontFace: BODY,
    fontSize: 7, bold: true, charSpacing: 1, color: DIM, margin: 0, valign: 'middle' });
  for (const [k, col] of Object.entries(CO)) {
    s.addShape(pres.ShapeType.roundRect, { x: cx, y: 0.77, w: 0.3, h: 0.22, rectRadius: 0.11,
      fill: { color: col }, line: { color: INK, width: 1.25 } });
    cx += 0.34;
  }

  const seq = [
    ...m.lead.map((d) => ({ n: d, dim: true })),
    ...Array.from({ length: m.days }, (_, i) => ({ n: i + 1, e: m.cells[i + 1] })),
    ...m.trail.map((d) => ({ n: d, dim: true })),
  ];

  const rows = [DOW.map((d) => ({ text: d, options: { bold: true, color: INK, fill: { color: CARD }, align: 'center', fontSize: 7, charSpacing: 1 } }))];
  for (let r = 0; r * 7 < seq.length; r++) {
    rows.push(seq.slice(r * 7, r * 7 + 7).map((cd) => {
      const e = cd.e;
      const fill = e?.away ? AWAY : e?.stage ? STAGE[e.stage] : CARD;
      const runs = [{ text: String(cd.n).padStart(2, '0'),
        options: { bold: true, fontSize: 9, color: cd.dim ? OUT : INK, breakLine: true } }];
      if (e?.badge) runs.push({ text: e.badge, options: { fontSize: 5.5, bold: true, color: INK, breakLine: true } });
      for (const t of (e?.tags || [])) {
        runs.push({ text: '\u25A0 ', options: { fontSize: 6, color: CO[t.co] } });
        runs.push({ text: t.who + ' ', options: { fontSize: 6, bold: true, color: INK } });
        runs.push({ text: t.text, options: { fontSize: 6, color: INK, breakLine: true, italic: !!t.proposed } });
      }
      const foot = [...(e?.warns || []), ...(e?.notes || [])][0];
      if (foot) runs.push({ text: foot, options: { fontSize: 5.5, bold: true, color: e?.warns?.length ? 'C2410C' : DIM, breakLine: true } });
      return { text: runs, options: { fill: { color: fill }, valign: 'top' } };
    }));
  }

  const nRows = rows.length - 1;
  const gy = 1.22, gh = H - gy - 0.72;
  s.addTable(rows, { x: M, y: gy, w: W - 2 * M, colW: Array(7).fill((W - 2 * M) / 7),
    rowH: [0.2, ...Array(nRows).fill((gh - 0.2) / nRows)],
    fontFace: BODY, color: INK, border: { type: 'solid', color: INK, pt: 1 }, margin: 3, autoPage: false });

  logoMark(s, m.mark);
}

// --------------------------------------------------------------- pay sheets
function daysByPerson(m) {
  const out = {};
  for (const [d, e] of Object.entries(m.cells)) for (const t of e.tags || []) (out[t.who] ||= new Set()).add(Number(d));
  return out;
}
const MONN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
  const all = [...weeks.values()].map(({ mon, days }) => ({
    label: 'w/c ' + mon.getUTCDate() + ' ' + MONN[mon.getUTCMonth()],
    range: days[0] + '–' + days[days.length - 1] + ' ' + MONN[m.month],
    counts: PEOPLE.map((p) => days.filter((d) => byPerson[p.k]?.has(d)).length),
  }));
  const busy = (w) => w.counts.some(Boolean);
  const a = all.findIndex(busy);
  const b = all.length - 1 - [...all].reverse().findIndex(busy);
  return a < 0 ? [] : all.slice(a, b + 1);
}
const money = (n) => '£' + n.toLocaleString('en-GB');

function paySlide(m) {
  const s = base();
  const byPerson = daysByPerson(m);
  const weeks = weeksOf(m, byPerson);

  s.addText(m.title.split(' ')[0] + ' PAY SHEET', { x: M, y: 0.32, w: 8, h: 0.55,
    fontFace: DISPLAY, fontSize: 26, color: INK, margin: 0, valign: 'middle' });
  s.addText(m.payPeriod.toUpperCase(), { x: M, y: 0.88, w: 8, h: 0.28, fontFace: BODY,
    fontSize: 9, bold: true, charSpacing: 2, color: DIM, margin: 0, valign: 'middle' });
  s.addText('INVOICE BY ' + m.invoiceBy.toUpperCase(), { x: W - M - 4, y: 0.5, w: 4, h: 0.32,
    align: 'right', fontFace: BODY, fontSize: 9, bold: true, charSpacing: 1.6, color: DIM, margin: 0, valign: 'middle' });

  const head = [{ text: 'WEEK' }, { text: 'DATES' }, ...PEOPLE.map((p) => ({ text: p.name.toUpperCase(), options: { align: 'center' } }))];
  const body = weeks.map((w) => [
    { text: w.label, options: { bold: true } },
    { text: w.range, options: { color: DIM } },
    ...w.counts.map((n) => ({ text: n ? String(n) : '—', options: { align: 'center', bold: true, color: n ? INK : OUT } })),
  ]);
  const totals = PEOPLE.map((p) => byPerson[p.k]?.size || 0);
  body.push([
    { text: 'TOTAL DAYS', options: { bold: true, fill: { color: 'DCEFA6' } } },
    { text: '', options: { fill: { color: 'DCEFA6' } } },
    ...totals.map((n) => ({ text: String(n), options: { align: 'center', bold: true, fill: { color: 'DCEFA6' } } })),
  ]);

  s.addTable([head.map((h) => ({ ...h, options: { ...(h.options || {}), bold: true, color: GROUND, fill: { color: INK } } })), ...body], {
    x: M, y: 1.32, w: 7.5, colW: [1.5, 1.5, 1.125, 1.125, 1.125, 1.125],
    fontFace: BODY, fontSize: 10, color: INK, fill: { color: CARD },
    border: { type: 'solid', color: 'E4E0D3', pt: 1 }, rowH: 0.34, valign: 'middle',
  });

  // owed
  const ox = M + 7.9, ow = W - M - ox;
  s.addText('OWED', { x: ox, y: 1.32, w: ow, h: 0.34, fontFace: DISPLAY, fontSize: 15, color: INK, margin: 0, valign: 'middle' });
  let oy = 1.78;
  for (const p of PEOPLE.filter((x) => x.basis !== 'owner')) {
    const days = byPerson[p.k]?.size || 0;
    const rate = m.rates?.[p.k];
    const qty = p.basis === 'asset' ? (m.assets?.[p.k] ?? 0) : days;
    const unit = p.basis === 'asset' ? (qty === 1 ? 'asset' : 'assets') : (qty === 1 ? 'day' : 'days');
    s.addShape(pres.ShapeType.rect, { x: ox, y: oy, w: ow, h: 0.78, fill: { color: CARD }, line: { color: INK, width: 1.75 } });
    s.addShape(pres.ShapeType.ellipse, { x: ox + 0.16, y: oy + 0.22, w: 0.34, h: 0.34, fill: { color: p.bg }, line: { color: INK, width: 1.75 } });
    s.addText(p.k, { x: ox + 0.16, y: oy + 0.22, w: 0.34, h: 0.34, align: 'center', valign: 'middle',
      fontFace: BODY, fontSize: 7, bold: true, color: INK, margin: 0 });
    s.addText(p.name, { x: ox + 0.6, y: oy + 0.14, w: 1.8, h: 0.26, fontFace: BODY, fontSize: 11, bold: true, color: INK, margin: 0, valign: 'middle' });
    s.addText(rate ? qty + ' ' + unit + ' × ' + money(rate) : qty + ' ' + unit + ' · no rate agreed',
      { x: ox + 0.6, y: oy + 0.4, w: 2.2, h: 0.24, fontFace: BODY, fontSize: 8, bold: true, color: DIM, margin: 0, valign: 'middle' });
    s.addText(rate ? money(rate * qty) : '—', { x: ox + ow - 1.5, y: oy + 0.2, w: 1.34, h: 0.38, align: 'right',
      fontFace: DISPLAY, fontSize: 16, color: INK, margin: 0, valign: 'middle' });
    oy += 0.94;
  }

  logoMark(s, m.mark);
}

// -------------------------------------------------------------- deliverables
const TRACKER = [
  ['h', 'RE:ACT · BOOST IRELAND'],
  ['EP Bag Check', 'REACT', 'DM', 'Stories + carousel', 'Live 28 Aug'],
  ['Red Card Holiday Rules', 'REACT', 'DM', '9:16 Reel · vox pop', 'Shoot 22 Aug · V1 24 Aug'],
  ['Explain Hurling in 10 Seconds', 'REACT', 'AL', '9:16 Reel · OSG', 'Shoot 11 Sep · edits 16 Sep'],
  ['Matchday Rituals', 'REACT', 'AL', '9:16 Reel · OSG', 'Shoot 11 Sep · edits 16 Sep'],
  ['First Week Promises', 'REACT', 'AL', '9:16 Reel · OSG', 'Shoot 12 Sep · edits 16 Sep'],
  ['Reactive · 2 slots a month', 'REACT', 'DM', 'TikTok / Reel', 'Week of posting'],
  ['h', 'OGILVY / WPP · GOOGLE PIXEL 11 — in flight'],
  ['Yes, But (Pro Zoom)', 'WPP', 'AL', '9:16 Reel', 'With client since 12 Aug'],
  ['Bandana Looks', 'WPP', 'AL', 'Stills + carousel', 'Awaiting client feedback'],
  ['Lineage', 'WPP', 'AL', '12 second build', 'Blocked on Joe'],
  ['Flood the Feed · IMA sizzle', 'WPP', 'AL', '10 second, 3:2', 'Two questions open'],
  ['Foraging', 'WPP', 'AL', 'TBC on the day', 'Shoot 26 Aug'],
];
const TRACKER2 = [
  ['h', 'OGILVY / WPP · GOOGLE PIXEL 11 — approved, still to make'],
  ['40 Feet Away', 'WPP', 'AN', '15" / 12" · Pro Zoom', 'Build 25 Aug · shoot 9 Sep'],
  ['Where the Sun Goes', 'WPP', 'DM', '30" / 20" · Gemini', 'Shoot 9 Sep'],
  ["What's in My Bag", 'WPP', 'AN', '30" / 20" · colourways', 'Build 3 Sep'],
  ['Dressed to the Elevens', 'WPP', 'AN', '30" / 20" · colourways', 'Build 9 Sep'],
  ['Made in the Details', 'WPP', 'AL', '30" / 20" · ASMR atelier', 'Shoot 3 Oct · live 10 Oct'],
  ['+ 8 more approved ideas', 'WPP', '??', 'No owner, no dates', 'Unplanned'],
  ['h', 'VAYNER · INDEED'],
  ['JNP FR messaging · 8 pages', 'VAY', 'AL', 'Bilingual deck pages', 'Review 19 Aug 14:30'],
  ['June sprint exports', 'VAY', 'AL', '1×1 + 9×16 to Rossella', 'No date set'],
  ['Growth creative kickoff', 'VAY', 'AL', 'Meeting', 'Time TBC'],
  ['h', 'TYPE-A DIRECT · HALIMA'],
  ['Business cards', 'TAS', 'AL', 'Two designs, one to artwork', 'Designs 24 Aug · files 27 Aug'],
  ['Website · English', 'TAS', 'AL', 'Five pages, phone first', 'Design 8 Sep · live w/c 5 Oct'],
  ['LinkedIn', 'TAS', 'AL', '4 posts a month + inbox', 'Monthly from launch'],
  ['Website · French', 'TAS', 'AL', 'Five pages', 'October'],
];

function trackerSlide(rows, title, mark) {
  const s = base();
  s.addText(title, { x: M, y: 0.32, w: 9, h: 0.55, fontFace: DISPLAY, fontSize: 26, color: INK, margin: 0, valign: 'middle' });

  const table = [[
    { text: 'ASSET', options: { bold: true, color: GROUND, fill: { color: INK } } },
    { text: 'OWNER', options: { bold: true, color: GROUND, fill: { color: INK }, align: 'center' } },
    { text: 'FORMAT', options: { bold: true, color: GROUND, fill: { color: INK } } },
    { text: 'KEY DATES', options: { bold: true, color: GROUND, fill: { color: INK } } },
  ]];
  for (const r of rows) {
    if (r[0] === 'h') {
      table.push([{ text: r[1], options: { colspan: 4, bold: true, fontSize: 9, color: INK, fill: { color: GROUND } } }]);
      continue;
    }
    const [asset, co, who, fmt, dates] = r;
    table.push([
      { text: asset, options: { bold: true, fill: { color: CO[co] === undefined ? CARD : CARD } } },
      { text: who, options: { align: 'center', bold: true, fill: { color: CO[co] } } },
      { text: fmt, options: { color: DIM } },
      { text: dates },
    ]);
  }
  s.addTable(table, { x: M, y: 1.15, w: W - 2 * M, colW: [3.6, 0.85, 4.0, 3.99],
    fontFace: BODY, fontSize: 9, color: INK, fill: { color: CARD },
    border: { type: 'solid', color: 'E4E0D3', pt: 1 }, rowH: 0.28, valign: 'middle' });

  logoMark(s, mark);
}

for (const m of [august, september, october]) { calendarSlide(m); paySlide(m); }
trackerSlide(TRACKER, 'WHAT EXISTS · 1', 'Deliverables · Aug – Oct 26');
trackerSlide(TRACKER2, 'WHAT EXISTS · 2', 'Deliverables · Aug – Oct 26');

await pres.writeFile({ fileName: 'TYPE-A-Production-Calendar.pptx', compression: true });
console.log('wrote TYPE-A-Production-Calendar.pptx');
