STATUS: APPROVED

# Architecture

Phase 5. Decides how the site is built, what shape the data takes, and what phase 6 may not
improvise. No application code is written here.

**Gate.** `01-concept-brief.md`, `02-ux-spec.md`, `03-copy.md` and `04-ui-spec.md` were all
`APPROVED` when this was written. `02-ux-spec.md` was amended to **revision 6** in the same turn,
at the user's explicit instruction, and re-approved by them. This document is written against
revision 6.

---

## Decision

**The page is rendered in the browser from `content/cv.json` and `content/copy.json`, which
GitHub Pages serves as ordinary static assets. There is no build step, no Node, no bundler and no
GitHub Actions workflow.** The shipped repository *is* the shipped site.

This is the user's decision, taken twice: first when the scheduled rebuild was rejected as
overengineering, and again in the message that produced UX revision 6. It is option B in the
architect skill's own framing, and the skill's recommended option C is explicitly ruled out.

What it costs, restated so phase 6 does not rediscover it as a surprise:

| | |
|---|---|
| **JS disabled** | The page renders no CV content. A designed `<noscript>` state replaces it. This is the largest concession in the project and it is deliberate. |
| **Crawlers and unfurlers** | See below — the four head strings are duplicated into `index.html` so link previews work. Body content is not indexed by anything that does not execute scripts. |
| **First paint** | The content cannot paint until two same-origin fetches complete. Mitigated by `<link rel="preload">`, which starts both during HTML parse rather than after it. |
| **Bilingual** | One document, script toggle. Two indexable language URLs are given up. |

What it buys, which is what the user asked for: **the timeline axis ends in the current month, on
every page load, forever, with nobody touching the repository.** No build can promise that.

### The one thing that is generated, and why it is not a build step

Fonts and the portrait are **prepared once and committed**, exactly like any other binary asset.
Running `pyftsubset` or ImageMagick by hand on a file that changes once every few years is asset
preparation, not a build: nothing runs on push, nothing runs on a schedule, and the repository
never contains a file that is stale with respect to a source it is derived from without a human
having caused it. Commands are given in *Assets*.

### Rejected

- **Hand-written HTML** — violates `CLAUDE.md`'s single-source rule outright. Not viable.
- **Build-time render** — the user's decision. Note for the record that if the no-build
  constraint is ever relaxed, this document degrades to it cleanly: the renderer functions are
  pure `(cv, copy, lang) → DOM`, so running them in Node against `jsdom` and writing the result to
  `index.html` is a fifty-line script, and nothing else in this architecture changes.
- **A charting library** — settled by `04-ui-spec.md` §5.0, reasons 1–4. Not reopened.
- **A framework** — forbidden by `CLAUDE.md`.

---

## File structure

Everything below the repository root is served by GitHub Pages unless excluded. That is the
single most consequential fact about this deployment and it is handled in *Deploy*.

```
/
├── index.html                  Shell only. Head metadata, <noscript>, the legal link,
│                               empty mount points. No CV prose. ~6 KB.
├── datenschutz.html            Hand-authored, German, static. No JS, no JSON, no fonts
│                               beyond the two the CV page already caches. Carries no CV
│                               content, so hardcoding its prose is not a violation.
├── 404.html                    Minimal, styled from the same tokens. Links home.
├── _config.yml                 Jekyll exclude list. See Deploy — this is load-bearing.
├── CNAME                       Only if a custom domain is adopted. Absent today.
│
├── content/
│   ├── cv.json                 Facts. Language-neutral. Fetched at runtime.
│   ├── copy.json               Prose, both languages. Fetched at runtime.
│   └── media/
│       ├── photo_square_800.jpg    EXIF-stripped, ~80 KB
│       ├── photo_square_400.jpg    EXIF-stripped, ~25 KB
│       └── README.md               Drop instructions. Excluded from the published site.
│
└── assets/
    ├── site.css                One file. See CSS strategy — with no bundler, one file
    │                           is one request, and four files are permanently four.
    ├── fonts/
    │   ├── archivo-latin.woff2         variable 400–700, latin subset
    │   ├── plex-mono-400-latin.woff2
    │   └── plex-mono-500-latin.woff2
    └── js/
        ├── main.js             Entry. Orchestrates: fetch → validate → render → bind.
        ├── data.js             Fetch, parse, validate. Throws typed errors.
        ├── render.js           cv + copy + lang → DOM. Pure apart from the final append.
        ├── i18n.js             Language state, [data-copy] swapping, lang attribute.
        ├── timeline.js         Date arithmetic, row packing. No DOM knowledge.
        ├── radar.js            Polar geometry, wedge paths. No DOM knowledge.
        └── a11y.js             Focus management, live-region announcements.
```

Seven JS modules, flat: `main.js` imports the other six, and none of them import each other
except through `util` values passed in as arguments. Import depth is 2, so native ES modules cost
one extra round trip and no more. There is no third level.

---

## Data contract

This is what phase 6 must not break. Changes here are the only changes either content file needs.

### Rule

