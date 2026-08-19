import { monthBoard } from './build.mjs';
import { writeFileSync } from 'node:fs';

const P = true; // proposed

const august = {
  title: "AUGUST '26", flag: 'WPP EXTENDED — NOW RUNS TO 4 SEP', flagBg: '#DCEFA6',
  lead: [26, 27, 28, 29, 30, 31], days: 31, trail: ['01', '02', '03', '04', '05'],
  cells: {
    19: { stage: 'BUILD', badge: 'TODAY', tags: [
      { co: 'VAY', who: 'AL', text: 'JNP FR PAGES ×8' },
      { co: 'VAY', who: 'AL', text: '14:30 JNP REVIEW' },
      { co: 'WPP', who: 'AL', text: 'P11 EDITS BRIEF 10:30' },
      { co: 'TAS', who: 'AL', text: 'HALIMA · ANSWERS + INV 1' } ] },
    20: { stage: 'EDIT', tags: [
      { co: 'WPP', who: 'AL', text: 'YES BUT · REVISIONS' },
      { co: 'WPP', who: 'AL', text: 'BANDANA HI-RES → PSD' } ], notes: ['Vayner in office'] },
    21: { stage: 'FEEDBACK', badge: 'EXTENDED +2 WKS', badgeBg: '#DCEFA6', tags: [
      { co: 'WPP', who: 'AL', text: 'WK04 ENDS · RUNS TO 4 SEP' },
      { co: 'VAY', who: 'AL', text: 'TIMESHEET' } ],
      warns: ['Blocked 12:00–17:00 · collecting James'] },
    22: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'REACT', who: 'DM', text: 'RED CARD · SHOOT' } ],
      warns: ["Rocco 10:00 → Sun 14:00, party 20:30. Diane covers it."] },
    23: { stage: 'EDIT', tags: [ { co: 'REACT', who: 'AD', text: 'RED CARD · EDIT D1' } ], notes: ['You free from 14:00'] },
    24: { stage: 'EDIT', tags: [
      { co: 'REACT', who: 'AD', text: 'RED CARD · EDIT D2 → V1' },
      { co: 'TAS', who: 'AL', text: 'HALIMA · 2 CARD DESIGNS' },
      { co: 'REACT', who: 'AL', text: 'FINAL RE:ACT TIMESHEET' } ], notes: ['Editorial weekly 11:00'] },
    25: { stage: 'BUILD', tags: [
      { co: 'WPP', who: 'AL', text: 'WK05 · P11 BUILD' },
      { co: 'WPP', who: 'AN', text: '40 FEET AWAY · BUILD', proposed: P } ], notes: ['Vayner in office'] },
    26: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'WPP', who: 'AL', text: 'FORAGING SHOOT · ALL DAY' },
      { co: 'WPP', who: 'DM', text: 'PRODUCE ON THE DAY' } ], notes: ['Already held in your diary'] },
    27: { stage: 'EDIT', tags: [
      { co: 'WPP', who: 'AL', text: 'FORAGING · SELECTS AM', proposed: P },
      { co: 'TAS', who: 'AL', text: 'HALIMA · PRINT-READY FILES' } ],
      warns: ['Files due today and you leave 18:00'] },
    28: { stage: 'LIVE', badge: 'GOES LIVE', tags: [
      { co: 'REACT', who: 'DM', text: 'EP BAG CHECK · LIVE' } ],
      warns: ['You are away — Diane posts and monitors'] },
    29: { away: true, notes: ["GIRLS' GETAWAY"] },
    30: { away: true, notes: ['Back 12:00'] },
    31: { stage: 'BUILD', tags: [
      { co: 'REACT', who: 'AN', text: 'HURLING + MATCHDAY OSG' },
      { co: 'REACT', who: 'AL', text: 'RE:ACT AUG BILLING' } ] },
  },
  footers: [
    { title: 'AUGUST IS WRAP-UP, NOT NEW WORK', body: 'The extension buys two more paid WPP weeks, but the 22nd, 26th and 27th–30th are already spoken for. There is almost no new Pixel capacity in this month.' },
  ],
};

