/* cv.json + copy.json + lang -> DOM.

   Pure apart from the caller's final append. Every visible string is either a
   fact read from cv.json or a [data-copy] mount that i18n.js fills from
   copy.json — no CV prose is written in this file. */

import { lookup, resolve, fill } from './i18n.js';
import { tier2 } from './data.js';
import * as T from './timeline.js';
import * as R from './radar.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, props = {}, kids = []) {
  const node = document.createElement(tag);
  apply(node, props);
  add(node, kids);
  return node;
}

function svg(tag, props = {}, kids = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    node.setAttribute(k, v);
  }
  add(node, kids);
  return node;
}

function apply(node, props) {
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style') for (const [p, val] of Object.entries(v)) node.style.setProperty(p, val);
    else if (k === 'copy') node.dataset.copy = v;
    else node.setAttribute(k, v);
  }
}

function add(node, kids) {
  for (const kid of [kids].flat(9)) {
    if (kid == null || kid === false) continue;
    node.append(kid);
  }
}

/** "2023-11" -> "11/2023". A fact, so it is formatted, never translated. */
const monthYear = (s) => `${s.slice(5)}/${s.slice(0, 4)}`;

/** A level printed as text beside every skill, so the radar is never the only
    route to the data (WCAG 1.4.1, satisfied by construction). */
const levelSpan = (level) =>
  el('span', { class: 'skill__level mono', 'data-copy-fmt': 'microcopy.levelFormat', 'data-fmt-level': level });

/* ------------------------------------------------------------------------ */

export function renderAll(cv, copy, lang) {
  const refreshers = [];
  return {
    masthead: masthead(cv),
    main: main(cv, copy, lang, refreshers),
    footer: footer(cv),
    refreshers,
  };
}

/* --- 1 · masthead --------------------------------------------------------- */

function langToggle() {
  return el('div', { class: 'lang', role: 'group', 'data-copy-attr': 'aria-label:microcopy.langToggleAriaLabel' }, [
    el('button', { class: 'lang__btn', type: 'button', 'data-lang': 'de', 'aria-pressed': 'false', copy: 'microcopy.langToggleDe' }),
    el('button', { class: 'lang__btn', type: 'button', 'data-lang': 'en', 'aria-pressed': 'false', copy: 'microcopy.langToggleEn' }),
  ]);
}

function masthead(cv) {
  const f = new DocumentFragment();
  add(f, [
    el('span', { class: 'masthead__name', text: cv.meta.name }),
    langToggle(),
  ]);
  return f;
}

/* --- main ----------------------------------------------------------------- */

function main(cv, copy, lang, refreshers) {
  const f = new DocumentFragment();
  add(f, [
    opening(cv),
    work(cv),
    arc(cv, copy, lang),
    range(cv, copy, lang, refreshers),
  ]);
  return f;
}

/* --- 2 · opening ---------------------------------------------------------- */

function opening(cv) {
  const dated = [...cv.education, ...cv.experience, ...cv.earlierStations];
  const axis = T.computeAxis(dated);

  // The rail runs newest at top while the timeline runs oldest at left. This is
  // deliberate (04-ui-spec.md Q6) and must not be "fixed".
  const years = T.railYears([cv.education, cv.experience]).reverse();
  const now = new Date().getFullYear();
  const span = axis.to - axis.from;

  const marks = years.map((y) =>
    el('span', {
      class: `rail__mark mono${y === now ? ' rail__mark--now' : ''}`,
      text: String(y),
      style: { '--mark-top': `${(((axis.to - T.yearValue(y, 1)) / span) * 100).toFixed(3)}%` },
    }));

  const photo = cv.meta.photo;
  const portrait = photo
    ? el('div', { class: 'opening__portrait' }, [
        el('img', {
          src: `/content/media/${photo.src}`,
          srcset: (photo.srcset ?? []).map((s) => `/content/media/${s.file} ${s.w}w`).join(', ') || null,
          sizes: '(max-width: 639px) 120px, clamp(180px, 21vw, 272px)',
          width: photo.width,
          height: photo.height,
          decoding: 'async',
          'data-copy-attr': 'alt:meta.photoAlt',
        }),
      ])
    : null;

  return el('section', { class: 'section section--opening' }, [
    el('div', { class: 'opening' }, [
      el('div', { class: 'rail' }, [
        el('span', { class: 'rail__label', copy: 'sections.arc.timelineAxisLabel' }),
        el('div', { class: 'rail__track' }, marks),
      ]),
      el('div', { class: 'opening__body' }, [
        el('h1', { class: 'headline opening__headline', copy: 'meta.headline' }),
        el('div', { class: 'statement opening__statement' }, [
          el('p', { copy: 'meta.openingStatement', 'data-copy-part': '0' }),
          el('p', { copy: 'meta.openingStatement', 'data-copy-part': '1' }),
        ]),
        portrait,
      ]),
    ]),
  ]);
}