**A fact appears once, in `cv.json`, in no language. Prose appears twice, in `copy.json`, once per
language. A fact in `copy.json` is a defect.** Both files are now public, so a third rule joins
them: **neither file may contain anything the user would not publish**, because both are fetched
by every visitor and readable at their URLs.

### `cv.json` — required changes

| # | Change | Why |
|---|---|---|
| 1 | **Add `id` to every `experience`, `education` and `earlierStations` entry.** The values already exist as `copy.json` keys and must match exactly: `gls`, `zuhlke`, `fahrrad-xxl`, `cobi`; `cadiz-licenciatura`, `kit-exchange`, `sevilla-diplomatura`; `bosch-mobility-media`, `kit-assistant`, `movand`. | Agreed in `04-ui-spec.md` Q7. Today the pairing between a `cv.json` record and its prose is positional and silent. |
| 2 | **Add `color` to the same entries** — the ten hex values in `04-ui-spec.md` §2.1. | Q7. The user maintains them. A missing colour is a loud failure. |
| 3 | **Do not add `tier`.** | Q7's own caveat: the axis moves every load, so a stored tier goes stale with no edit. Computed instead — see *Geometry*. |
| 4 | **Add `id` to each `skills.technical` category**: `product`, `methods`, `technical`, `tools`. | Group labels are currently keyed by the German category string. Renaming a category would silently drop its label and its radar wedge. |
| 5 | **Add `id` to each skill item** — kebab-case of the name: `product-management`, `teamfuhrung`, `c4-modell`, … | `skillLabels` and `radarLabels` are keyed by the German skill *name*. Renaming a skill silently drops its English form. Carried forward from `04-ui-spec.md` G3/G5/G6. |
| 6 | **Reorder `skills.technical` to `product, methods, technical, tools`.** | Array order **is** display order and therefore radar spoke order, which `04-ui-spec.md` §5.2 says must be `Produkt → Methoden → Technisch`. The file is currently `Produkt, Technisch, Methoden, Tools`. Making order the contract removes a field; leaving it removes a bug only until someone reorders. |
| 7 | **Add `id` to each `meta.languages` entry**: `spanish`, `german`, `english`, `french`. | Pairing to `copy.languages.*` is positional today. |
| 8 | **Delete `meta.contact` entirely.** | Its three values are placeholders that must never render, and the file is now public. The one email address on the site lives in `datenschutz.html`, hand-authored. Nothing reads `meta.contact`. |
| 9 | **Delete `meta.placeholders`, `meta.sourceHeadings`, `meta.headlineParts`, `dateRaw`, `resultHighlightIndex`, `projects`, `publications`.** | Extraction scaffolding from phase 0. Nothing renders any of it and it is now shipped to every visitor. `dateRaw` in particular is a pre-formatted duplicate of `start`/`end`, which is the exact drift class the single-source rule exists to prevent. |
| 10 | **Replace `meta.photo` with an explicit object.** | See *Assets*. No filename arithmetic in the renderer. |
| 11 | **`meta.links`: remove any entry whose URL is not real.** | `04-ui-spec.md` G2 — render what exists, invent nothing. The Xing URL is still `https://www.xing.com/profile/`. Either it becomes real or the entry goes; the renderer will not ship a placeholder href, and there is no LinkedIn entry to invent. |

`meta.photo` becomes:

```json
"photo": {
  "src": "photo_square_800.jpg",
  "srcset": [ { "file": "photo_square_400.jpg", "w": 400 },
              { "file": "photo_square_800.jpg", "w": 800 } ],
  "width": 800, "height": 800
}
```

### `copy.json` — required changes

| # | Change | Why |
|---|---|---|
| 1 | **Strip every `_note`, `_alternatives`, `original`, `source`, `_revision` and `_pairing` key.** | Measured: the file is **44,148 bytes, of which 19,021 survive stripping and minification.** More than half the payload every visitor downloads is phase-3 authoring provenance — rejected alternatives, and editorial commentary naming the user and the interview it came from. That is deliberation, not content, and it should not be a public URL. It moves to **`docs/03-copy-provenance.json`** (below), which is excluded from the published site. **No rendered string changes**, so `03-copy.md` stays `APPROVED`. |
| 2 | **Re-key `sections.range.skillLabels` and `radarLabels` from skill name to skill id.** | Change 5 above. |
| 3 | **Re-key `sections.range.group{Product,Methods,Technical}` to `sections.range.groups.{product,methods,technical}`.** | Change 4 above. |
| 4 | **Replace `sections.range.toolsLine` with `sections.range.toolsLabel`** — „Werkzeug" / "Tooling" — and add `sections.range.toolLabels` keyed by tool id, holding only tools whose `cv.json` name is not language-neutral. | **This closes G1**, the one open hard-constraint violation in the project. `toolsLine` currently names Jira, Confluence, Miro and Copilot, which are facts living in `cv.skills.technical[tools]`, and it has already drifted once (Snowflake). The renderer composes `{toolsLabel}: {tools joined by ", "}` from `cv.json`. Today exactly one tool needs a label — "Microsoft Office Suite and Copilot with Agents" carries English connectives — so `toolLabels` holds one entry per language, and the other two render as facts. |
| 5 | **Keep `microcopy.levelAriaFormat`.** | G4 resolved: it is used, to build the radar's `<desc>` from all eighteen skill/level pairs. Not deleted. |

