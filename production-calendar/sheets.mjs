import { T, CO, esc, wrap } from './build.mjs';
import { writeFileSync } from 'node:fs';

// Deliberately slim: one date column, not five. The calendars carry the detail;
// this is the list you scan to see what exists and who has it.
const ROWS = [
  ['h', 'RE:ACT · BOOST IRELAND'],
  ['r', 'EP Bag Check', 'REACT', 'DM', 'Stories + carousel', 'Live 28 Aug', 'wip'],
  ['r', 'Red Card Holiday Rules', 'REACT', 'DM', '9:16 Reel · vox pop', 'Shoot 22 Aug · V1 24 Aug', 'todo'],
  ['r', 'Explain Hurling in 10 Seconds', 'REACT', 'AL', '9:16 Reel · OSG', 'Shoot 11 Sep · edits 16 Sep', 'todo'],
  ['r', 'Matchday Rituals', 'REACT', 'AL', '9:16 Reel · OSG', 'Shoot 11 Sep · edits 16 Sep', 'todo'],
  ['r', 'First Week Promises', 'REACT', 'AL', '9:16 Reel · OSG', 'Shoot 12 Sep · edits 16 Sep', 'todo'],
  ['r', 'Reactive · 2 slots a month', 'REACT', 'DM', 'TikTok / Reel', 'Filled in the week of posting', 'held'],

  ['h', 'OGILVY / WPP · GOOGLE PIXEL 11 — in flight, clear before 4 Sep'],
  ['r', 'Yes, But (Pro Zoom)', 'WPP', 'AL', '9:16 Reel', 'With client since 12 Aug', 'wip'],
  ['r', 'Bandana Looks', 'WPP', 'AL', 'Stills + carousel', 'Awaiting client feedback', 'wip'],
  ['r', 'Lineage', 'WPP', 'AL', '12 second build', 'Blocked on Joe', 'wip'],
  ['r', 'Flood the Feed · IMA sizzle', 'WPP', 'AL', '10 second, 3:2', 'Two questions open since 28 Jul', 'todo'],
  ['r', 'Foraging', 'WPP', 'AL', 'TBC on the day', 'Shoot 26 Aug', 'todo'],

  ['h', 'OGILVY / WPP · GOOGLE PIXEL 11 — approved, still to make'],
  ['r', '40 Feet Away', 'WPP', 'AN', '15" / 12" · Pro Zoom', 'Build 25 Aug · shoot 10 Sep', 'todo'],
  ['r', 'Where the Sun Goes', 'WPP', 'DM', '30" / 20" · Gemini', 'Recce 9 Sep · shoot 10 Sep', 'todo'],
  ["r", "What's in My Bag", 'WPP', 'AN', '30" / 20" · colourways', 'Build 3 Sep', 'todo'],
  ['r', 'Dressed to the Elevens', 'WPP', 'AN', '30" / 20" · colourways', 'Build 9 Sep', 'todo'],
  ['r', 'Made in the Details', 'WPP', 'AL', '30" / 20" · ASMR atelier', 'Shoot 3 Oct · live 10 Oct', 'todo'],
  ['r', '+ 8 more approved ideas', 'WPP', '??', 'Pixel Perfect Weekend · Look It Up · Little Things · Palette · London in Looks · Park · Two Pieces · Five Days', 'No dates, no owner', 'unplanned'],

  ['h', 'VAYNER · INDEED'],
  ['r', 'JNP FR messaging · 8 pages', 'VAY', 'AL', 'Bilingual deck pages', 'Review 19 Aug 14:30', 'wip'],
  ['r', 'June sprint exports', 'VAY', 'AL', '1×1 + 9×16 to Rossella', 'No date set', 'todo'],
  ['r', 'Growth creative kickoff', 'VAY', 'AL', 'Meeting', 'Time TBC', 'held'],

  ['h', 'TYPE-A DIRECT · HALIMA'],
  ['r', 'Business cards', 'TAS', 'AL', 'Two designs, one to artwork', 'Designs 24 Aug · files 27 Aug', 'todo'],
  ['r', 'Website · English', 'TAS', 'AL', 'Five pages, phone first', 'Design 8 Sep · live w/c 5 Oct', 'todo'],
  ['r', 'LinkedIn', 'TAS', 'AL', '4 posts a month + inbox', 'Monthly from launch', 'todo'],
  ['r', 'Website · French', 'TAS', 'AL', 'Five pages', 'October', 'todo'],
];