/* --- 3 · work ------------------------------------------------------------- */

function work(cv) {
  return el('section', { class: 'section section--work' }, [
    el('div', { class: 'section__head' }, [
      el('h2', { class: 'section__heading', copy: 'sections.work.heading' }),
    ]),
    el('div', { class: 'roles' }, cv.experience.map(role)),
  ]);
}

function role(r) {
  const date = r.end
    ? el('span', { text: `${monthYear(r.start)} – ${monthYear(r.end)}` })
    : el('span', {}, [
        `${monthYear(r.start)} – `,
        el('span', { copy: 'microcopy.currentRoleDateSuffix' }),
      ]);

  return el('article', { class: 'role' }, [
    el('p', { class: 'role__date mono' }, [date]),
    el('div', { class: 'role__body' }, [
      el('h3', { class: 'role__title' }, [
        el('span', { text: r.role }),
        ' · ',
        el('span', { class: 'role__company', text: r.company }),
      ]),
      // COBI has no summary; the element is simply absent, with no gap.
      el('p', { class: 'role__summary', copy: `roles.${r.id}.summary`, 'data-copy-optional': '' }),
      el('ul', { class: 'role__bullets' }, bulletMounts(r.id)),
    ]),
  ]);
}

/** One <li> per bullet. The count comes from copy.json, which owns the budget. */
let bulletCounts = null;
function bulletMounts(id) {
  const n = bulletCounts?.[id] ?? 0;
  return Array.from({ length: n }, (_, i) =>
    el('li', { class: 'role__bullet' }, [
      el('span', { class: 'role__bullet-text', copy: `roles.${id}.bullets`, 'data-copy-index': String(i) }),
    ]));
}

/* --- 4 · the arc ---------------------------------------------------------- */

function arc(cv, copy, lang) {
  const dated = [...cv.education, ...cv.experience, ...cv.earlierStations];
  const axis = T.computeAxis(dated);

  const diagram = tier2('timeline', () => timeline(cv, copy, lang, axis));

  return el('section', { class: 'section section--arc' }, [
    el('div', { class: 'section__head' }, [
      el('h2', { class: 'section__heading', copy: 'sections.arc.heading' }),
      el('p', { class: 'section__intro', copy: 'sections.arc.intro' }),
    ]),
    el('ul', { class: 'attribution' },
      (copy.sections.arc.attribution?.items ?? []).map((_, i) =>
        el('li', { copy: 'sections.arc.attribution.items', 'data-copy-index': String(i) }))),
    diagram,
    el('div', { class: 'arc__lists' }, [
      el('div', {}, [
        el('h3', { class: 'subheading', copy: 'sections.arc.educationLabel' }),
        el('ul', { class: 'arc__list' }, cv.education.map((e) => educationItem(e))),
      ]),
      el('div', {}, [
        el('h3', { class: 'subheading', copy: 'sections.arc.earlierStationsLabel' }),
        el('ul', { class: 'arc__list' }, cv.earlierStations.map((e) => stationItem(e))),
      ]),
    ]),
  ]);
}

