/* Timeline geometry. Date arithmetic and row packing, no DOM knowledge.
   Pure functions, so they can be checked from the console against the table in
   docs/05-architecture.md — see main.js and window.__geo. */

/** A month is a span, not an instant. "2007-09" is the point 2007 + 8/12. */
export function yearValue(y, m) {
  return y + (m - 1) / 12;
}

function parseMonth(s) {
  const [y, m] = s.split('-').map(Number);
  return { y, m };
}

/** The month after the given one. A band's end boundary is exclusive. */
function nextMonth({ y, m }) {
  return m === 12 ? { y: y + 1, m: 1 } : { y, m: m + 1 };
}

/**
 * The axis runs from 1 January of the earliest start year in the data to the
 * first day of the month AFTER the current month. Both ends are derived: a
 * pre-2007 entry extends the axis rather than overflowing it, and the open band
 * lands flush on 100% on every page load, forever.
 */
export function computeAxis(entries, today = new Date()) {
  const starts = entries.map((e) => parseMonth(e.start));
  const firstYear = Math.min(...starts.map((s) => s.y));
  const end = nextMonth({ y: today.getFullYear(), m: today.getMonth() + 1 });

  const from = yearValue(firstYear, 1);
  const to = yearValue(end.y, end.m);
  return { from, to, firstYear, end, pctPerYear: 100 / (to - from) };
}

/** Position of the first day of month `m` in year `y`, as a percentage of the axis. */
export function pos(axis, y, m) {
  return (yearValue(y, m) - axis.from) * axis.pctPerYear;
}

/**
 * One band per entry. `end: null` means the band is open and runs to 100%.
 * Throws if an entry carries no colour — a loud failure, by decision: the
 * maintainer supplies the tone at the moment of editing (04-ui-spec.md Q7).
 */
export function computeBands(entries, lane, axis) {
  return entries.map((e) => {
    if (!e.color) {
      throw new Error(`timeline: entry "${e.id}" has no color`);
    }
    const s = parseMonth(e.start);
    const left = pos(axis, s.y, s.m);
    const after = e.end ? nextMonth(parseMonth(e.end)) : null;
    const right = after ? pos(axis, after.y, after.m) : 100;
    return { id: e.id, lane, color: e.color, left, width: right - left, open: !e.end };
  });
}

/**
 * Greedy first-fit packing on LABEL extent, not bar extent — labels are wider
 * than the bars they label, and they are what collide.
 *
 * This replaces the design's hand-authored `tier: up|down` flags. With a runtime
 * axis every band creeps leftward each month, so a pair that clears today can
 * collide next spring on a page nobody has edited. Computed, it cannot drift.
 *
 * `maxRows` caps the work lane at two rows (above and below the shared
 * baseline); the studies lane passes Infinity and takes as many as it needs.
 */
export function packRows(items, maxRows = Infinity) {
  const order = items.map((it, i) => i).sort((a, b) => items[a].left - items[b].left);
  const rowEnds = [];
  const rows = new Array(items.length);

  for (const i of order) {
    const { left, extent } = items[i];
    let row = rowEnds.findIndex((endAt) => left >= endAt);
    if (row === -1) {
      row = rowEnds.length < maxRows ? rowEnds.length : shortestRow(rowEnds);
      if (row === rowEnds.length) rowEnds.push(0);
    }
    rowEnds[row] = left + extent;
    rows[i] = row;
  }
  return rows;
}

function shortestRow(rowEnds) {
  let best = 0;
  for (let i = 1; i < rowEnds.length; i++) if (rowEnds[i] < rowEnds[best]) best = i;
  return best;
}

/**
 * Label width as a percentage of the container. IBM Plex Mono has a uniform
 * advance of 0.6em, so this needs no layout read — only the container width,
 * which is measured once after first paint.
 */
export function labelExtent(text, fontSizePx, containerPx, padEm = 1.5) {
  return ((text.length + padEm) * 0.6 * fontSizePx * 100) / containerPx;
}

/**
 * The year rail marks the chapters: the start year of every entry that is not
 * wholly contained inside another entry in the same list, plus the current year.
 *
 * That containment rule is what drops the KIT exchange year, which sits entirely
 * inside the Cádiz Licenciatura, and it yields exactly the seven marks in
 * 04-ui-spec.md §3 — the four roles, the two Spanish degrees, and this year —
 * without naming any of them.
 */
export function railYears(lists, today = new Date()) {
  const years = new Set([today.getFullYear()]);
  for (const list of lists) {
    for (const e of list) {
      if (!list.some((o) => o !== e && contains(o, e))) {
        years.add(Number(e.start.slice(0, 4)));
      }
    }
  }
  return [...years].sort((a, b) => a - b);
}

function contains(outer, inner) {
  const end = (e) => (e.end ? e.end : '9999-12');
  return outer.start <= inner.start && end(outer) >= end(inner);
}

/**
 * Axis ticks: a regular five-year scale from the axis origin, plus the current
 * year. 04-ui-spec.md §5.1 recorded the handoff's irregular 2007/2012/2016/2020
 * set as an observation, not a rule; a uniform axis deserves uniform ticks, and
 * these are derived so they cannot go stale.
 */
export function axisTicks(axis, today = new Date(), every = 5) {
  const years = [];
  for (let y = axis.firstYear; y < today.getFullYear(); y += every) years.push(y);
  years.push(today.getFullYear());
  return years;
}
