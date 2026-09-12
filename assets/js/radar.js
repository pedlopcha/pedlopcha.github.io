/* Radar geometry. Polar arithmetic only, no DOM knowledge.
   Reproduces every literal coordinate in the Claude Design handoff from the
   rules in docs/04-ui-spec.md §5.2 — nothing is transcribed. */

export const CENTRE = 200;
export const VIEWBOX = '-118 -48 636 516';
export const UNIT = 30;              // one level
export const RINGS = [30, 60, 90, 120, 150];
export const LABEL_R = 162;          // constant, regardless of the data radius
export const GROUP_LABEL_R = 132;    // A11 — the group's name along its arc

const fmt = (p) => `${round(p.x)} ${round(p.y)}`;
const round = (n) => Math.round(n * 10) / 10;

/**
 * Every angle on the chart derives from the number of spokes, so the ring
 * closes at any count.
 *
 * 04-ui-spec.md §5.2 fixes the step at 20°, which is right for exactly the
 * eighteen skills it was written against and wrong for every other number:
 * at seventeen those spokes span 340° and leave a 20° hole at twelve o'clock.
 * The spoke count is the fact; the step follows from it. Adding or removing a
 * rated skill in cv.json is therefore a content edit and nothing more.
 */
export function geometry(count) {
  if (!(count > 0)) throw new Error('radar: no rated skills to place');

  const step = 360 / count;
  const angle = (index) => ((((index * step) % 360) + 360) % 360);
  // count × (360 / count) does not land exactly on 360 in binary floating
  // point, so "is this spoke on the vertical axis" needs a tolerance, measured
  // the short way round the circle.
  const on = (index, deg) => {
    const d = Math.abs(angle(index) - deg) % 360;
    return Math.min(d, 360 - d) < 1e-9;
  };

  /** Spoke `i` sits at i × step, clockwise from twelve o'clock. */
  const point = (index, radius) => {
    const theta = (index * step * Math.PI) / 180;
    return {
      x: CENTRE + radius * Math.sin(theta),
      y: CENTRE - radius * Math.cos(theta),
    };
  };

  /**
   * A group spanning spokes a…b. The path opens and closes a half-step past its
   * first and last member, at THAT member's radius, so neighbouring wedges meet
   * cleanly instead of overlapping or leaving a gap.
   */
  const wedgePath = (levels, a, b) => {
    const parts = [`M ${CENTRE} ${CENTRE}`];
    parts.push(`L ${fmt(point(a - 0.5, levels[a] * UNIT))}`);
    for (let i = a; i <= b; i++) parts.push(`L ${fmt(point(i, levels[i] * UNIT))}`);
    parts.push(`L ${fmt(point(b + 0.5, levels[b] * UNIT))}`);
    parts.push('Z');
    return parts.join(' ');
  };

  /** Labels lean away from the vertical axis; any sitting on it are centred. */
  const labelAnchor = (index) => {
    if (on(index, 0) || on(index, 180)) return 'middle';
    return angle(index) < 180 ? 'start' : 'end';
  };

  /**
   * A spoke pointing straight down runs through its own label, so that label
   * drops clear of it. Whether such a spoke exists depends on the count — an
   * odd number of spokes has none.
   */
  const labelNudge = (index) => (on(index, 180) ? 4 : 0);

  const labelPoint = (index) => {
    const p = point(index, LABEL_R);
    return { x: p.x, y: p.y + labelNudge(index) };
  };

  /**
   * A11 — the arc a group's name is set along.
   *
   * The architecture placed this label horizontally at the wedge's mid-angle,
   * radius 230. That clears the spoke labels radially but not by text extent:
   * measured in a browser, "Produkt & Führung" overlaps Product Ownership's
   * label and "Technisch" overlaps Data Analysis's, at every radius that still
   * fits the viewBox. Labels radiating from r = 162 leave no horizontal room.
   *
   * So the label takes 04-ui-spec.md A11's FIRST option, "along the arc":
   * curved text holds a constant radius and therefore cannot sweep into a spoke
   * label. It sits inside the outer ring, where only rings and translucent
   * wedge fill live, with a paper-coloured halo behind the glyphs.
   */
  const groupArcPath = (a, b, radius = GROUP_LABEL_R) => {
    const largeArc = (b - a) * step > 180 ? 1 : 0;
    // Through the bottom of the circle a clockwise baseline renders the text
    // upside down, so the arc is drawn the other way round and the glyphs stay
    // upright. 90 deg < mid < 270 deg is exactly the lower half.
    const mid = ((a + b) / 2) * step;
    const flip = mid > 90 && mid < 270;
    const from = point(flip ? b : a, radius);
    const to = point(flip ? a : b, radius);
    return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} `
         + `A ${radius} ${radius} 0 ${largeArc} ${flip ? 0 : 1} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
  };

  return { count, step, angle, point, wedgePath, labelAnchor, labelNudge, labelPoint, groupArcPath };
}

/**
 * Flattens the rated categories into spoke order. Array order IS display order,
 * and therefore spoke order — changing it rotates the shape.
 * Throws if any rated skill has no level: the radar does not render rather than
 * defaulting to a midpoint (docs/02-ux-spec.md, edge cases).
 */
export function spokes(technical) {
  const out = [];
  const groups = [];
  for (const cat of technical) {
    if (!cat.rated) continue;
    const from = out.length;
    for (const item of cat.items) {
      if (typeof item.level !== 'number') {
        throw new Error(`radar: skill "${item.id}" has no level`);
      }
      out.push({ id: item.id, name: item.name, level: item.level, group: cat.id });
    }
    groups.push({ id: cat.id, from, to: out.length - 1 });
  }
  return { items: out, groups };
}