function dateRange(e) {
  return el('span', { class: 'arc__date mono', text: `${monthYear(e.start)} – ${monthYear(e.end)}` });
}

function educationItem(e) {
  return el('li', {}, [
    dateRange(e),
    el('span', { copy: `education.${e.id}.fieldLabel` }),
    ' — ',
    el('span', { copy: `education.${e.id}.credentialLabel` }),
    el('span', { class: 'arc__institution' }, [
      ', ',
      // The institution is a fact unless the institution itself publishes an
      // official English name; then copy.json carries both forms.
      el('span', { copy: `education.${e.id}.institutionLabel`, 'data-copy-else': e.institution }),
    ]),
  ]);
}

function stationItem(e) {
  return el('li', {}, [
    dateRange(e),
    el('span', { copy: `earlierStations.${e.id}.roleLabel` }),
    el('span', { class: 'arc__institution' }, [
      ', ',
      el('span', { copy: `earlierStations.${e.id}.institutionLabel`, 'data-copy-else': e.organization }),
    ]),
  ]);
}

/** Two lanes on one shared axis. Geometry reaches CSS only as custom
    properties — there is no viewport read here (A1). */
function timeline(cv, copy, lang, axis) {
  const lanes = [
    { key: 'studies', entries: cv.education, label: 'sections.arc.laneStudies' },
    { key: 'work', entries: [...cv.experience, ...cv.earlierStations], label: 'sections.arc.laneWork' },
  ];

  const laneNodes = lanes.map(({ key, entries, label }) => {
    const bands = T.computeBands(entries, key, axis);
    const nodes = [];
    for (const b of bands) {
      const text = lookup(copy, `sections.arc.timelineBands.${b.id}`, lang);
      if (!text) throw new Error(`no timelineBands.${b.id}`);
      const style = {
        '--band-start': `${b.left.toFixed(3)}%`,
        '--band-len': `${b.width.toFixed(3)}%`,
        '--band-color': b.color,
        '--band-row': key === 'work' ? '1' : '0',
      };
      nodes.push(
        el('span', { class: 'band', style, 'data-band': b.id, 'aria-hidden': 'true' }),
        el('span', {
          class: 'band__label mono', style, 'data-band-label': b.id,
          copy: `sections.arc.timelineBands.${b.id}`,
        }));
    }
    return el('div', { class: `timeline__lane timeline__lane--${key}`, 'data-group': key }, [
      el('button', { class: 'timeline__lane-label mono', type: 'button', 'data-group': key, 'aria-pressed': 'false', copy: label }),
      el('div', { class: 'timeline__track' }, nodes),
    ]);
  });

  const tickYears = T.axisTicks(axis);
  const ticks = tickYears.map((y, i) => el('span', {
    // The first and last ticks sit on the axis ends, so centring them would put
    // half the label outside the container.
    class: `timeline__tick mono${i === 0 ? ' timeline__tick--first' : ''}`
         + `${i === tickYears.length - 1 ? ' timeline__tick--last' : ''}`,
    text: String(y),
    style: { '--tick-at': `${T.pos(axis, y, 1).toFixed(3)}%` },
  }));

  return el('div', { class: 'timeline' }, [
    el('div', { class: 'timeline__lanes' }, [
      laneNodes[0],
      el('div', { class: 'timeline__rule', 'aria-hidden': 'true' }),
      laneNodes[1],
    ]),
    el('div', { class: 'timeline__axis' }, ticks),
  ]);
}

/* --- 5 · range ------------------------------------------------------------ */