### `docs/03-copy-provenance.json` — new file

The stripped material is **moved, not deleted**. A sidecar mirrors `copy.json`'s key paths and
holds the phase-3 record for each string:

```json
{ "meta.headline": {
    "source": "rewrite",
    "original": "Product Owner mit technischer Tiefe | Auf dem Weg zur Head of Product",
    "alternatives": [ { "de": "…", "en": "…" } ],
    "note": "Rev. 3: the category label was removed because it echoed the opening statement." } }
```

A keyed JSON rather than prose folded into `03-copy.md`, because the alternatives are **attached to
specific strings**: "what else did we consider for the headline" has to be answerable by key
lookup, and prose inside a 596-line document loses that pairing permanently. The narrative
reasoning — why the voice changed, what user testing showed — stays in `03-copy.md`, which already
holds it.

Migration is mechanical and lossless: every `_note`, `_alternatives`, `original` and `source` moves
across under its full key path. Nothing is lost. The file stays in the repository and in git
history; it simply stops being a public URL.

The four head strings — `meta.pageTitle`, `metaDescription`, `ogTitle`, `ogDescription` — **stay in
`copy.json` and are also written literally into `index.html`**. This is the named duplication in
UX assumption 12. `copy.json` is the source a human edits; the HTML copy is what an unfurler
reads. On language switch the script updates `document.title` and the two OG meta tags, which
helps nothing and costs nothing, but keeps the document self-consistent.

### Reading the data — pairing rules

| Rendered thing | Fact source | Prose source | Pairing key |
|---|---|---|---|
| Role | `cv.experience[]` | `copy.roles.<id>` | `id` |
| Education entry | `cv.education[]` | `copy.education.<id>` | `id` |
| Earlier station | `cv.earlierStations[]` | `copy.earlierStations.<id>` | `id` |
| Timeline band | `cv.*[]` `start`/`end`/`color` | `copy.sections.arc.timelineBands.<id>` | `id` |
| Skill | `cv.skills.technical[].items[]` `name`/`level` | `copy…skillLabels.<id>` (optional) | skill `id` |
| Radar spoke label | — | `copy…radarLabels.<id>`, else the `cv.json` name | skill `id` |
| Skill group | `cv.skills.technical[].id` | `copy…groups.<id>` | category `id` |
| Language | `cv.meta.languages[]` order | `copy.languages.<id>` | `id` |
| Tools | `cv.skills.technical[tools].items[]` | `copy…toolsLabel` + optional `toolLabels.<id>` | tool `id` |

Every one of these is an explicit key. **After this change there is no positional pairing and no
string-keyed pairing left in the project.**

---

## The render pipeline

`main.js`, in order:

1. **Preload has already started.** `index.html`'s head carries
   `<link rel="preload" href="/content/cv.json" as="fetch" crossorigin>` and the same for
   `copy.json`, so both are in flight while the CSS and fonts are still being fetched. This is the
   single most important performance decision in a no-build architecture: it converts a
   *sequential* HTML → JS → JSON waterfall into a parallel one.
2. **Fetch and parse both files** (`data.js`). `Promise.all`. Same origin, no CORS.
3. **Validate** (`data.js`). See *Failure modes*. Validation runs before anything is written to
   the DOM, so a failure never leaves a half-built page.
4. **Render German** (`render.js`) into a `DocumentFragment`, complete, off-document.
5. **Append once.** One `main.replaceChildren(fragment)`. The visitor sees the shell, then the
   finished page. No partial states, no reflow cascade, no skeleton, no spinner — all four
   forbidden by UX revision 6.
   **The render target is `<main>` and nothing else.** This is what protects the legal link — see
   *The legal strip*. The renderer never touches `<body>`'s other children.
6. **Bind interactions** (`i18n.js`, `a11y.js`), then measure and pack the timeline
   (`timeline.js`), which is the only step that needs real layout.

### The no-flash rule, concretely

`<html lang="de">` is authored in the file. The renderer's first pass is German. **English is
never rendered and then replaced** — the language is chosen before the first node is created.
There is no `hidden` English DOM and no `[lang]` CSS switching; both would double the accessible
text for no gain.

### Language switching without re-rendering

Every element whose text is language-dependent is written with `data-copy="<dot path>"` — e.g.
`data-copy="roles.gls.summary"`. Switching is:

```
for (const el of root.querySelectorAll('[data-copy]'))
    el.textContent = lookup(copy, el.dataset.copy, lang);
document.documentElement.lang = lang;
```

