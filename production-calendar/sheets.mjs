import { T, CO, esc, wrap } from './build.mjs';
import { writeFileSync } from 'node:fs';

const ROWS = [
  ['h', 'RE:ACT · BOOST IRELAND — dates already agreed with the client'],
  ['r', 'EP Bag Check', 'REACT', 'F2', 'Stories + saveable carousel', '18 Aug', '—', '19 Aug', '20–23 Aug', '28 Aug', 'wip'],
  ['r', 'Red Card Holiday Rules', 'REACT', 'F2', '9:16 Reel · vox pop', 'TBC', '22 Aug', '24 Aug', '24–28 Aug', 'TBC', 'todo'],
  ['r', 'Explain Hurling in 10 Seconds', 'REACT', 'AL', '9:16 Reel · OSG · board', '31 Aug', '11 Sep 18:45', '16 Sep', '17–20 Sep', 'TBC', 'todo'],
  ['r', 'Matchday Rituals', 'REACT', 'AL', '9:16 Reel · OSG · board', '31 Aug', '11 Sep 18:45', '16 Sep', '17–20 Sep', 'TBC', 'todo'],
  ['r', 'First Week Promises', 'REACT', 'AL', '9:16 Reel · OSG · board', '1 Sep', '12 Sep · UCC', '16 Sep', '17–20 Sep', 'TBC', 'todo'],
  ['r', 'Reactive · 2 slots a month', 'REACT', 'F2', 'TikTok / Reel', 'week of posting', '—', '—', '—', 'monthly', 'held'],

  ['h', 'OGILVY / WPP · GOOGLE PIXEL 11 — in flight, must clear before 4 Sep'],
  ['r', 'Yes, But (Pro Zoom)', 'WPP', 'AL', '9:16 Reel', 'done', '9 Aug', '12 Aug', 'in review', 'TBC', 'wip'],
  ['r', 'Bandana Looks', 'WPP', 'AL', 'Stills + carousel', 'done', '5 Aug', 'sent', 'awaiting client', 'TBC', 'wip'],
  ['r', 'Lineage', 'WPP', 'AL', '12 second build', 'part built', '—', 'mock to Joe', 'blocked on Joe', 'TBC', 'wip'],
  ['r', 'Flood the Feed · IMA sizzle', 'WPP', 'AL', '10 second, 3:2', '—', '—', '—', '2 questions open', 'IMA', 'todo'],
  ['r', 'Foraging shoot', 'WPP', 'AL', 'TBC on the day', '—', '26 Aug', '27 Aug', 'TBC', 'TBC', 'todo'],

  ['h', 'OGILVY / WPP · GOOGLE PIXEL 11 — approved in the Quick Wins deck, still to make'],
  ['r', '40 Feet Away', 'WPP', 'F3', '15" / 12" · Pro Zoom', '25 Aug', '10 Sep', '—', '—', '—', 'todo'],
  ['r', 'Where the Sun Goes', 'WPP', 'F2', '30" / 20" · Gemini + Pro Zoom', '9 Sep', '10 Sep', '—', '—', '—', 'todo'],
  ["r", "What's in My Bag", 'WPP', 'F3', '30" / 20" · colourways', '3 Sep', 'flat lay', '—', '—', '—', 'todo'],
  ['r', 'Dressed to the Elevens', 'WPP', 'F3', '30" / 20" · colourways', '9 Sep', '—', '—', '—', '—', 'todo'],
  ['r', 'Made in the Details', 'WPP', 'AL', '30" / 20" · ASMR atelier', '1 Oct', '3 Oct', '7 Oct', '8 Oct', '10 Oct', 'todo'],
  ['r', '+ 8 more approved ideas', 'WPP', '??', 'Pixel Perfect Weekend, Look It Up, Little Things, Palette, London in Looks, Park, Two Pieces, Five Days', '—', '—', '—', '—', '—', 'unplanned'],

  ['h', 'VAYNER · INDEED — standing, holds the weekdays'],
  ['r', 'JNP FR messaging · 8 pages', 'VAY', 'AL', 'Deck pages, bilingual copy', '17–19 Aug', '—', '19 Aug 14:30', '—', '—', 'wip'],
  ['r', 'June sprint exports', 'VAY', 'AL', '1×1 + 9×16 to Rossella', '—', '—', '—', '—', '—', 'todo'],
  ['r', 'Growth creative kickoff', 'VAY', 'AL', 'Meeting, time TBC', '—', '—', '—', '—', '—', 'held'],

  ['h', 'TYPE-A DIRECT · HALIMA — proposal TAS-P-2026-002, hard dates'],
  ['r', 'Business cards', 'TAS', 'AL', 'Two designs, one to artwork', '19 Aug', '—', '24 Aug', '25–26 Aug', '27 Aug files', 'todo'],
  ['r', 'Website · English', 'TAS', 'AL', 'Five pages, phone first', 'from 27 Aug', '—', '8 Sep', 'two rounds', 'w/c 5 Oct', 'todo'],
  ['r', 'LinkedIn', 'TAS', 'AL', '4 posts a month + inbox', 'from launch', '—', '—', '—', 'monthly', 'todo'],
  ['r', 'Website · French', 'TAS', 'AL', 'Five pages', 'Oct', '—', '—', '—', 'Oct', 'todo'],
];

