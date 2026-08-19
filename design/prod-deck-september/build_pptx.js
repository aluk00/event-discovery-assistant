// Build the PowerPoint from deck.json, which gen.py writes off the same ASSETS
// list as the artboards. Geometry mirrors the artboards: they are 1440x810 px,
// which is exactly 10 x 5.625in at 144dpi, so px/144 = inches and px/2 = points.
const pptxgen = require('pptxgenjs');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('deck.json', 'utf8'));
const C = Object.fromEntries(Object.entries(data.palette).map(([k, v]) => [k, v.slice(1)]));
const WHITE = 'FFFFFF';

const DISPLAY = 'Archivo Black';
const BODY = 'Space Grotesk';

const IN = (px) => px / 144;
const PT = (px) => px / 2;

const MARGIN = 64, CONTENT = 1312, SLIDE_H = 810;
const HEAD_H = 41, RULE_H = 3, GAP = 22;

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';          // 10 x 5.625in, matching the existing deck
pres.defineSlideMaster({ title: 'PAPER', background: { color: C.paper } });

const border = (color) => [
  { pt: 1, color }, { pt: 1, color }, { pt: 1, color }, { pt: 1, color },
];

function head(cells) {
  return cells.map((t) => ({
    text: t,
    options: {
      fill: C.ink, color: WHITE, fontFace: DISPLAY, fontSize: PT(12.8),
      align: 'center', valign: 'middle', border: border(C.ink), margin: 2,
    },
  }));
}

// Two stacked lines in one cell: a bold primary over a lighter secondary.
function stacked(top, bottom, opts = {}) {
  const runs = [{ text: top, options: { fontFace: DISPLAY, fontSize: PT(15.2), color: C.ink } }];
  if (bottom) {
    runs[0].options.breakLine = true;
    runs.push({ text: bottom, options: { fontFace: BODY, fontSize: PT(14), color: C.muted } });
  }
  return { text: runs, options: { valign: 'middle', border: border(C.ink), margin: 4, ...opts } };
}

function body(text, opts = {}) {
  return {
    text,
    options: {
      fontFace: BODY, fontSize: PT(14), color: C.ink, valign: 'middle',
      border: border(C.ink), margin: 4, ...opts,
    },
  };
}

function strong(text, opts = {}) {
  return {
    text,
    options: {
      fontFace: DISPLAY, fontSize: PT(15.2), color: C.ink, valign: 'middle',
      border: border(C.ink), margin: 4, ...opts,
    },
  };
}

function cost(text, opts = {}) {
  return {
    text,
    options: {
      fontFace: DISPLAY, fontSize: PT(17), color: text.startsWith('£') ? C.ink : C.hairline,
      align: 'right', valign: 'middle', border: border(C.ink), margin: 4, ...opts,
    },
  };
}

// Title, accent dot and the rule under them. Returns the y the next block starts at.
function header(slide, text, size) {
  slide.addText(text, {
    x: IN(MARGIN), y: IN(48), w: IN(CONTENT - 40), h: IN(size),
    fontFace: DISPLAY, fontSize: PT(size), color: C.ink, valign: 'middle', margin: 0,
  });
  const dotX = MARGIN + text.length * size * 0.52 + 16;
  slide.addShape(pres.ShapeType.ellipse, {
    x: IN(Math.min(dotX, MARGIN + CONTENT - 30)), y: IN(48 + size / 2 - 13),
    w: IN(26), h: IN(26), fill: { color: C.accent },
  });
  const ruleY = 48 + size + GAP;
  slide.addShape(pres.ShapeType.rect, {
    x: IN(MARGIN), y: IN(ruleY), w: IN(CONTENT), h: IN(RULE_H), fill: { color: C.ink },
  });
  return ruleY + RULE_H + GAP;
}

