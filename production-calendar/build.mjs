// Generates the TYPE-A production calendar artboards (.dc.html) from the data model below.
// Re-run after editing DATA:  node build.mjs
import { writeFileSync } from 'node:fs';

const T = {
  ground: '#FBF8EF', card: '#FFFDF7', ink: '#2B3F6C', dim: '#7A87A8',
  gold: '#E9C87F', rule: '#2B3F6C', hatch: '#DAD5C8', hatch2: '#C9C3B4', out: '#BDC6DA',
};
const CO = {
  WPP:   { bg: '#1B4FE8', fg: '#FBF8EF', label: 'OGILVY / WPP' },
  VAY:   { bg: '#F5A9D0', fg: '#2B3F6C', label: 'VAYNER' },
  REACT: { bg: '#C6E86A', fg: '#2B3F6C', label: 'RE:ACT' },
  TAS:   { bg: '#DCCFF0', fg: '#2B3F6C', label: 'TYPE-A DIRECT' },
};
const STAGE = {
  BUILD:    { fill: '#EFE0F7', label: 'BUILD / PRE-PRO' },
  SHOOT:    { fill: '#F8CFA4', label: 'SHOOT' },
  EDIT:     { fill: '#F9C9DC', label: 'EDIT' },
  FEEDBACK: { fill: '#F4E7B0', label: 'FEEDBACK / TO CLIENT' },
  LIVE:     { fill: '#DCEFA6', label: 'LIVE' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const HELMET = `<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@500;600;700;800&display=swap">
  <style>
    body { margin: 0; font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif; color: ${T.ink}; }
    a { color: ${T.ink}; } a:hover { color: #1B4FE8; }
    .disp { font-family: 'Archivo Black', 'Helvetica Neue', Arial Black, sans-serif; font-weight: 400; letter-spacing: -0.02em; }
    .logo { font-family: 'Archivo Black', 'Helvetica Neue', Arial Black, sans-serif; color: ${T.gold};
            -webkit-text-stroke: 3px ${T.ink}; paint-order: stroke fill; text-shadow: 4px 4px 0 ${T.ink}; letter-spacing: -0.02em; }
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
    .dot { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px;
           border-radius: 999px; border: 2px solid ${T.ink}; background: ${T.card}; color: ${T.ink}; font-size: 9px; font-weight: 800; margin-left: auto; }
    .note { font-size: 10.5px; font-weight: 700; color: ${T.dim}; line-height: 1.35; }
    .warn { font-size: 10.5px; font-weight: 800; color: #C2410C; line-height: 1.35; }
    .oot { background: repeating-linear-gradient(45deg, ${T.hatch} 0 6px, ${T.hatch2} 6px 12px); }
    .box { background: ${T.card}; border: 3px solid ${T.ink}; box-shadow: 5px 5px 0 ${T.ink}; }
  </style>
</helmet>`;

const wrap = (inner, props = '{}') => `<!doctype html>
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
<script data-dc-script data-props='${props}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
`;

const pill = (t) => {
  const c = CO[t.co];
  const cls = 'pill' + (t.proposed ? ' prop' : '');
  return `      <div class="${cls}" style="background: ${c.bg}; color: ${c.fg};"><span class="chip">${esc(t.who)}</span>${esc(t.text)}</div>`;
};

function monthBoard(m) {
  const cells = [];
  for (const lead of m.lead) cells.push(`    <div class="cell"><span class="num out">${lead}</span></div>`);
  for (let d = 1; d <= m.days; d++) {
    const e = m.cells[d];
    if (!e) { cells.push(`    <div class="cell"><span class="num">${String(d).padStart(2, '0')}</span></div>`); continue; }
    const fill = e.away ? '' : e.stage ? ` style="background: ${STAGE[e.stage].fill};"` : '';
    const cls = 'cell' + (e.away ? ' oot' : '') + (e.open ? '' : '');
    const head = e.badge
      ? `      <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;"><span class="num">${String(d).padStart(2, '0')}</span><span class="tag"${e.badgeBg ? ` style="background: ${e.badgeBg};"` : ''}>${esc(e.badge)}</span></div>`
      : `      <span class="num">${String(d).padStart(2, '0')}</span>`;
    const body = [
      ...(e.tags || []).map(pill),
      ...(e.notes || []).map((n) => `      <div class="note">${esc(n)}</div>`),
      ...(e.warns || []).map((n) => `      <div class="warn">${esc(n)}</div>`),
    ].join('\n');
    cells.push(`    <div class="${cls}"${fill}>\n${head}\n${body}\n    </div>`);
  }
  for (const tr of m.trail) cells.push(`    <div class="cell"><span class="num out">${tr}</span></div>`);

  const legend = ['BUILD', 'SHOOT', 'EDIT', 'FEEDBACK', 'LIVE']
    .map((k) => `<span style="width: 26px; height: 20px; background: ${STAGE[k].fill}; border: 2.5px solid ${T.ink};"></span>`).join('');
  const colegend = Object.values(CO)
    .map((c) => `<span style="width: 26px; height: 20px; background: ${c.bg}; border: 2.5px solid ${T.ink}; border-radius: 999px;"></span>`).join('');

  const footers = m.footers.map((f) => `    <div style="flex: 1; background: ${f.bg || T.card}; border: 3px ${f.dashed ? 'dashed ' + T.out : 'solid ' + T.ink}; ${f.dashed ? '' : `box-shadow: 5px 5px 0 ${T.ink};`} padding: 18px 22px; display: flex; flex-direction: column; gap: 8px;">
      <div class="disp" style="font-size: 16px;">${esc(f.title)}</div>
      <div style="font-size: 13.5px; line-height: 1.5; font-weight: 500;">${f.body}</div>
    </div>`).join('\n');

  return wrap(`<div style="width: 1600px; box-sizing: border-box; background: ${T.ground}; padding: 44px 48px 48px; display: flex; flex-direction: column; gap: 26px;">

  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 30px;">
    <div class="logo" style="font-size: 62px; line-height: 0.95;">${esc(m.title)}</div>
    <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: flex-end;">
      <span class="tag" style="font-size: 11.5px; padding: 5px 12px; background: ${m.flagBg || T.card};">${esc(m.flag)}</span>
      <div style="display: flex; align-items: center; gap: 7px;">
        <span style="font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.dim};">Day = stage</span>${legend}
      </div>
      <div style="display: flex; align-items: center; gap: 7px;">
        <span style="font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.dim};">Pill = company</span>${colegend}
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="hd">Sunday</div><div class="hd">Monday</div><div class="hd">Tuesday</div><div class="hd">Wednesday</div><div class="hd">Thursday</div><div class="hd">Friday</div><div class="hd">Saturday</div>
${cells.join('\n')}
  </div>

  <div style="display: flex; gap: 16px; align-items: stretch;">
${footers}
  </div>

</div>`);
}

export { T, CO, STAGE, esc, wrap, pill, monthBoard };