function range(cv, copy, lang, refreshers) {
  const rated = cv.skills.technical.filter((c) => c.rated);
  const tools = cv.skills.technical.find((c) => c.id === 'tools');

  const chart = tier2('radar', () => radar(cv, copy, lang, refreshers));

  return el('section', { class: 'section section--range' }, [
    el('div', { class: 'section__head' }, [
      el('h2', { class: 'section__heading', copy: 'sections.range.heading' }),
      el('p', { class: 'section__intro', copy: 'sections.range.intro' }),
      el('p', { class: 'levelnote', copy: 'sections.range.levelScaleNote' }),
    ]),
    el('div', { class: 'range__grid' }, [
      el('div', { class: 'range__groups' }, [
        ...rated.map((cat) => skillGroup(cat, tools)),
        languages(cv),
      ]),
      chart && el('div', { class: 'range__radar' }, [chart]),
    ]),
  ]);
}

function skillGroup(cat, tools) {
  return el('div', {
    class: 'skillgroup', 'data-group': cat.id,
    style: { '--group-tone': `var(--tone-${cat.id})` },
  }, [
    // A3 / A7: a real control with a sticky pressed state, not a hover-only heading.
    el('h3', {}, [
      el('button', { class: 'skillgroup__btn', type: 'button', 'data-group': cat.id, 'aria-pressed': 'false' }, [
        el('span', { class: 'skillgroup__swatch', 'aria-hidden': 'true' }),
        el('span', { class: 'subheading', copy: `sections.range.groups.${cat.id}` }),
        el('span', { class: 'skillgroup__status mono', copy: 'microcopy.layerHighlighted', 'aria-hidden': 'true' }),
      ]),
    ]),
    el('ul', { class: 'skillgroup__list' }, cat.items.map((it) =>
      el('li', { class: 'skill' }, [
        // The skill name is a fact; copy.json overrides it only where the German
        // name needs an English form.
        el('span', { copy: `sections.range.skillLabels.${it.id}`, 'data-copy-else': it.name }),
        levelSpan(it.level),
      ]))),
    // G1: the tools are facts in cv.json. Only the label, and the one tool name
    // carrying English connectives, come from copy.json.
    cat.id === 'methods' && tools ? toolsLine(tools) : null,
  ]);
}

function toolsLine(tools) {
  const parts = [];
  tools.items.forEach((t, i) => {
    if (i) parts.push(', ');
    parts.push(el('span', { copy: `sections.range.toolLabels.${t.id}`, 'data-copy-else': t.name }));
  });
  return el('p', { class: 'tools' }, [
    el('span', { class: 'tools__label', copy: 'sections.range.toolsLabel' }),
    ': ',
    ...parts,
  ]);
}

function languages(cv) {
  return el('div', { class: 'languages' }, [
    el('h3', { class: 'subheading', copy: 'sections.range.languagesLabel' }),
    el('ul', { class: 'languages__list' }, cv.meta.languages.map((l) =>
      el('li', { class: 'language' }, [
        el('span', { copy: `languages.${l.id}.name` }),
        el('span', { class: 'language__level', copy: `languages.${l.id}.level` }),
      ]))),
  ]);
}