Structure is identical in both languages because structure comes from `cv.json`, which has no
language. Therefore **nothing is created or destroyed on switch**: scroll position is exact, focus
stays on the button the user pressed, the radar and timeline are untouched, and there is no
flicker. Elements whose language-dependent text is an *attribute* rather than a text node
(`alt`, `aria-label`, `title`) use `data-copy-attr="alt:meta.photoAlt"`.

A missing English string **falls back to German and logs one `console.warn` naming the key.**
There is no build to fail, so `02-ux-spec.md:449`'s "fail-build vs fall-back" resolves to
fall-back. The page never shows an empty element and never shows a raw key.

Switching announces itself through a polite live region using `copy.microcopy.langToggleAriaLabel`,
because to a screen reader an in-place text swap is otherwise silent.

### The legal strip

`02-ux-spec.md` interaction 6 requires the „Datenschutz" link to survive with JavaScript off. Under
revision 6 the human footer is *rendered content*, so a link inside it would be wiped by step 5 and
would never exist at all without script. Putting it there is therefore wrong, and an earlier draft
of this document did exactly that.

**The link lives in a static strip that is a sibling of `<main>`, authored literally in
`index.html`, outside the render target:**

```html
<main id="inhalt"><!-- rendered --></main>

<div class="legal-strip">
  <a href="/datenschutz.html">Datenschutz</a>
</div>

<noscript>
  <p>Diese Seite benötigt JavaScript.</p>
  <p><a href="/datenschutz.html">Datenschutz</a></p>
</noscript>
```

It is in the markup before any script runs, it survives a script that fails, and it appears again
in the `<noscript>` state — three independent routes to the same URL, which is what *ständig
verfügbar* actually asks for. Its label is not CV prose and is not in `copy.json`, so it stays
German in both languages and creates no duplication.

`datenschutz.html` itself loads no JavaScript and fetches no JSON. **It cannot fail in any of the
ways the CV page can** — which is the property that matters: the legal information stays readable
precisely when the rest of the site is not.

---

## Geometry

All three generators are pure functions with no DOM knowledge, which is what makes them testable
by opening a page and calling them — see *Testing*.

### Timeline axis

```
axisStart = 1 January of the year of the earliest start date in cv.json   → 2007-01
axisEnd   = the first day of the month AFTER the current month           → 2026-10 today
pctPerYear = 100 / (yearValue(axisEnd) − yearValue(axisStart))
yearValue(y, m) = y + (m − 1) / 12

pos(y, m) = (yearValue(y, m) − yearValue(axisStart)) × pctPerYear
left%     = pos(start)
end%      = pos(end + 1 month)        // a month is a span; "2023-10" means through October
          = 100                       // when end is null
width%    = end% − left%
```

**This changes `04-ui-spec.md` §5.1's suggested axis-end rule, deliberately.** That document
proposed "the January boundary following the build date". The user asked for a timeline that
"ends in the current month", and it is the better rule: the open band lands flush on 100%, so the
right-hand edge of the diagram *is* today, rather than a gap that shrinks over a year and resets.
`axisStart` is likewise derived from the data rather than hardcoded to 2007, so a pre-2007 entry
would extend the axis instead of overflowing it.

Verified against today, 2026-09-02 — `pctPerYear` = 5.0633, span 19.75 years:

| band | lane | left% | width% | ends |
|---|---|---|---|---|
| Sevilla | studies | 3.376 | 21.941 | 25.316 |
| Cádiz | studies | 26.160 | 18.565 | 44.726 |
| KIT exchange | studies | 34.177 | 5.485 | 39.662 |
| Movand | work | 26.160 | 1.688 | 27.848 |
| KIT assistantship | work | 35.865 | 4.641 | 40.506 |
| Bosch | work | 40.506 | 3.797 | 44.304 |
| COBI | work | 45.570 | 5.063 | 50.633 |
| Fahrrad XXL | work | 50.633 | 10.970 | 61.603 |
| Zühlke | work | 61.603 | 23.629 | 85.232 |
| GLS | work | 85.232 | 14.768 | **100.000** |

The two properties the diagram exists to show both hold. **The employment run is unbroken:**
COBI→Fahrrad XXL, Fahrrad XXL→Zühlke and Zühlke→GLS abut to three decimal places, where the
Claude Design handoff had three one-month gaps. **The 2012–2015 overlap is legible:** Cádiz spans
26.160–44.726 and Movand, the KIT assistantship and Bosch all start inside it, in the other lane.

These numbers are for phase 6 to check its implementation against on that date. **They are not to
be hardcoded** — they change every month, which is the entire point.

### Lane assignment and row packing

`cv.education` → studies lane. `cv.experience` + `cv.earlierStations` → work lane. No flag needed.

Labels are wider than the bars they label, so packing operates on the **label** extent, not the
bar extent. IBM Plex Mono has a uniform advance of `0.6em`, so a label's width is
`text.length × 0.6 × fontSizePx` with no layout read, converted to a percentage using the
container width measured once after first paint.