const september = {
  title: "SEPTEMBER '26", flag: 'AWAY 18–28 SEP ONLY · PARIS IS OUT', flagBg: '#DCEFA6',
  lead: [30, 31], days: 30, trail: ['01', '02', '03'],
  cells: {
    1: { stage: 'BUILD', tags: [
      { co: 'REACT', who: 'AN', text: 'FIRST WEEK · OSG + BOARD' },
      { co: 'WPP', who: 'AL', text: 'WK06 · P11' } ], notes: ['Vayner in office'] },
    2: { stage: 'FEEDBACK', badge: 'TO CLIENT', tags: [
      { co: 'REACT', who: 'AL', text: '3 PRE-PRO PACKS → CLIENT' } ] },
    3: { stage: 'BUILD', tags: [
      { co: 'WPP', who: 'AL', text: 'WK06 · P11 + WRITE HANDOVER', proposed: P },
      { co: 'WPP', who: 'AN', text: "WHAT'S IN MY BAG · BUILD", proposed: P } ], notes: ['Therapy 16:00 · Vayner office'] },
    4: { stage: 'FEEDBACK', badge: 'CONTRACT ENDS', badgeBg: '#F8CFA4', tags: [
      { co: 'WPP', who: 'AL', text: 'WPP FINAL DAY · HANDOVER' } ],
      warns: ['Also an all-day appointment — write the handover on the 3rd'] },
    5: { away: true, notes: ["MANCHESTER · Abi's birthday"] },
    6: { away: true, notes: ['Back 20:42'] },
    7: { stage: 'EDIT', tags: [ { co: 'REACT', who: 'AN', text: 'PRE-PRO V2 / V3' } ], notes: ['Editorial weekly 11:00 · Vayner office'] },
    8: { stage: 'FEEDBACK', badge: 'TO CLIENT', tags: [
      { co: 'REACT', who: 'AL', text: 'FINAL PRE-PRO PACKS' },
      { co: 'TAS', who: 'AL', text: 'HALIMA · WEBSITE DESIGN' } ],
      warns: ['Two client deliverables land the same day'] },
    9: { stage: 'BUILD', tags: [
      { co: 'WPP', who: 'AN', text: 'DRESSED TO ELEVENS · BUILD', proposed: P },
      { co: 'WPP', who: 'DM', text: 'WHERE THE SUN GOES · RECCE', proposed: P } ] },
    10: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'WPP', who: 'DM', text: 'WHERE THE SUN GOES · SHOOT', proposed: P },
      { co: 'WPP', who: 'AN', text: '40 FEET AWAY · SHOOT', proposed: P } ], notes: ['Therapy 16:00'] },
    11: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'REACT', who: 'AL', text: 'EXPLAIN HURLING' },
      { co: 'REACT', who: 'AL', text: 'MATCHDAY RITUALS' },
      { co: 'REACT', who: 'DM', text: 'PRODUCE · PARNELL PARK' } ], notes: ['Parnell Park, Dublin · 18:45'] },
    12: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'REACT', who: 'AL', text: 'FIRST WEEK PROMISES' },
      { co: 'REACT', who: 'DM', text: 'PRODUCE · UCC CORK' } ], notes: ["UCC Freshers' Festival, Cork"] },
    13: { stage: 'EDIT', tags: [
      { co: 'REACT', who: 'AL', text: 'HURLING + MATCHDAY · EDIT' },
      { co: 'REACT', who: 'AD', text: 'FIRST WEEK · EDIT' } ] },
    14: { stage: 'EDIT', tags: [ { co: 'REACT', who: 'AD', text: 'ALL THREE · EDIT' } ], notes: ['Editorial weekly 11:00 · Vayner office'] },
    15: { stage: 'EDIT', tags: [ { co: 'REACT', who: 'AD', text: 'ALL THREE · FINAL PASS' } ], notes: ['Vayner in office'] },
    16: { stage: 'FEEDBACK', badge: 'TO CLIENT', tags: [ { co: 'REACT', who: 'AL', text: 'ALL THREE EDITS → CLIENT' } ] },
    17: { stage: 'FEEDBACK', badge: 'LAST DAY', badgeBg: '#F8CFA4', tags: [
      { co: 'WPP', who: 'AL', text: 'P11 · HAND TO THE TEAM', proposed: P },
      { co: 'VAY', who: 'AL', text: 'INDEED · COVER PLAN', proposed: P } ],
      warns: ['Last working day before 11 days off'] },
    18: { away: true, notes: ['BIRTHDAY LEAVE'] },
    19: { away: true, notes: ['Buffer · travel prep'] },
    20: { away: true, notes: ['GREECE'] }, 21: { away: true }, 22: { away: true }, 23: { away: true },
    24: { away: true }, 25: { away: true }, 26: { away: true }, 27: { away: true }, 28: { away: true, notes: ['Home tonight'] },
    29: { stage: 'BUILD', badge: 'BACK', badgeBg: '#DCEFA6', tags: [
      { co: 'WPP', who: 'AL', text: 'REVIEW WHAT THE TEAM SHIPPED', proposed: P } ], notes: ['Vayner in office'] },
    30: { stage: 'EDIT', tags: [ { co: 'WPP', who: 'AD', text: 'P11 BACKLOG · EDIT', proposed: P } ] },
  },
  footers: [
    { title: '1–17 SEP CARRIES EVERYTHING', body: 'Seventeen days hold the Re:act slate, the last two weeks of the WPP contract <em>and</em> Halima&rsquo;s website. Six are Re:act shoots or edits, three go to the appointment and Manchester. Four are genuinely free.' },
  ],
};