/** The 18-spoke radar, reproduced from cv.json by the rules in 04-ui-spec.md §5.2. */
function radar(cv, copy, lang, refreshers) {
  const { items, groups } = R.spokes(cv.skills.technical);
  const levels = items.map((s) => s.level);

  const label = (s) => resolve(copy, `sections.range.radarLabels.${s.id}`, lang) ?? s.name;

  const rings = R.RINGS.map((r, i) =>
    svg('circle', {
      class: `radar__ring${i === R.RINGS.length - 1 ? ' radar__ring--edge' : ''}`,
      cx: R.CENTRE, cy: R.CENTRE, r,
    }));

  const spokeLines = items.map((_, i) => {
    const p = R.point(i, 150);
    return svg('line', { class: 'radar__spoke', x1: R.CENTRE, y1: R.CENTRE, x2: p.x.toFixed(1), y2: p.y.toFixed(1) });
  });

  const wedges = groups.map((g) =>
    svg('path', {
      class: 'radar__wedge', d: R.wedgePath(levels, g.from, g.to),
      'data-group': g.id, style: `--group-tone: var(--tone-${g.id})`,
    }));

  const labels = items.map((s, i) => {
    const p = R.labelPoint(i);
    const t = svg('text', {
      class: 'radar__label', x: p.x.toFixed(1), y: p.y.toFixed(1),
      'text-anchor': R.labelAnchor(i), 'data-group': s.group, 'data-spoke': s.id,
    }, [document.createTextNode(label(s))]);
    t.append(svg('tspan', { class: 'radar__label-level', dx: '5' }, [
      document.createTextNode(fill(lookup(copy, 'microcopy.levelFormat', lang), { level: s.level })),
    ]));
    return t;
  });

  // A11: the group's own name set along its own arc, so the link between a list
  // and its wedge survives with colour removed.
  const arcDefs = svg('defs');
  const groupLabels = groups.map((g) => {
    const pathId = `radar-arc-${g.id}`;
    arcDefs.append(svg('path', { id: pathId, d: R.groupArcPath(g.from, g.to), fill: 'none' }));
    const text = svg('text', {
      class: 'radar__grouplabel', 'data-group': g.id, style: `--group-tone: var(--tone-${g.id})`,
    });
    const tp = svg('textPath', { href: `#${pathId}`, startOffset: '50%', 'text-anchor': 'middle' },
      [document.createTextNode(lookup(copy, `sections.range.groups.${g.id}`, lang))]);
    text.append(tp);
    text.__label = tp;
    return text;
  });

  const ticks = [
    svg('text', { class: 'radar__tick', x: 206, y: 195 }, [document.createTextNode('1')]),
    svg('text', { class: 'radar__tick', x: 206, y: 64 }, [document.createTextNode('5')]),
  ];

  const title = svg('title', { id: 'radar-title' });
  const desc = svg('desc', { id: 'radar-desc' });

  // G4: levelAriaFormat is used, to build the <desc> from all eighteen pairs.
  const refresh = (l) => {
    title.textContent = lookup(copy, 'sections.range.radarTitle', l);
    const format = lookup(copy, 'microcopy.levelAriaFormat', l);
    const pairs = items.map((s) =>
      fill(format, { skill: resolve(copy, `sections.range.skillLabels.${s.id}`, l) ?? s.name, level: s.level }));
    desc.textContent = `${lookup(copy, 'sections.range.radarDescription', l)} ${pairs.join('. ')}.`;
    for (const [i, s] of items.entries()) {
      labels[i].firstChild.nodeValue = resolve(copy, `sections.range.radarLabels.${s.id}`, l) ?? s.name;
    }
    for (const [i, g] of groups.entries()) {
      groupLabels[i].__label.textContent = lookup(copy, `sections.range.groups.${g.id}`, l);
    }
  };
  refresh(lang);
  refreshers.push(refresh);

  return svg('svg', {
    class: 'radar', viewBox: R.VIEWBOX, role: 'img',
    'aria-labelledby': 'radar-title radar-desc',
  }, [title, desc, arcDefs, ...rings, ...spokeLines, ...wedges, ...ticks, ...labels, ...groupLabels]);
}

/* --- 6 · human footer ----------------------------------------------------- */

function footer(cv) {
  const f = new DocumentFragment();
  add(f, [
    el('div', { class: 'section__head' }, [
      el('h2', { class: 'section__heading', copy: 'sections.footer.heading' }),
    ]),
    el('dl', { class: 'footer__dl' }, [
      el('div', {}, [
        el('dt', { class: 'subheading', copy: 'sections.footer.interestsLabel' }),
        el('dd', {}, [el('ul', { class: 'footer__list' }, cv.interests.map((_, i) =>
          el('li', { copy: 'interests.items', 'data-copy-index': String(i) })))]),
      ]),
      el('div', {}, [
        el('dt', { class: 'subheading', copy: 'sections.footer.hobbiesLabel' }),
        el('dd', {}, [el('ul', { class: 'footer__list' }, cv.hobbies.map((_, i) =>
          el('li', { copy: 'hobbies.items', 'data-copy-index': String(i) })))]),
      ]),
    ]),
    // Render what exists, invent nothing (04-ui-spec.md G2).
    el('div', { class: 'footer__links' }, (cv.meta.links ?? []).map((l) =>
      el('a', { href: l.url, rel: 'me noopener' }, [
        el('span', { copy: `microcopy.link${l.label}`, 'data-copy-else': l.display || l.label }),
      ]))),
    el('div', { class: 'footer__bottom' }, [langToggle()]),
  ]);
  return f;
}