- **Work lane** — bars all sit on one baseline. Labels are packed into **two rows, above and
  below**, by greedy first-fit on label extent. This replaces the design's hand-authored
  `tier: up|down` flags, which `04-ui-spec.md` Q7 recorded as having a shelf life: with a runtime
  axis the bands creep left every month, so a pair that clears today can collide next spring on a
  page nobody has edited. Computed, it cannot drift.
- **Studies lane** — bars themselves overlap in time, so bars *and* labels are packed into as many
  rows as needed by the same function. Today that yields two rows, not the design's three:
  Sevilla ends at 25.316 and Cádiz starts at 26.160, so they share a row, and only KIT needs a
  second. One fewer row is a shorter, denser diagram, and it falls out of the data rather than
  being decided.

Re-packed on resize, debounced 150 ms. This is the only place JavaScript reads layout.

### How geometry reaches CSS — and why there is no JS breakpoint

JavaScript writes **custom properties, never positions**:

```
band.style.setProperty('--band-start', '61.603%');
band.style.setProperty('--band-len',   '23.629%');
band.style.setProperty('--band-row',   '1');
band.style.setProperty('--band-color', '#7A2A86');
```

CSS decides what those mean:

```css
.band { left: var(--band-start); width: var(--band-len); }

@media (max-width: 899px) {
  .band { left: auto; width: auto; top: var(--band-start); height: var(--band-len); }
}
```

**This resolves defect A1 completely.** The design branched on `window.innerWidth` in JavaScript,
which broke browser text-only zoom and defaulted every JS-off visitor to the desktop layout. There
is now no `matchMedia` call and no viewport read anywhere in the codebase: the horizontal↔vertical
timeline flip, which looked like it needed JavaScript, is a media query over the same two numbers.

### Radar

Exactly `04-ui-spec.md` §5.2 — centre (200, 200), spoke `i` at `i × 20°` clockwise from twelve
o'clock, `r = level × 30`, rings at 30/60/90/120/150, wedge paths opening and closing at a
half-step past the group's first and last member at that member's radius. Spoke order is
`cv.json` order after the reordering in data-contract change 6. Reproduced from data, never
transcribed.

Three additions this phase owns:

- **A11 — the wedges must not be linked to their lists by colour alone.** Each group's name is
  drawn at its wedge's mid-angle at **radius 230**, in the group tone, mono, uppercase. Mid-angles
  are 50°, 160° and 280°; at r = 230 those land at (376, 52), (279, 416) and (−27, 160), all
  inside the existing `viewBox="-118 -48 636 516"` and 68 units clear of the spoke labels at
  r = 162. Phase 6 verifies no collision at both language's word lengths.
- **A9 — radar text must not shrink below 15 CSS px.** SVG text scales with the viewBox, and at
  the radar column's 560 px minimum a 15-unit label renders at ≈ 13.2 px. Spoke labels are
  therefore **17 user units**, and phase 6 measures the computed size at the 1080 px breakpoint.
- **`<desc>`** is generated: `radarDescription`, then all eighteen pairs through
  `microcopy.levelAriaFormat`. This is what makes G4's key used rather than deleted.

### Year rail

Linear at `pctPerYear` over the same axis, from the same `cv.json` records — the start years of
the four roles and the two Spanish degrees, plus the current year. `04-ui-spec.md` §3 corrected
this from "decorative" to "a true axis"; it is generated here on that basis. Removed below 900 px
by media query.

**The rail runs newest-at-top while the timeline runs oldest-at-left. This is deliberate** —
`04-ui-spec.md` Q6, confirmed by the user. Phase 6 must not "fix" it. Neither axis may be flipped.

---

## CSS strategy

**One file, `assets/site.css`.** With no bundler, one file is one request and four files are
permanently four, on the critical path, forever. The layering the architect brief asks for is
expressed with native cascade layers instead:

```css
@layer tokens, base, layout, components, state;
```

| Layer | Holds |
|---|---|
| `tokens` | Every value in `04-ui-spec.md` §2 as a custom property on `:root`. Group tones declared in `oklch` with an sRGB fallback via `@supports not (color: oklch(0 0 0))`. |
| `base` | Reset, `html { -webkit-text-size-adjust: 100% }`, `@font-face`, element defaults, focus-visible. |
| `layout` | The grids in §2.4 and the four media queries. Nothing here knows about content. |
| `components` | Masthead, role, timeline, radar, footer. BEM-ish: `.timeline`, `.timeline__band`, `.timeline__band--dim`. |
| `state` | `[data-highlight]`, `[aria-pressed="true"]`, dimmed variants. Last, so state always wins without `!important`. |

**Breakpoints — four media queries, and that is all there is.** No container queries; they buy
nothing here because every region is full-width.

| Boundary | Effect | Source |
|---|---|---|
| 1080 px | Range grid collapses, radar moves above its groups | `02-ux-spec.md:270-273` |
| 900 px | Year rail removed, timeline flips to vertical | `04-ui-spec.md` §7 |
| 640 px | Phone layout tier | User's rule: phones only |
| `prefers-reduced-motion` | All transitions to `0s` | UX interactions 2 and 3 |

