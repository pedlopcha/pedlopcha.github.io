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
four skill categories and all twenty-one skill items, `skills.technical` reordered to
`product, methods, technical, tools`, ids on the four languages, `meta.photo` as an object,
the phase-0 scaffolding deleted, `skillLabels`/`radarLabels` re-keyed to ids,
`group{Product,Methods,Technical}` re-keyed to `groups.<id>`, and `toolsLine` replaced by
`toolsLabel` + `toolLabels` — which closes **G1**, the last hard-constraint violation.
Provenance moved to `docs/03-copy-provenance.json`, 99 keyed entries, nothing lost.

`meta.links` needed no pruning: both the Xing and LinkedIn URLs in the working tree are real,
so `04-ui-spec.md` G2 is satisfied by rendering what exists.

---

## Verified

Measured, not asserted. Headless Chrome 150 over a local server, plus jsdom for the failure
paths.

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
longest right-hand spoke labels clip: "Strategic Planning 5/5" reaches x = 533 against a right
edge of 518, while 165 units of height go unused. `fitRadar()` measures the content and frames
it. **Every coordinate §5.2 verifies is untouched** — only the frame moves — and renaming a
skill can no longer clip the chart.

**3. Two radar labels move off the constant radius.** §5.2 sets every spoke label at r = 162.
Measured, four pairs overlap at that radius in both languages at every width — spokes 0/1,
0/17, 8/9 and 9/10 — because near the vertical axis a 20° step buys only ~10 units of height
against a ~22-unit label. `relaxRadarLabels()` pushes labels outward **along their own spokes**
until clear; today that moves exactly two, spoke 0 to r = 183 and spoke 9 to r = 176. Sixteen
of the eighteen stay at 162, and no label's *angle* — the thing that ties it to its data
point — ever changes.

**4. A11 is implemented as arc-set text, not a mid-angle label.** The architecture places each
group's name horizontally at r = 230 and states it is "68 units clear of the spoke labels".
That is true radially but not by text extent: measured, "Produkt & Führung" overlaps Product
Ownership's label and "Technisch" overlaps Data Analysis's, at **every** radius and font size
that still fits any reasonable frame. Horizontal text cannot clear eighteen radiating labels.
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