const HEADS = ['ASSET', 'OWNER', 'FORMAT / DELIVERABLE', 'BUILD / PRE-PRO', 'SHOOT', 'V1 SENT', 'FEEDBACK', 'LIVE', ''];
const COLS = '360px 78px 300px 150px 150px 130px 150px 130px 104px';

const badge = (s) => {
  const m = { wip: ['IN PROGRESS', '#F4E7B0'], todo: ['TO DO', '#FFFDF7'], held: ['HELD', '#DCCFF0'],
              done: ['DONE', '#DCEFA6'], unplanned: ['UNPLANNED', '#F8CFA4'] }[s];
  return `<span style="display: inline-block; border: 2px solid ${T.ink}; border-radius: 999px; padding: 2px 9px; background: ${m[1]}; font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; white-space: nowrap;">${m[0]}</span>`;
};

const cellCss = `padding: 11px 12px; font-size: 12px; font-weight: 600; line-height: 1.35; background: ${T.card}; border-bottom: 2px solid #E4E0D3;`;

let body = '';
for (const row of ROWS) {
  if (row[0] === 'h') {
    body += `      <div style="grid-column: 1 / -1; padding: 14px 12px 9px; background: ${T.ground}; border-bottom: 3px solid ${T.ink}; border-top: 3px solid ${T.ink}; font-family: 'Archivo Black', sans-serif; font-size: 13px; letter-spacing: 0.02em;">${esc(row[1])}</div>\n`;
    continue;
  }
  const [, asset, co, who, fmt, build, shoot, v1, fb, live, status] = row;
  const c = CO[co];
  body += `      <div style="${cellCss} display: flex; align-items: center; gap: 9px;"><span style="flex: none; width: 13px; height: 13px; border-radius: 999px; border: 2px solid ${T.ink}; background: ${c.bg};"></span><span style="font-weight: 800; font-size: 12.5px;">${esc(asset)}</span></div>
      <div style="${cellCss}"><span style="display: inline-flex; align-items: center; justify-content: center; width: 25px; height: 25px; border-radius: 999px; border: 2px solid ${T.ink}; background: ${T.ground}; font-size: 10px; font-weight: 800;">${esc(who)}</span></div>
      <div style="${cellCss} color: ${T.dim};">${esc(fmt)}</div>
      <div style="${cellCss}">${esc(build)}</div>
      <div style="${cellCss}">${esc(shoot)}</div>
      <div style="${cellCss}">${esc(v1)}</div>
      <div style="${cellCss}">${esc(fb)}</div>
      <div style="${cellCss}">${esc(live)}</div>
      <div style="${cellCss}">${badge(status)}</div>\n`;
}

const tracker = wrap(`<div style="width: 1600px; box-sizing: border-box; background: ${T.ground}; padding: 44px 44px 48px; display: flex; flex-direction: column; gap: 24px;">
  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 30px;">
    <div style="font-family: 'Archivo Black', sans-serif; font-size: 58px; line-height: 0.95; color: ${T.gold}; -webkit-text-stroke: 3.5px ${T.ink}; paint-order: stroke fill; text-shadow: 5px 5px 0 ${T.ink};">ASSET TRACKER</div>
    <div style="font-size: 13px; font-weight: 700; color: ${T.dim}; max-width: 400px; text-align: right; line-height: 1.5;">
      Every deliverable across all four strands, in one place. The calendars show <em>when</em>; this shows <em>what</em> and <em>whose</em>.
    </div>
  </div>

  <div style="border: 3px solid ${T.ink}; box-shadow: 6px 6px 0 ${T.ink}; overflow: hidden;">
    <div style="display: grid; grid-template-columns: ${COLS};">
${HEADS.map((h) => `      <div style="padding: 13px 12px; background: ${T.ink}; color: ${T.ground}; font-size: 10.5px; font-weight: 800; letter-spacing: 0.11em;">${h}</div>`).join('\n')}
${body}    </div>
  </div>

  <div style="display: flex; gap: 16px;">
    <div style="flex: 1; background: ${T.card}; border: 3px solid ${T.ink}; box-shadow: 5px 5px 0 ${T.ink}; padding: 18px 22px;">
      <div style="font-family: 'Archivo Black', sans-serif; font-size: 15px; margin-bottom: 7px;">24 DELIVERABLES, ONE OF YOU</div>
      <div style="font-size: 13px; line-height: 1.5; font-weight: 500;">Nineteen are dated. Five Pixel ideas are scheduled and eight more are approved with nowhere to go — that last row is the honest one.</div>
    </div>
    <div style="flex: 1; background: #F8CFA4; border: 3px solid ${T.ink}; box-shadow: 5px 5px 0 ${T.ink}; padding: 18px 22px;">
      <div style="font-family: 'Archivo Black', sans-serif; font-size: 15px; margin-bottom: 7px;">THE UNPLANNED ROW IS THE DECISION</div>
      <div style="font-size: 13px; line-height: 1.5; font-weight: 500;">Eight approved Pixel ideas have no date and no owner. They either go to F2 and F3 in October, or you tell Rae the slate is five, not thirteen.</div>
    </div>
  </div>
</div>`);

writeFileSync(new URL('./Tracker.dc.html', import.meta.url), tracker);
console.log('wrote Tracker');