**Sizes that must scale with text are in `rem`, not `px` — this is defect A2's fix.** The lanes'
`132px` / `96px` and the narrow timeline's `780px` become `8.25rem` / `6rem` / `48rem`. Percentage
positioning needs a definite height, so the container keeps one; expressing it in `rem` means it
grows with the user's font size, which is what browser text-only zoom changes and
`window.innerWidth` does not. That is why A2's fix is implementable here and was not before.

**Contrast corrections**, all from `04-ui-spec.md` §8.2, applied as token values so they cannot be
missed: dimmed radar text floors at `--ink-faint` `#5C594F` (6.66:1) and dimmed stroke opacity at
0.55 (A4); the outer radar ring and the 1/5 tick marks go to `#8A867A`, 3.46:1 (A5); the idle
language-toggle underline goes to `#8A867A` (A6).

No print stylesheet. `CLAUDE.md` puts print out of scope.

---

## JavaScript budget

Total ceiling **28 KB uncompressed, ~9 KB over the wire.** No dependencies of any kind.

| Module | Does | Ceiling | Without JS |
|---|---|---|---|
| `main.js` | Orchestration, error boundary | 2 KB | — |
| `data.js` | Fetch, parse, validate | 3 KB | — |
| `render.js` | All DOM construction | 9 KB | — |
| `i18n.js` | `[data-copy]` swap, lang attribute, toggle | 3 KB | Page is German — but there is no page |
| `timeline.js` | Date arithmetic, row packing | 4 KB | Diagram absent |
| `radar.js` | Polar geometry, wedge paths | 4 KB | Diagram absent |
| `a11y.js` | Focus restore, live region, sticky highlights | 3 KB | — |

The "without JS" column is honest rather than reassuring: under revision 6 **there is no partial
fallback.** Nothing renders. The `<noscript>` state is the whole answer and it is specified below.

Loaded as `<script type="module" src="/assets/js/main.js"></script>` — `type="module"` is deferred
by default, so it never blocks parsing, and it gives every browser that runs it native ESM. No
`nomodule` fallback: a browser without ES modules cannot run this page at all and gets the
`<noscript>` state, which is the correct outcome.

**Interaction implementations**, closing three more §8.2 defects:

- **A3 / A7 — controls must do something when activated.** The three radar group headings and the
  two timeline lanes are `<button>`s that toggle a *sticky* highlight on click or Enter, with
  `aria-pressed`, in addition to responding to hover and focus. The design's version responded
  only to `mouseenter`, so a keyboard user could tab to a control, press Enter, and get nothing —
  and a touch user could not reach the interaction at all. Clicking a second time, or clicking
  elsewhere, clears it.
- **A8** — the skip link uses ordinary `:focus-visible` CSS. The design's `left:-9999px` plus a
  `style-focus` attribute is a Claude Design canvas artefact that does not exist in a browser.

---

## Assets

Prepared once by hand, committed, never rebuilt.

**Fonts.** Subset to latin + the German and Spanish diacritics the content actually uses
(`äöüßáéíóúñ`), `font-display: swap`, preloaded, `woff2` only.

```
pyftsubset Archivo[wdth,wght].ttf --output-file=assets/fonts/archivo-latin.woff2 \
  --flavor=woff2 --layout-features='*' --unicodes='U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+201E,U+2026'
```

One variable file covers all four Archivo weights in one request. `04-ui-spec.md` §2.2 lists the
weights as discrete; a variable instance delivers exactly those weights and is smaller than two of
the four static files. **Named as a deviation from a literal reading of §2.2** — the rendered
result is identical, the request count is not. IBM Plex Mono ships static 400 and 500. Three font
files, ~66 KB total, all preloaded.

**Portrait.** The supplied `content/media/photo_square.jpg` is 796 × 796, 261 KB, of which
**19,167 bytes (7.2%) is metadata** — two EXIF/XMP blocks, a Photoshop resource block and an ICC
profile — naming a Canon EOS 550D, Adobe Photoshop CS3, and a capture date of 7 March 2019.

**This has nothing to do with the Datenschutzerklärung.** An earlier draft of this section implied
it did; that was wrong and is corrected here. The privacy notice governs *visitors'* personal data,
which is the IP addresses GitHub logs. EXIF in the owner's own portrait, on a page already
publishing his name, face and employment history, is not covered by Art. 13 DSGVO, and stripping it
changes the legal position by nothing.

The reasons to strip are real but small, and should be weighed as small: 19 KB of dead weight on
the largest asset, and a capture date advertising that the portrait is seven years old. `-strip`
costs nothing because the file is being re-encoded to two widths anyway. Strip it — but not for
legal reasons:

```
magick content/media/photo_square.jpg -strip -resize 800x800 -quality 82 content/media/photo_square_800.jpg
magick content/media/photo_square.jpg -strip -resize 400x400 -quality 82 content/media/photo_square_400.jpg
```

796 px is one pixel short of the 800 the layout wants at 2× DPR on the widest portrait
(`clamp(180px, 21vw, 272px)` → 544 px CSS → 1088 px at 2×, so 800 is already a compromise and 796
is invisible). Fine as is; a higher-resolution original would be better if one exists.

