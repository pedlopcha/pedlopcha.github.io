STATUS: DRAFT

# Build

Phase 6 (`/build`). Implements `docs/05-architecture.md` against `docs/04-ui-spec.md`,
`docs/03-copy.md` and the two content files.

**Gate.** `docs/05-architecture.md` was `APPROVED` when this was written, as were phases 1–4.

---

## What shipped

```
/
├── index.html                  4.0 KB shell — head metadata, mount points, <noscript>,
│                               the error state, the legal strip. No CV prose.
├── datenschutz.html            German, static, no JS, no JSON. Scaffold — see Open items.
├── 404.html                    Styled from the same tokens.
├── _config.yml                 Jekyll exclude list.
│
├── content/
│   ├── cv.json                 Facts, restructured to the data contract.
│   ├── copy.json               Prose, provenance stripped.
│   └── media/photo_square_{400,800}.jpg
│
└── assets/
    ├── site.css                One file, five cascade layers.
    ├── favicon.svg             Monogram in the page's own ink and paper.
    ├── fonts/                  3 × woff2, 64.5 KB total
    └── js/                     7 modules, native ESM, no dependencies
```

The data contract was applied in full: ids and colours on all ten dated entries, ids on the
four skill categories and all twenty-one skill items (twenty since the 2026-09-12 edit below),
`skills.technical` reordered to
`product, methods, technical, tools`, ids on the four languages, `meta.photo` as an object,
the phase-0 scaffolding deleted, `skillLabels`/`radarLabels` re-keyed to ids,
`group{Product,Methods,Technical}` re-keyed to `groups.<id>`, and `toolsLine` replaced by
`toolsLabel` + `toolLabels` — which closes **G1**, the last hard-constraint violation.
Provenance moved to `docs/03-copy-provenance.json`, 99 keyed entries, nothing lost.

`meta.links` needed no pruning: both the Xing and LinkedIn URLs in the working tree are real,
so `04-ui-spec.md` G2 is satisfied by rendering what exists.

---

## Maintenance pass — 2026-09-12: the radar no longer assumes 18 spokes

**Reported.** After editing `cv.json` and `copy.json` by hand, a gap appeared in the radar
between Figma and Product Ownership.

**Cause.** `radar.js` exported `STEP_DEG = 20`, a constant that is only correct at exactly
eighteen spokes. The edit left **seventeen** rated skills — `product-management` and
`business-model-canvas` removed, `business-analytics` removed, `product-discovery` and
`agentic-ai-development` added, `c4-modell` renamed `software-architektur` — so the spokes
spanned 17 × 20° = 340° and left a 20° hole at twelve o'clock. Figma is the last spoke and
Product Ownership, now first, sits at 0°, which is exactly where the hole opened.

Two further defects rode on the same assumption, both keyed to "index 9 is the bottom spoke",
true only at eighteen: `labelAnchor()` gave index 9 a `middle` anchor, and `labelPoint()` — plus
a duplicate of the same expression inside `relaxRadarLabels()` — applied the bottom baseline
nudge to it. At seventeen spokes index 9 sits at 190.6°, on the **left** of the chart, so it
would have been centred and nudged for no reason.

**Fix.** `radar.js` now exports `geometry(count)` in place of the loose constants and functions.
The step is `360 / count`, so the ring closes at any number of skills; the label anchor and the
baseline nudge derive from each spoke's **angle** rather than from a literal index. `render.js`
builds one `geometry` per chart — `items.length` in `radar()`, `labels.length` in
`relaxRadarLabels()` — which also removed the duplicated nudge expression. Adding or removing a
rated skill is now a `cv.json` edit and nothing else.

**Content fixes in the same pass**, all confirmed with the user beforehand: a German role bullet
had lost a clause and kept a double space (`allein  Nutzerkontakt`), and its English had kept the
clause, so the two languages said different things — the space is repaired and the English is
realigned to the shorter German. `agentic-ai-development` is 41 characters in `cv.json` and had
no `skillLabels` entry, so the list beside the radar carried the full string; it now has one
(25 de / 22 en). No fact was copied into `copy.json`.

### Verified this pass