/** copy.json owns the bullet budget; render.js reads the counts from it. */
export function setBulletCounts(copy) {
  bulletCounts = Object.fromEntries(
    Object.entries(copy.roles ?? {}).map(([id, r]) => [id, (r.bullets ?? []).length]));
}

/* --- packing --------------------------------------------------------------
   The only step that needs real layout: label widths are computed from the
   container's measured width, then rows are packed so labels cannot collide.
   Called after first paint and again, debounced, on resize. */

/**
 * Fit the radar's frame to its own content.
 *
 * 04-ui-spec.md §5.2 fixes the viewBox at "-118 -48 636 516". Measured in a
 * browser that clips the two longest right-hand spoke labels ("Strategic
 * Planning 4/5" reaches x = 533 against a right edge of 518) while wasting 165
 * units of empty height. The geometry inside the frame — every coordinate §5.2
 * verifies — is untouched; only the frame moves, and it is now derived, so
 * renaming a skill to something longer can never clip it.
 *
 * The minimum width follows from the frame: A9 requires the 17-unit spoke
 * labels to render at 15 CSS px or more.
 */
/**
 * Push crowded spoke labels outward along their own spokes until none overlap.
 *
 * 04-ui-spec.md §5.2 sets every label at a constant radius of 162. Near the
 * vertical axis that crowds: spokes 0 and 1 are 20 degrees apart but their
 * labels differ by only 10 units of height, so "Product Mgmt" collides with
 * both "Product Ownership" and "Figma", and the same happens at the bottom.
 * Measured, four pairs overlap at every width, in both languages — it is the
 * geometry, not the scale, and the handoff had it too.
 *
 * The constant radius is therefore a starting position rather than a fixed one.
 * A label only ever moves along its own spoke, so its angle — the thing that
 * ties it to its data point — is never changed. Runs before fitRadar, which
 * then frames whatever this produced.
 */
export function relaxRadarLabels(root) {
  const svg = root.querySelector('.radar');
  if (!svg) return;
  const labels = [...svg.querySelectorAll('.radar__label')];
  // Both measuring passes run inside the language switch, so a environment
  // without SVG layout must not take the whole render down with it.
  if (!labels.length || typeof labels[0].getBBox !== 'function') return;
  const radii = labels.map(() => R.LABEL_R);

  const place = (i) => {
    const p = R.point(i, radii[i]);
    labels[i].setAttribute('x', p.x.toFixed(1));
    labels[i].setAttribute('y', (i === 9 ? p.y + 4 : p.y).toFixed(1));
  };
  labels.forEach((_, i) => place(i));

  // getBBox() returns {x, y, width, height} — not a DOMRect, so there is no
  // .right or .bottom to compare against.
  const gap = 2;
  const overlaps = (a, b) =>
    a.x < b.x + b.width + gap && b.x < a.x + a.width + gap
    && a.y < b.y + b.height + gap && b.y < a.y + a.height + gap;

  // Move the one nearer the vertical axis: that is where pushing outward buys
  // the most vertical separation.
  const vert = (k) => Math.abs(Math.sin((k * R.STEP_DEG * Math.PI) / 180));
  const MAX_R = R.LABEL_R + 70;
  const boxes = labels.map((t) => t.getBBox());

  for (let pass = 0; pass < 24; pass++) {
    let moved = false;
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        if (!overlaps(boxes[i], boxes[j])) continue;
        const k = vert(i) < vert(j) ? i : j;
        if (radii[k] >= MAX_R) continue;
        radii[k] = Math.min(radii[k] + 7, MAX_R);
        place(k);
        // Refresh immediately: comparing against a stale box re-pushes a label
        // that is already clear, and the radius runs away.
        boxes[k] = labels[k].getBBox();
        moved = true;
      }
    }
    if (!moved) break;
  }
}