Rendered as a real `<img>` with `srcset`, `width`, `height` and `alt` from `copy.meta.photoAlt` —
**defect A10's fix.** `width`/`height` reserve the box so the opening never reflows when the photo
lands, which `02-ux-spec.md`'s edge-case table requires. If the file is missing the element is
omitted silently and the grid collapses to one column; a missing portrait is a cosmetic absence,
not a data error, and must not take the page down.

---

## Failure modes

Two tiers, because `02-ux-spec.md` demands loud failure but a typo should not blank the page.

**Tier 1 — the page cannot render. Shows the shell's error state.**

| Trigger | |
|---|---|
| Either fetch fails or returns non-JSON | Network, 404, malformed file |
| `cv.json` lacks `experience`, `skills` or `meta` | Structural |
| A role or education entry has no `id`, or its `id` has no `copy.json` entry | Unpairable |

The error state is the same markup as `<noscript>`: a short German sentence, the „Datenschutz"
link, and the profile link. **No stack trace, no raw key, no half-built page** — because
validation completes before anything is appended, a tier-1 failure means the DOM was never
touched.

**Tier 2 — one component does not render. The rest of the page does.**

| Trigger | Result |
|---|---|
| Any rated skill has no `level` | **Radar does not render.** No defaulting to a midpoint, to zero, or to anything — `02-ux-spec.md` is explicit, and phase 3 refused to invent this data for the same reason. |
| Any timeline entry has no `color` | **Timeline does not render.** `04-ui-spec.md` Q7: the user's job at the moment of editing, not the page's job to guess. |
| A `timelineBands` label is missing | Timeline does not render. |
| An English string is missing | Falls back to German, `console.warn`. Never blank, never a raw key. |
| The portrait is missing | Element omitted, layout collapses cleanly. |

Every tier-2 failure also logs one `console.error` naming the record and the field. The visible
signal is the component's absence, which on a page with two large diagrams is unmissable — and the
user's own decision was that "if colours are missing when the user is updating the files, then
it's fine if the page doesn't render." What is *not* done is showing a recruiter a German error
string in place of the chart.

---

## Deploy

**GitHub Pages, deploy from a branch: `main`, folder `/`. No Actions workflow. No build.**
`git push` is the deployment. Repository is `pedlopcha/pedlopcha.github.io`, so the site serves
from `/` and **all paths are root-relative** — `/assets/…`, `/content/…`. Verified against
`CLAUDE.md`'s warning; a project-repo path prefix does not apply here. Root-relative paths also
survive a later move to a custom domain unchanged.

### `_config.yml` is load-bearing, and this is the part most likely to be missed

Serving from the branch root publishes **every file in the repository**. Without an exclude list,
these become public URLs:

- `docs/` — 224 KB of internal deliberation, including the interview record, the rejected design
  directions, and the *Legal posture* section's reasoning about why an Impressum is not required.
  Publishing your own analysis of your legal exposure is not a good idea.
- `content/inspiration/` — 964 KB of third-party reference imagery, served from the user's own
  domain. Bandwidth and a copyright surface, for files the site never uses.
- `CLAUDE.md`, `TUTORIAL.md`, `.claude/`, `cv.tex`, `content/media/README.md`.

GitHub Pages runs Jekyll by default, and Jekyll's `exclude:` is the only mechanism available
without a build step, so **Jekyll stays enabled** and there is no `.nojekyll`:

```yaml
exclude:
  - docs/            # includes 03-copy-provenance.json
  - .claude/
  - content/inspiration/
  - content/media/README.md
  - CLAUDE.md
  - TUTORIAL.md
  - cv.tex
  - README.md
```

Phase 6 must verify each excluded path returns 404 on the live site. This is a checklist item, not
an assumption.

**Custom domain.** None today, no `CNAME` file, and nothing here depends on the answer — paths are
root-relative either way. Worth flagging once: `02-ux-spec.md`'s *Legal posture* condition 5 rests
on the site sitting at a personal address. A personal-name domain preserves that; a
business-sounding one weakens the no-Impressum position, so the name matters if one is adopted.

---

## Performance and a11y targets

Measured on the deployed site, not locally.

| | Target | Where it comes from |
|---|---|---|
| `index.html` | ≤ 8 KB | Shell only |
| `site.css` | ≤ 22 KB uncompressed | One file |
| JS total | ≤ 28 KB uncompressed | Budget above |
| `cv.json` | ≤ 9 KB | 8,879 minified after the deletions |
| `copy.json` | ≤ 20 KB | 19,021 minified after stripping provenance, down from 44,148 |
| Fonts | ≤ 70 KB | Three subset woff2 |
| Portrait | ≤ 80 KB | 800 px JPEG q82 |
| **Total first view** | **≤ 210 KB** | |
| Requests | ≤ 14 | HTML, CSS, 7 JS, 3 fonts, 2 JSON, 1 image |
| LCP (4G) | ≤ 2.0 s | The headline, which cannot paint before `copy.json` arrives — the preload is what makes this reachable |
| CLS | **0** | Everything appended in one `replaceChildren`; the portrait box is reserved |
| Lighthouse a11y | 100 | |
| axe-core | 0 violations | |
| WCAG | 2.1 AA, no exceptions | Concept brief treats it as a hard floor |
| Text zoom | 200% with no loss of content or function | `rem` sizing — defect A2 |
| Reflow | 320 px, no horizontal scroll | `02-ux-spec.md`; unverified below 640 px, phase 6 checks |
| Keyboard | Every control reachable, visible focus, no trap | Defects A3, A7, A8 |