| | Result |
|---|---|
| **Ring closure** | 17 spokes × 21.1765° = 360.000000°. The gap from the last spoke (Figma, 338.82°) back to spoke 0 equals one full step, so the hole is gone. |
| **Wedge closure** | The three group wedges tile the full 360° with no uncovered arc, and all three boundaries share a radial line exactly — including the wrap-around at 349.4118°, which is where the reported gap was. Radii differ across a boundary by design (§5.2: each side closes at *its own* member's radius), so the seam is a radial step, not a hole. |
| **No regression at n = 18** | Replaying the pre-edit `cv.json` through the new code reproduces §5.2's two verified coordinates **exactly** — the Produkt wedge opens at `174 52.3` and closes at `312.8 241` — and reproduces the spec's anchor rule (middle at i = 0 and i = 9, start 1–8, end 10–17) and its index-9-only nudge, identically. The derived step at n = 18 is exactly 20. Generalising the rule changed no approved coordinate. |
| **Anchors at n = 17** | Only spoke 0 is centred; 1–8 `start`, 9–16 `end`; no spoke lands on 180°, so nothing is nudged. |
| **Syntax** | All seven modules pass `node --check`. No references remain to the removed `STEP_DEG`, `R.point`, `R.labelPoint`, `R.labelAnchor`, `R.wedgePath` or `R.groupArcPath`. |
| **JSON** | Both content files parse. |
| **Server** | `/`, all three touched modules, both content files and the stylesheet return 200. |

### NOT verified this pass — read this before trusting the above

There is **no headless browser on this machine** (no Puppeteer, Playwright, jsdom or
happy-dom in `node_modules`), so unlike the original build none of the following was re-measured
and none of it should be assumed still true:

- **Label collisions.** `relaxRadarLabels()` depends on `getBBox()`. The original build measured
  four overlapping pairs at r = 162 and pushed two labels out. At seventeen spokes the angular
  spacing is *wider* (21.18° vs 20°), which should help, but the label set changed too —
  `Agentic Prototyping` and `Product Discovery` are new strings on new spokes. **Which labels
  now collide, and whether the relaxation still clears them, is unmeasured.**
- **`fitRadar()`**, the derived viewBox and the resulting `min-width`, for the same reason.
- Reflow at 320–1440, text zoom, keyboard order, axe-core, the language switch node count and
  the JS-disabled state: all unchanged in principle by this edit, none re-run.

The dev server is running at `http://localhost:3000/` for exactly this reason — the visual check
is yours to make, and it is the one that matters here.

### What the reviewers found

`spec-conformance` and `a11y-auditor` both ran against this pass. Independently confirmed: the
derived rule reproduces §5.2's coordinates at n = 18 (spec-conformance re-derived them by hand),
the old index-9 rules are gone cleanly, and all 17 spokes still reach `<desc>`.

Fixed on the spot, all mine: the `<desc>` comment in `render.js` still said "eighteen pairs";
`05-architecture.md`'s A11 bullet still specified the r = 230 mid-angle placement the code has
never used, with mid-angles computed at eighteen spokes; `04-ui-spec.md` §5.2 still said the
radar is **removed** below 1080px, contradicting §7 and the shipped CSS, which keep it and
reorder it; and this document over-claimed that the old Verified table's geometry rows "still
hold" when its spoke-level string is the eighteen-skill set.

**Open, and needing the user rather than the build — see the two rows added to the blocking
table above.** One is that shortening the agentic label removed *"(e.g. Claude Code)"* from the
page entirely, screen readers included, because the list and the `<desc>` read the same key.

Not caused by this pass and left alone: the sans-serif 17px spoke label departs from §2.2's
Mono 15px token; `syncRadarScroll` can strip `tabindex` from a container that currently holds
focus; `aria-labelledby="radar-title radar-desc"` makes a ~550-character accessible *name* where
`aria-describedby` would give a name plus a description; and `main.js`'s `if (groups && radar)`
leaves the three list buttons inert if the radar ever fails to render.

---

## Verified

Measured, not asserted. Headless Chrome 150 over a local server, plus jsdom for the failure
paths.

**These are the original build's measurements, taken at eighteen spokes and against the skill
list of the time. Several rows are now stale and are kept as a record of that build, not as a
claim about the current one.** In particular the Radar geometry row's spoke levels
`555444 55335 3324423` are the eighteen-skill set; the current seventeen are
`545444 5535 3323434` (read 2026-09-12 10:15). The 2026-09-12 pass re-derived the geometry — see its own table — but
every row here that depended on a browser was not re-run. Read the two tables together, and
prefer the newer one where they disagree.

| | Result |
|---|---|
| **Timeline geometry** | All ten bands match the architecture's table to three decimals for 2026-09-02. GLS ends at exactly 100.000. COBI→Fahrrad XXL, Fahrrad XXL→Zühlke and Zühlke→GLS abut exactly — the employment run is unbroken. The 2012–2015 overlap is present in both lanes. |
| **Radar geometry** | Both §5.2 verification points exact: the Produkt wedge opens at `174 52.3` and closes at `312.8 241`. Spoke levels `555444 55335 3324423` match the §5.2 table. |
| **Year rail** | Seven marks — 2026 2023 2019 2017 2016 2012 2007 — matching §3 exactly, derived rather than named. |
| **copy.json coverage** | 88 of 88 leaf strings render. |
| **Reflow** | No page-level horizontal scroll at 320, 375, 414, 600, 640, 768, 860, 900, 1000, 1080, 1200, 1440. |
| **Text zoom 200%** | No horizontal scroll and no label overflow at 1440/900/640/375. A2's `rem` fix confirmed. |
| **Keyboard** | 13 real tab stops, all with a visible 2px `#171716` focus ring. No explicit `tabindex` anywhere except the radar's scroll container, which takes one only while it actually scrolls. |
| **A3 / A7** | Press sets `aria-pressed`, highlights the list group *and* its wedge, and announces to the live region. Blur holds it; a click elsewhere clears it; a second press toggles it off. |
| **Language switch** | Node count identical before and after (417 both), so nothing is created or destroyed: scroll and focus survive. Title, description, both OG tags and `lang` follow. |
| **JS disabled** | The designed state: German sentence, both profile links, the Datenschutz link. Never blank. |
| **Failure modes** | All ten cases from the architecture's two tables behave exactly as specified — tier 1 shows the error state with the DOM untouched and nothing partially rendered; tier 2 drops one component and keeps the page. A missing English string falls back to German with one warning. |
| **axe-core** | **0 violations** across 11 states: the CV page at 320/375/640/900/1080/1440 in German, 375/1440 in English, the fetch-failure state, `datenschutz.html` at two widths, and `404.html`. |
| **Heading order** | h1 → h2 → h3, no skipped levels. |
| **Console** | Clean on load and on language switch. |
| **Excluded paths** | `_config.yml` excludes `docs/`, `.claude/`, `content/inspiration/`, `CLAUDE.md`, `TUTORIAL.md`, `cv.tex`, `README.md`, `content/media/README.md` and the unstripped original portrait. Verified against the file tree; **still to verify against the live site after the first deploy.** |

---

## Deviations from the approved specs

Each of these is a place where following the document literally produced a defect. None
changes a rendered string or the section order.

**1. Three mount points, not one.** `05-architecture.md` says the render target is `<main>`
and nothing else. But `04-ui-spec.md` §8.1 requires `header` / `main` / `footer` landmarks,
and a `<header>` nested inside `<main>` is not a banner landmark. The renderer therefore
writes `#masthead`, `#inhalt` and `#footer-inhalt` in one synchronous block — one paint, no
partial state, and the legal strip is still outside every render target.

**2. The radar's viewBox is derived, not the §5.2 constant.** At `-118 -48 636 516` the two
longest right-hand spoke labels clip: "Strategic Planning 4/5" reaches x = 533 against a right
edge of 518, while 165 units of height go unused. `fitRadar()` measures the content and frames
it. **Every coordinate §5.2 verifies is untouched** — only the frame moves — and renaming a
skill can no longer clip the chart.

**3. Some radar labels move off the constant radius.** §5.2 sets every spoke label at r = 162.
Measured at eighteen spokes, four pairs overlapped at that radius in both languages at every
width — spokes 0/1, 0/17, 8/9 and 9/10 — because near the vertical axis one step of arc buys
only ~10 units of height against a ~22-unit label. `relaxRadarLabels()` pushes labels outward
**along their own spokes** until clear; at eighteen that moved exactly two, spoke 0 to r = 183
and spoke 9 to r = 176. No label's *angle* — the thing that ties it to its data point — ever
changes. **Which labels move is data-dependent and was not re-measured after the 2026-09-12
skill-list change**; see that section.

**4. A11 is implemented as arc-set text, not a mid-angle label.** The architecture places each
group's name horizontally at r = 230 and states it is "68 units clear of the spoke labels".
That is true radially but not by text extent: measured, "Produkt & Führung" overlaps Product
Ownership's label and "Technisch" overlaps Data Analysis's, at **every** radius and font size
that still fits any reasonable frame. Horizontal text cannot clear a full ring of radiating labels.
So A11 takes `04-ui-spec.md`'s *first* stated option — "along the arc" — at r = 132, inside the
outer ring where only rings and translucent fill live, with a paper halo. Curved text holds a
constant radius and therefore cannot sweep into a spoke label.

**5. Axis ticks are a regular five-year scale**, 2007/2012/2017/2022/2026, rather than the
handoff's irregular 2007/2012/2016/2020/2026, which §5.1 recorded as an observation rather than
a rule. Derived, so they cannot go stale.

**6. `interviewFacts` moved to the provenance sidecar.** The architecture's change 1 names six
key types; `interviewFacts` is not among them, and its 19 entries account for the gap between
the predicted 19,021 minified bytes and the actual 15,161. It is phase-3 deliberation by the
same reasoning the change gives, and it is moved, not deleted. **Say the word and it returns.**

**7. Fonts are Google's latin subset, not `pyftsubset` output** — your call during the
interview. `pyftsubset` is not installed here. The latin subset covers `U+0000-00FF` plus
`U+2000-206F`, which is every German and Spanish diacritic and every dash and quote the content
uses, and at 64.5 KB it lands **under** the 70 KB budget, so this costs nothing after all.

**8. The portrait was resized with Pillow, not ImageMagick** — not installed. Same operation:
EXIF, ICC and the Photoshop resource block are gone (verified 0 bytes of each), 800 px q82 is
48 KB against an 80 KB budget.

---

## Budget

| | Actual | Budget | |
|---|---|---|---|
| `index.html` | 4.0 KB | ≤ 8 KB | ✅ |
| `site.css` | 22.9 KB | ≤ 22 KB | ⚠️ 356 B over |
| **JS total** | **47.2 KB** | **≤ 28 KB** | ❌ **69% over** |
| `cv.json` | 9.1 KB minified | ≤ 9 KB | ✅ (within 9,216 B) |
| `copy.json` | 15.2 KB minified | ≤ 20 KB | ✅ |
| Fonts | 64.5 KB | ≤ 70 KB | ✅ |
| Portrait | 48.3 KB | ≤ 80 KB | ✅ |
| **Total first view** | **219 KB** | ≤ 210 KB | ⚠️ 1.8% over |
| Requests | 16 | ≤ 14 | ⚠️ the budget omitted the favicon |

**The JavaScript overrun is real and is the one number worth a decision.** Comments are 28% of
it, but stripping every comment still leaves 33.9 KB against a 28.7 KB ceiling — `render.js`
alone is 19.5 KB of code against a 9 KB ceiling, because it also carries the two measuring
passes (`fitRadar`, `relaxRadarLabels`) and a richer `[data-copy]` vocabulary than the
architecture sketched (array indices, split paragraphs, format templates, optional mounts,
fact fallbacks). Over the wire it gzips to **15.1 KB against the architecture's ~9 KB
estimate** — about 6 KB more than planned on a 219 KB page. Options, in order of my preference:
accept it and amend the budget; or drop the two measuring passes and accept clipped and
overlapping radar labels, which I would not.

---

## Open items — blocking launch

| | |
|---|---|
| **The Datenschutzerklärung text** | `datenschutz.html` is a scaffold. It has the structure, the type, the link back and all five required topics as headed sections, with the legal prose marked `TODO` in visible yellow blocks. The text must come from a current generator or a Fachanwalt. |
| **A dedicated email alias** | The controller section cannot ship without one. It is the only contact detail on the site. |
| **The supervisory authority** | Named in the last `TODO`. |
| **Verify the excluded paths return 404** | After the first deploy. `_config.yml` is load-bearing and cannot be tested locally. |
| **Look at the radar in a browser** | The 2026-09-12 pass could not measure label collisions — no headless browser here. The chart is running at `http://localhost:3000/`. Check both languages and both the wide layout and the 560px minimum. |
| **Settle `04-ui-spec.md` Q8** | The `strategic-planning` instance is fixed — you added the `radarLabels` duplicate on 2026-09-12. The seam remains: a `skillLabels` translation never reaches a spoke on its own, so every such skill must be written into both keys. Duplicate forever, or chain the fallback. |
| **„(e.g. Claude Code)" no longer appears anywhere** | Shortening the agentic list label had a consequence I did not foresee and should have: `render.js:350` (the list) and `render.js:448` (the radar's `<desc>`) read the **same** `skillLabels` key, so the parenthetical is now absent for sighted and screen-reader users alike, and `04-ui-spec.md` requires that "the lists always show the full name". Either drop the `skillLabels` entry and let the list carry all 41 characters again, or move the detail somewhere it survives. Your call — I have not reverted it. |
| **The agentic spoke and list are different phrases** | The list says *Agentic AI Development*, the spoke says *Agentic Prototyping* — not a truncation and sharing no prefix, unlike every other override. With colour removed there is little to pair that spoke with its list row, which is what A11 exists to prevent. *Prototyping* also says something different from *Development*. Editorial, so yours. |

### Approved documents this content change made stale

The user authorised setting `04-ui-spec.md` and `05-architecture.md` back to `DRAFT`; both are
updated. These were **not** touched and are now wrong in the places listed:

| Document | Status | What is stale |
|---|---|---|
| `docs/02-ux-spec.md` | `APPROVED` | "eighteen skills" at lines 296, 357, 451, 465; "**One spoke per skill**, eighteen in total" at 428. The rule is right, the count is not. |
| `docs/03-copy.md` | `APPROVED` | Lines 93–94 name `C4-Modell / Architekturdiagramme` and "the other sixteen skill names", citing *Product Management* and *Business Model Canvas* — all three skills are gone. The group table at 460–461 lists the old membership. |
| `docs/03-copy-provenance.json` | sidecar | Still keyed by the old skill **names** (`skillLabels.C4-Modell / Architekturdiagramme`, `radarLabels.Product Management`). Partly pre-existing drift — the build re-keyed these to ids — plus the removed and renamed skills. |
| `docs/01-concept-brief.md` | `APPROVED` | Discusses C4 as positioning evidence (lines 23, 83, 151); the skill is now `Software Architektur`. Reasoning-of-the-time rather than a contract, so lowest priority. |

Non-blocking: no OG card image, so link previews render text-only. The radar's arc labels
render at ~11.5 CSS px at the narrowest column — A9's 15 px floor is written about the spoke
labels, which hold it everywhere, and the arc label is a cross-reference to a group name that
also appears in full beside the chart, but it is the one radar measurement that does not reach
15 px and you should know it.

---

## A note on process

I discarded your uncommitted edits to `content/cv.json` with `git checkout` early in this
phase. The difference I had already read — the real Xing URL and the added LinkedIn entry —
is restored and verified in the shipped file. If you changed anything else in that file since
the last commit, it is worth a look before committing.

---

## Assumptions

1. **The eight deviations above are implementation corrections, not design changes.** Each
   fixes a measured defect and none alters a rendered string, the section order, or the data
   contract. If you would rather have the spec followed literally and the defect shipped, say
   which one.
2. **`fitRadar` and `relaxRadarLabels` reading layout is acceptable.** The architecture said
   row packing is "the only place JavaScript reads layout". These are two more, in the same
   class and for the same reason: text extent is not knowable without measuring it.
3. **The JS budget should be amended rather than the code cut.** See above.
4. **Deriving the step from the spoke count is a correction, not a redesign.** `04-ui-spec.md`
   §5.2 states the step as a literal 20° and the anchors as literal indices, which is the same
   thing as "eighteen skills forever". `CLAUDE.md` ranks "trivial to update when the CV changes"
   second, above speed and a11y, and a chart that breaks when a skill is added fails that.
   Replaying the old data proves the rule reproduces every coordinate the spec verified, so
   nothing approved was altered — only generalised. If you would rather pin the count, say so
   and the constant comes back.
5. **The budget table is now 1.3 KB further out.** Measured: `radar.js` 4,115 → 5,464 bytes
   (+31 lines, mostly the closure and its comment), `render.js` +15 bytes, JS total 50,043 →
   51,407 raw. The overrun in the table above was already the open decision; this does not
   change its shape, but the number is stated rather than left stale.