function footer(slide, stamp) {
  slide.addText('re:act', {
    x: IN(MARGIN), y: IN(SLIDE_H - 48), w: IN(200), h: IN(24),
    fontFace: DISPLAY, fontSize: PT(20), color: C.ink, valign: 'middle', margin: 0,
  });
  slide.addText(stamp, {
    x: IN(MARGIN + CONTENT - 500), y: IN(SLIDE_H - 48), w: IN(500), h: IN(24),
    fontFace: BODY, fontSize: PT(14), bold: true, color: C.muted,
    align: 'right', valign: 'middle', margin: 0,
  });
}

function table(slide, y, columns, rows, rowH) {
  slide.addTable(rows, {
    x: IN(MARGIN), y: IN(y), w: IN(CONTENT),
    colW: columns.map((c) => IN(c[1])),
    rowH: [IN(HEAD_H), ...Array(rows.length - 1).fill(IN(rowH))],
    border: border(C.ink), autoPage: false,
  });
  return y + HEAD_H + (rows.length - 1) * rowH;
}

// The black totals strip: one block per figure, laid out across the content width.
function band(slide, y, blocks) {
  const H = 54;
  slide.addShape(pres.ShapeType.rect, {
    x: IN(MARGIN), y: IN(y), w: IN(CONTENT), h: IN(H), fill: { color: C.ink },
  });
  const w = CONTENT / blocks.length;
  blocks.forEach(([label, value, sub], i) => {
    const x = MARGIN + i * w;
    slide.addText(
      [{ text: `${label}   `, options: { fontFace: DISPLAY, fontSize: PT(12), color: C.hairline } },
       { text: value, options: { fontFace: DISPLAY, fontSize: PT(22), color: i === 2 ? C.shoot : WHITE } }],
      { x: IN(x + 18), y: IN(y + 8), w: IN(w - 24), h: IN(24), valign: 'middle', margin: 0 },
    );
    slide.addText(sub, {
      x: IN(x + 18), y: IN(y + 32), w: IN(w - 24), h: IN(14),
      fontFace: BODY, fontSize: PT(11), bold: true, color: C.hairline, valign: 'middle', margin: 0,
    });
  });
}

for (const s of data.slides) {
  const slide = pres.addSlide({ masterName: 'PAPER' });

  if (s.kind === 'deliverables') {
    const y = header(slide, s.title, 58);
    const rows = [head(s.columns.map((c) => c[0]))];
    for (const r of s.rows) {
      rows.push([
        stacked(r.name, r.status),
        body(r.fmt),
        stacked(r.shoot, r.location),
        strong(r.edit),
        strong(r.v1),
        strong(r.crew, { fill: r.crew_fill.slice(1), align: 'center' }),
      ]);
    }
    table(slide, y, s.columns, rows, 80);
  } else if (s.kind === 'total') {
    const y = header(slide, s.title, 58);
    const rows = [head(s.columns.map((c) => c[0]))];
    for (const r of s.rows) {
      rows.push([strong(r.line), body(r.basis), body(r.units, { color: C.muted }), cost(r.cost)]);
    }
    band(slide, table(slide, y, s.columns, rows, 48), s.band);
  } else {
    const y = header(slide, s.title, 42);
    const [fmt, shoot, location, edit, v1] = s.facts;
    const factCols = [['FORMAT', 380], ['SHOOT', 400], ['EDIT', 280], ['V1 DUE', 252]];
    const factY = table(slide, y, factCols, [
      head(factCols.map((c) => c[0])),
      [body(fmt), stacked(shoot, location), strong(edit), strong(v1)],
    ], 62);

    const cols = [['LINE', 340], ['BASIS', 712], ['COST', 260]];
    const rows = [head(cols.map((c) => c[0]))];
    for (const r of s.rows) rows.push([strong(r.line), body(r.basis), cost(r.cost)]);
    band(slide, table(slide, factY + GAP, cols, rows, 48), s.band);
  }

  footer(slide, s.stamp);
}

pres.writeFile({ fileName: 'boost-ireland-spend.pptx' }).then((f) => console.log('wrote', f));