**JS-off is not on this list**, and its absence is the honest record of what revision 6 traded
away.

---

## Testing

There is no test runner, because there is no Node. What there is instead:

- **`main.js` exposes the three geometry modules on `window.__geo` in development.** Timeline and
  radar functions are pure `(data, date) → numbers`, so they are checkable from the browser
  console against the tables in this document — the ten bands above for a known date, and the two
  §5.2 coordinates `04-ui-spec.md` verifies exactly (the Produkt wedge opening at `174.0 52.3` and
  closing at `312.8 241.0`).
- **A checklist for phase 6**, since the boundary cases are known and few: 900–1080 px, which
  Claude Design never rendered and where the horizontal timeline is tightest; 320 px; 200% text
  zoom; keyboard-only; JS off; both languages at every breakpoint; and every excluded path
  returning 404.

---

## Update workflow

**Change a job title, a bullet, or an end date:**

1. Edit `content/cv.json` (facts) or `content/copy.json` (prose, both languages).
2. `git commit && git push`.

Two steps, and the second is the deploy. Nothing is generated, nothing is regenerated, nothing
goes stale. The timeline axis, the year rail, the band positions, the row packing and the radar
all recompute on the next page load.

**Add a role:** one object in `cv.experience` with `id`, `start`, `end`, `color`; one entry under
`copy.roles.<id>` per language; one label under `copy.sections.arc.timelineBands.<id>` per
language. The diagram, the axis and the packing follow with nothing hand-tuned.

**Change a skill level:** one integer in `cv.json`. The radar redraws.

**Replace the portrait:** run the two `magick` lines, commit both outputs.

---

## Assumptions

1. **Provenance keys can be stripped from `copy.json` without reopening phase 3.** No rendered
   string changes; only `_note`, `_alternatives`, `original` and `source` are removed, and
   `docs/03-copy.md` already records all of it. If you would rather keep them in the shipped file,
   say so — the cost is 25 KB per visitor and a public record of the drafting.
2. **The `id` and `color` additions to `cv.json` are phase 6's mechanical work, not a design
   change.** They were agreed in `04-ui-spec.md` Q7 and assigned here by `CLAUDE.md`.
3. **Reordering `skills.technical` is acceptable.** It changes the radar spoke order to what
   `04-ui-spec.md` §5.2 specifies. If array order should *not* be display order, the alternative
   is an explicit `order` field and I will add it instead.
4. **Two portrait widths are enough.** No WebP, no `<picture>`. Adding them is two more files to
   prepare by hand for roughly 30 KB, and priority 3 is third.
5. **No analytics, ever.** Not a preference — `02-ux-spec.md` *Legal posture* conditions 3 and 6
   make it a binding constraint, and the page's zero-external-request property is what lets the
   privacy notice say so positively.
6. **The axis ends in the current month, not the following January.** Deviates from
   `04-ui-spec.md` §5.1's suggestion, on the user's stated preference. Say the word and it reverts
   to the January rule, which trades a flush right edge for a stabler axis.

---

## What this closes, and what it does not

**Closed here:** G1 (the tools line, the last hard-constraint violation); G4 (`levelAriaFormat`);
the G3/G5/G6 carry-forward (string keys → ids); A1 (the JS breakpoint); A2 (fixed pixel heights);
the open-range date form; `04-ui-spec.md` §11's eight questions; and the stale banner on
`04-ui-spec.md` — §5.0's reasons 1–4 stand, while §5.1's build-time framing and §7's "both
diagrams are static markup" are **superseded by this document**, which is what that banner asked
phase 5 to do.

**Left to phase 6:** A3, A5, A6, A7, A8, A9, A10, A11, A12 as implementation; the 640–1080 px
range, which no artboard ever rendered; `prefers-reduced-motion` durations; the OG card image and
the favicon.

**Left to the user, and blocking launch:**

| | |
|---|---|
| The real Xing URL, or removal of the entry | `cv.meta.links[0].url` is still `https://www.xing.com/profile/`. The renderer will not ship a placeholder href. |
| Whether a LinkedIn profile exists | The design invented one. Nothing will be invented here. |
| A dedicated email alias | `02-ux-spec.md` assumption 10 — the privacy notice cannot ship without one, and it is the only contact detail on the site. |
| The Datenschutzerklärung text | From a current generator or a lawyer. Not written by this project. |