const HEADS = ['ASSET', 'OWNER', 'FORMAT', 'KEY DATES', ''];
const COLS = '400px 90px 440px 400px 120px';

const badge = (s) => {
  const m = { wip: ['IN PROGRESS', '#F4E7B0'], todo: ['TO DO', '#FFFDF7'], held: ['HELD', '#DCCFF0'],
              done: ['DONE', '#DCEFA6'], unplanned: ['UNPLANNED', '#F8CFA4'] }[s];
  return `<span style="display: inline-block; border: 2px solid ${T.ink}; border-radius: 999px; padding: 3px 10px; background: ${m[1]}; font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; white-space: nowrap;">${m[0]}</span>`;
};

const cellCss = `padding: 12px 13px; font-size: 12.5px; font-weight: 600; line-height: 1.35; background: ${T.card}; border-bottom: 2px solid #E4E0D3;`;

let body = '';
for (const row of ROWS) {
  if (row[0] === 'h') {
    body += `      <div style="grid-column: 1 / -1; padding: 14px 13px 9px; background: ${T.ground}; border-bottom: 3px solid ${T.ink}; border-top: 3px solid ${T.ink}; font-family: 'Archivo Black', sans-serif; font-size: 13px;">${esc(row[1])}</div>\n`;
    continue;
  }
  const [, asset, co, who, fmt, dates, status] = row;
  const c = CO[co];
  body += `      <div style="${cellCss} display: flex; align-items: center; gap: 9px;"><span style="flex: none; width: 13px; height: 13px; border-radius: 999px; border: 2px solid ${T.ink}; background: ${c.bg};"></span><span style="font-weight: 800;">${esc(asset)}</span></div>
      <div style="${cellCss}"><span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 999px; border: 2px solid ${T.ink}; background: ${T.ground}; font-size: 10px; font-weight: 800;">${esc(who)}</span></div>
      <div style="${cellCss} color: ${T.dim};">${esc(fmt)}</div>
      <div style="${cellCss}">${esc(dates)}</div>
      <div style="${cellCss}">${badge(status)}</div>\n`;
}

const tracker = wrap(`<div style="width: 1520px; box-sizing: border-box; background: ${T.ground}; padding: 44px 44px 48px; display: flex; flex-direction: column; gap: 24px;">
  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 30px;">
    <div style="font-family: 'Archivo Black', sans-serif; font-size: 54px; line-height: 0.95; color: ${T.gold}; -webkit-text-stroke: 3.5px ${T.ink}; paint-order: stroke fill; text-shadow: 5px 5px 0 ${T.ink};">WHAT EXISTS</div>
    <div style="font-size: 13px; font-weight: 700; color: ${T.dim}; max-width: 380px; text-align: right; line-height: 1.5;">
      One line per deliverable, one date column. The months carry the detail — this is the list you scan.
    </div>
  </div>

  <div style="border: 3px solid ${T.ink}; box-shadow: 6px 6px 0 ${T.ink}; overflow: hidden;">
    <div style="display: grid; grid-template-columns: ${COLS};">
${HEADS.map((h) => `      <div style="padding: 13px 13px; background: ${T.ink}; color: ${T.ground}; font-size: 10.5px; font-weight: 800; letter-spacing: 0.11em;">${h}</div>`).join('\n')}
${body}    </div>
  </div>

  <div style="background: #F8CFA4; border: 3px solid ${T.ink}; box-shadow: 5px 5px 0 ${T.ink}; padding: 18px 22px;">
    <div style="font-family: 'Archivo Black', sans-serif; font-size: 15px; margin-bottom: 7px;">THE UNPLANNED ROW IS THE DECISION</div>
    <div style="font-size: 13px; line-height: 1.5; font-weight: 500;">Eight approved Pixel ideas have no date and no owner. They either get picked up in October, or you tell Rae the slate is five, not thirteen.</div>
  </div>
</div>`);

writeFileSync(new URL('./Tracker.dc.html', import.meta.url), tracker);
console.log('wrote Tracker');