export function fitRadar(root) {
  const svg = root.querySelector('.radar');
  if (!svg || typeof svg.getBBox !== 'function') return;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const node of svg.querySelectorAll('text, circle, path, line')) {
    if (node.closest('defs')) continue;
    const b = node.getBBox();
    if (!b.width && !b.height) continue;
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
  }
  if (!Number.isFinite(x0)) return;
  const pad = 8;
  const w = x1 - x0 + pad * 2;
  const h = y1 - y0 + pad * 2;
  svg.setAttribute('viewBox', `${(x0 - pad).toFixed(1)} ${(y0 - pad).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  svg.style.minWidth = `${Math.ceil((15 / 17) * w)}px`;
  syncRadarScroll(svg.parentElement);
}

/**
 * A scrollable region needs keyboard access, but a tab stop with nothing to do
 * is defect A7 all over again. So the container is focusable exactly while it
 * actually overflows — on a phone, and not on a desktop.
 */
export function syncRadarScroll(box) {
  if (!box) return;
  const scrolls = box.scrollWidth > box.clientWidth + 1;
  if (scrolls) {
    box.setAttribute('tabindex', '0');
    box.setAttribute('role', 'region');
    box.setAttribute('aria-labelledby', 'radar-title');
  } else {
    box.removeAttribute('tabindex');
    box.removeAttribute('role');
    box.removeAttribute('aria-labelledby');
  }
}

const ROW_REM = 2.75;
const LABEL_ABOVE = '-1.15rem';
const LABEL_BELOW = '1.35rem';

export function packTimeline(root) {
  const timelineEl = root.querySelector('.timeline');
  if (!timelineEl) return;

  // Below 900px the timeline is vertical and labels stack beside their bars;
  // packing is a horizontal-only concern. The threshold is CSS's, read back
  // from the rendered element rather than from window.innerWidth (A1).
  const vertical = getComputedStyle(timelineEl.querySelector('.timeline__axis')).display === 'none';

  for (const lane of timelineEl.querySelectorAll('.timeline__lane')) {
    const track = lane.querySelector('.timeline__track');
    const width = track.getBoundingClientRect().width;
    const labels = [...lane.querySelectorAll('.band__label')];
    if (!width || !labels.length) continue;

    const isWork = lane.classList.contains('timeline__lane--work');

    if (vertical) {
      for (const label of labels) {
        label.style.setProperty('--band-row', '0');
        label.style.removeProperty('--label-offset');
      }
      for (const band of lane.querySelectorAll('.band')) band.style.setProperty('--band-row', '0');
      continue;
    }

    const fontPx = parseFloat(getComputedStyle(labels[0]).fontSize) || 12;
    const items = labels.map((label) => ({
      left: parseFloat(label.style.getPropertyValue('--band-start')),
      extent: T.labelExtent(label.textContent, fontPx, width),
    }));

    const rows = T.packRows(items, isWork ? 2 : Infinity);
    const bands = [...lane.querySelectorAll('.band')];

    labels.forEach((label, i) => {
      const row = rows[i];
      if (isWork) {
        // Bars share one baseline; only the labels alternate above and below.
        label.style.setProperty('--band-row', '1');
        label.style.setProperty('--label-offset', row === 0 ? LABEL_ABOVE : LABEL_BELOW);
        bands[i].style.setProperty('--band-row', '1');
      } else {
        // The studies bars overlap in time, so bars move too.
        label.style.setProperty('--band-row', String(row));
        label.style.setProperty('--label-offset', LABEL_BELOW);
        bands[i].style.setProperty('--band-row', String(row));
      }
    });

    if (!isWork) {
      const needed = Math.max(...rows) + 1;
      track.style.height = `${needed * ROW_REM + 1.6}rem`;
    }
  }
}