const october = {
  title: "OCTOBER '26", flag: 'FULL MONTH BACK — THE CATCH-UP', flagBg: '#DCEFA6',
  lead: [27, 28, 29, 30], days: 31, trail: [],
  cells: {
    1: { stage: 'BUILD', tags: [ { co: 'WPP', who: 'AN', text: 'P11 · BUILD BLOCK', proposed: P } ], notes: ['Therapy 16:00'] },
    2: { stage: 'EDIT', tags: [ { co: 'WPP', who: 'AL', text: 'P11 · REVISIONS PASS', proposed: P } ], notes: ['Vayner timesheet'] },
    3: { stage: 'SHOOT', badge: 'SHOOT DAY', tags: [
      { co: 'WPP', who: 'AL', text: 'MADE IN THE DETAILS · ATELIER', proposed: P },
      { co: 'WPP', who: 'DM', text: 'PRODUCE · ATELIER', proposed: P } ], notes: ["Weekend shoot — you said you don't mind"] },
    4: { stage: 'EDIT', tags: [ { co: 'WPP', who: 'AD', text: 'MADE IN THE DETAILS · EDIT', proposed: P } ] },
    5: { stage: 'LIVE', badge: 'GOES LIVE', tags: [
      { co: 'TAS', who: 'AL', text: 'HALIMA · SITE LIVE (W/C)' },
      { co: 'REACT', who: 'AL', text: 'RE:ACT OCT · BUILD', proposed: P } ], notes: ['Editorial weekly 11:00'] },
    6: { stage: 'FEEDBACK', tags: [ { co: 'TAS', who: 'AL', text: 'C4 SCREENWRITING · 17:00' } ], notes: ['A deadline, not production'] },
    7: { stage: 'FEEDBACK', badge: 'TO CLIENT', tags: [ { co: 'WPP', who: 'AL', text: 'P11 BATCH → CLIENT', proposed: P } ] },
    8: { stage: 'FEEDBACK', tags: [ { co: 'WPP', who: 'AL', text: 'CLIENT FEEDBACK WINDOW', proposed: P } ], notes: ['Therapy 16:00'] },
    9: { stage: 'EDIT', tags: [ { co: 'WPP', who: 'AD', text: 'P11 · V2 REVISIONS', proposed: P } ], notes: ['Vayner timesheet'] },
    10: { stage: 'LIVE', badge: 'GOES LIVE', tags: [ { co: 'WPP', who: 'AL', text: 'FIRST P11 BATCH LIVE', proposed: P } ] },
    12: { stage: 'BUILD', tags: [ { co: 'TAS', who: 'AL', text: 'HALIMA · FRENCH SITE KICKOFF', proposed: P } ], notes: ['Editorial weekly 11:00'] },
  },
  footers: [
    { title: 'OCTOBER IS THE PAYBACK MONTH', body: 'With Paris gone this is a clear month. The Pixel backlog the team built while you were away gets reviewed, revised and shipped, and Halima&rsquo;s French site starts.' },
  ],
};

writeFileSync(new URL('./August.dc.html', import.meta.url), monthBoard(august));
writeFileSync(new URL('./September.dc.html', import.meta.url), monthBoard(september));
writeFileSync(new URL('./October.dc.html', import.meta.url), monthBoard(october));
console.log('wrote August / September / October');
