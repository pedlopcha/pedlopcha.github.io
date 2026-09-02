STATUS: APPROVED

# UI Spec

Phase 4. Extracted from the Claude Design handoff bundle in `docs/04-ui-reference/`.

Phases 1, 2 and 3 were `APPROVED` when this was written. This document is the contract phases 5
(architecture) and 6 (build) work against. The `.dc.html` in `docs/04-ui-reference/` is evidence,
not source — see that folder's README.

**Stale as of 2026-08-31.** `docs/02-ux-spec.md` was set back to `DRAFT` for revision 2, which
moves both diagrams' geometry from build time to page load and removes the build step. §5.0,
§5.1 and §7 of this document are written against revision 1 and must be reconciled once
revision 2 is approved. The passages are marked **[stale — ux rev. 2]**.

## Source

| | |
|---|---|
| Claude Design project | `e232be1b-7e7d-403e-ac5c-d85658db3dd5` — „Drei Designrichtungen für Jahresschiene" |
| Chosen direction | `Pedro López Chao - Seite.dc.html` |
| Pulled | 2026-08-30, via `DesignSync` |
| Also in project | `CV Richtungen.dc.html` (the three directions), `375 px Ansicht.dc.html` (reflow artboard), `support.js` (canvas runtime), `uploads/{cv,copy}.json` |

The design was made against the real content, not lorem ipsum. Its copy matches
`content/copy.json` revision 3 string-for-string with one exception, recorded in §9.

## Assumptions

1. **The single JS breakpoint becomes CSS.** The design branches on `window.innerWidth < 1080`
   in JavaScript. The build must express this as CSS media queries. Rationale in §8, defect A1.
2. **The radar is generated, not transcribed.** Every coordinate in the handoff is a literal
   number. §5.2 gives the geometry rules that reproduce them exactly; the build computes the SVG
   from `cv.json` levels at build time. Transcribing the numbers would break priority 2.
3. **The design's single 1080px breakpoint is replaced.** The user's rule is that the phone
   layout is for phones and everything else shows the desktop layout. §7 implements that as one
   layout tier boundary at 640px plus two component thresholds. Resolved, Q1.
4. **The portrait is a real photograph.** The design ships a striped 1:1 placeholder.
   `cv.json` names `photo_square.jpg`, which does not exist in the repo. See Q3.
5. **The two group tones and the timeline band colours are decorative reinforcement.** Every
   distinction they draw is also carried by text and position, so 1.4.1 is satisfied. The
   contrast measurements in §8 are made on that basis.
6. **Fonts are self-hosted.** The design loads Archivo and IBM Plex Mono from Google Fonts.
   The user was indifferent; this is decided on data-protection and speed grounds, not design
   grounds, and reverts to a `<link>` with one line if overruled. Resolved, Q2.

7. **The diagrams use no charting library.** Both are generated as literal SVG and HTML at build
   time from `cv.json`. Reasons in §5.0. Resolved.

## 1. What the design decided

A quiet, editorial, paper-coloured page. Near-black on warm off-white, one grotesque and one
monospace, hairline rules instead of boxes, no cards, no shadows, no rounded corners, no accent
colour used as decoration. All colour is load-bearing: the three group tones in the radar and the
per-organisation tones in the timeline. Everything else is ink on paper.

Structure is expressed by rules and rhythm, not containers. Every section opens with a hairline
`border-top` and an uppercase letterspaced label. Metadata — dates, lane names, scale notes, axis
ticks — is set in monospace, which is what makes the page read as a document rather than a
marketing site.

The two custom components carry the distinctiveness the concept brief ranked first: a
**two-lane timeline** on a uniform 20-year axis, and an **18-spoke radar** split into three
contiguous wedges.

## 2. Design tokens

### 2.1 Colour

Every value below is measured against the page ground `#FAF9F6` in §8.

| Token | Value | Used for |
|---|---|---|
| `--paper` | `#FAF9F6` | page ground |
| `--ink` | `#171716` | body text, headings, focus ring, footer top rule, axis baseline |
| `--ink-bullet` | `#2A2822` | role bullet text |
| `--ink-secondary` | `#3B3931` | second opening paragraph, `dd` values, tools line, sub-headings |
| `--ink-meta` | `#4E4B44` | role dates, mono metadata, link hover, level numbers |
| `--ink-faint` | `#5C594F` | rail axis label, radar scale ticks, dimmed lane label |
| `--ink-ghost` | `#8A867A` | bullet dash glyph (decorative), dimmed radar label |
| `--rule` | `#DAD7CF` | hairline section rules, role separators |
| `--rule-dotted` | `#C6C2B6` | dotted rules in `dl`/`ul` lists, outermost radar ring |
| `--rule-faint` | `#E4E1D8` | inner radar rings, radar spokes |
| `--control-idle` | `#C0BCB0` | unselected language toggle underline |
| `--band-dim-fill` | `#EAE7DE` | timeline band, other lane hovered |
| `--band-dim-stroke` | `#D2CEC2` | ditto, border |
| `--photo-a` / `--photo-b` | `#E8E5DC` / `#F1EFE8` | 135° placeholder stripes, 7px pitch |

**Group tones** — declared in `oklch`, sRGB fallback computed here:

| Group | oklch | sRGB | vs paper |
|---|---|---|---|
| Produkt & Führung | `oklch(0.55 0.07 42)` | `#956451` | 4.73:1 |
| Methoden & Werkzeug | `oklch(0.55 0.07 186)` | `#3B7F78` | 4.44:1 |
| Technisch | `oklch(0.5 0.08 292)` | `#645B8D` | 5.83:1 |

The three are near-equiluminant (pairwise contrast 1.06–1.31), so they separate by hue alone.
That is fine because the wedges are also separated by angular sector and labelled in text — but
it means the 13px swatch must never be the only link between a list group and its wedge. See Q4.

**Timeline band tones** — one per organisation, roughly brand-derived. All pass 3:1 against paper.

| Key | Organisation | Value | | Key | Organisation | Value |
|---|---|---|---|---|---|---|
| `sev` | Universidad de Sevilla | `#B0121F` | | `cobi` | COBI | `#0079A8` |
| `cad` | Universidad de Cádiz | `#005A9C` | | `fxxl` | Fahrrad XXL | `#8C1A0B` |
| `kit` / `kith` | KIT | `#00786A` | | `zuh` | Zühlke | `#7A2A86` |
| `mov` | Movand | `#6E6A5F` | | `gls` | GLS | `#0A1FA8` |
| `bos` | Bosch | `#D0000F` | | | | |

### 2.2 Type

Two families, both variable-weight-free — load only the weights listed.

| | Family | Weights |
|---|---|---|
| Sans | `Archivo`, fallback `Helvetica, Arial, sans-serif` | 400, 500, 600, 700 |
| Mono | `IBM Plex Mono`, fallback `monospace` | 400, 500 |

| Role | Size | Weight | Line | Tracking | Other |
|---|---|---|---|---|---|
| Body default | 18px | 400 | 1.6 | — | set on the page wrapper |
| H1 headline | `clamp(42px, 6.6vw, 88px)` | 700 | 0.94 | `-0.035em` | `max-width:22ch`, `text-wrap:balance`, `overflow-wrap:break-word` |
| Section H2 | 15px | 600 | — | `0.14em` | uppercase |
| Sub-heading H3 | 13px | 600 | — | `0.14em` | uppercase, `--ink-secondary` |
| Role title H3 | `clamp(22px, 2.4vw, 29px)` | 600 | 1.2 | `-0.01em` | company appended in 400 / `--ink-meta` |
| Opening statement | wide `clamp(19px, 1.5vw, 21px)` · narrow 17px | 400 | 1.5 | — | `max-width:70ch`, `text-wrap:pretty` |
| Section intro | `clamp(19px, 1.8vw, 24px)` | 400 | 1.5 | — | `max-width:52ch` (arc) / `56ch` (range) |
| Role summary | 19px | 400 | 1.6 | — | `text-wrap:pretty` |
| Role bullet | 17px | 400 | 1.6 | — | `--ink-bullet` |
| List item | 16px | 400 | 1.5 | — | education, earlier, skills, languages |
| Masthead name | 15px | 600 | — | `0.1em` | uppercase |
| Mono — role date | 17px | 400 | 1.4 | — | |
| Mono — scale note | 13px | 400 | — | — | |
| Mono — lane / band label | 12px (narrow 11px) | 400 | 1.3 | `0.12em` on lane label | uppercase on lane label |
| Mono — rail axis label | 10px | 400 | — | `0.14em` | uppercase |
| Mono — radar label | 15px | 400 | — | — | in SVG user units |

`html { -webkit-text-size-adjust: 100%; }` is set. `text-wrap: pretty` is used on every prose
block and `text-wrap: balance` on the H1 — both are progressive enhancements, safe to leave in.

### 2.3 Spacing and measure

| Token | Value |
|---|---|
| Content max width | `1240px`, centred |
| Gutter | `clamp(20px, 5vw, 56px)` |
| Major section gap | `clamp(48px, 7vw, 88px)` |
| Arc section gap | `clamp(24px, 4vw, 48px)` |
| Section rule → heading | `26px` (wide) / `16px` (narrow) |
| Heading → intro | `20px` |
| Role padding-bottom / margin-bottom | `clamp(32px, 4vw, 48px)` each |
| Role heading → summary → bullets | `14px` gap, bullets get `+4px` top |
| Bullet-to-bullet | `12px` |
| Grid gaps | `clamp(24px, 4vw, 56px)` (opening) · `clamp(16px, 3vw, 48px)` (role) · `clamp(28px, 4vw, 56px)` (range) |
| Footer bottom padding | `clamp(56px, 8vw, 96px)` |

### 2.4 Grid

| Region | ≥1080px | 900–1079px | 640–899px | <640px |
|---|---|---|---|---|
| Opening outer | `104px minmax(0,1fr)` — year rail + content | same | `minmax(0,1fr)`, rail removed | `minmax(0,1fr)`, rail removed |
| Opening inner | `minmax(0,1fr) clamp(180px,21vw,272px)` — text + portrait | same | same | flex column, portrait `120px` |
| Role | `170px minmax(0,1fr)` — date + content | same | same | `minmax(0,1fr)`, date above |
| Range | `minmax(0,0.72fr) minmax(560px,1.28fr)` — lists + radar | `minmax(0,1fr)`, **radar above its groups** | `minmax(0,1fr)`, radar above its groups | `minmax(0,1fr)`, radar above its groups |
| Arc sub-lists | `repeat(auto-fit, minmax(280px,1fr))` | as auto-fit allows | as auto-fit allows | one column |
| Footer `dl` | `repeat(auto-fit, minmax(260px,1fr))` | as auto-fit allows | as auto-fit allows | one column |

In the wide opening grid the headline sits at row 1 column 1, the statement at row 2 column 1,
and the portrait spans both rows in column 2.

## 3. Section-by-section

The order is fixed by the UX spec and the design follows it exactly. Section comments in the
handoff are numbered `1 · Masthead` … `6 · Human footer`.

**0 · Document head.** `<title>` from `meta.pageTitle`. `lang` on `<html>` is set from state and
**must change with the toggle**. Skip link first in the body, `href="#inhalt"`, visually hidden
until focused, then pinned `position:fixed; top:12px; left:12px` in reversed colours.

**1 · Masthead.** Full-width, `border-bottom: 1px solid --rule`. Name left, language toggle
right, baseline-aligned, `flex-wrap` so it stacks under pressure. No navigation — the page has
no internal nav, by design.

**2 · Opening.** The year rail is a 104px column with `border-right`, holding the label „Zeitachse"
and seven year marks at fixed pixel offsets — `2026 · 2023 · 2019 · 2017 · 2016 · 2012 · 2007`.
The offsets are **linear at 34.75px per year** — measured across all seven marks, gaps of
34.7 / 34.75 / 34.5 / 35.0 / 34.75 / 34.8 — so the rail is a true axis and is generated from
`cv.json`, not hand-placed. Earlier drafts of this document called it decorative; that was wrong.
The marks are the start years of the four roles, the two Spanish degrees, and the current year.
2026 is picked out in `--ink` with a solid rule while the rest are `--ink-faint` on `--rule`. It
is dropped below 900px. Right of it: the H1, the 1:1 portrait, and the opening statement in two paragraphs
— the second in `--ink-secondary`.

**3 · Work.** Four roles, `<article>` each, hairline separated. Date in mono at left. Title as
`<h3>` with `role · company`, the company in lighter weight and `--ink-meta`. Optional summary
paragraph, then an unstyled `<ul>` whose markers are em dashes in `--ink-ghost` carrying
`aria-hidden="true"`, in a `16px minmax(0,1fr)` grid so bullets hang correctly. Bullet budget
6 / 5 / 2 / 1 = 14, matching `copy.json` exactly. COBI has no summary.

**4 · The arc.** Heading, intro, then the three-line attribution `<dl>` with dotted rules. Then
the timeline (§5.1). Then two `<ul>` lists side by side — Ausbildung and Frühere Stationen —
each item leading with a mono date span.

**5 · Range.** Heading, intro, scale note in mono. Then a two-column grid: the three skill groups
as lists on the left, the radar on the right. Each group heading is a control that highlights its
wedge (§6). Each skill renders `name` then `level/5` in mono. The tools line hangs under the
Methoden & Werkzeug group. Languages close the section under a dotted rule.

**6 · Human footer.** `border-top: 1px solid --ink` — the only full-weight rule on the page, and
it is what makes the footer read as the end. Interests and hobbies as a two-column `<dl>`, then
Xing and LinkedIn links and a second copy of the language toggle.

No email, no phone, no postal location anywhere. The design honours this correctly.

## 4. Content binding

Every string the page renders comes from the two content files. Nothing is hardcoded.

Earlier drafts of this table claimed that while omitting about a dozen strings the page actually
renders — the timeline band labels above all. Those keys now exist: `content/copy.json`
**revision 4** adds them, and `docs/03-copy.md` records why. The rule for reading this table:
**a fact appears once, in `cv.json`, in no language; prose appears twice, in `copy.json`, once
per language.** Where a string is in `cv.json` *and* here, that is a defect, not a convenience.

| Rendered | Source |
|---|---|
| Headline | `copy.meta.headline` |
| Opening paragraphs | `copy.meta.openingStatement`, **split on the blank line** into two `<p>` |
| Portrait alt | `copy.meta.photoAlt` |
| Section headings and intros | `copy.sections.<id>.heading` / `.intro` |
| Attribution lines | `copy.sections.arc.attribution.items[]` |
| Role dates, titles, companies | `cv.experience[]` — never `copy.json` |
| Role summaries and bullets | `copy.roles.<id>.summary` / `.bullets[]` |
| Education, earlier stations | dates from `cv.json`; field, credential and role names from `copy.education.<id>` / `copy.earlierStations.<id>` |
| Institution names | `cv.json`, **except** `copy.education.kit-exchange.institutionLabel` and `copy.earlierStations.kit-assistant.institutionLabel`, which carry the official English forms. The two Spanish universities need no translation and stay facts. |
| Year rail label | `copy.sections.arc.timelineAxisLabel` |
| Year rail marks | `cv.json` — the start years of the roles and degrees, plus the current year. Generated, not authored; see §3 |
| Timeline lane labels and accessible names | `copy.sections.arc.laneStudies` / `.laneWork` |
| Timeline band labels | `copy.sections.arc.timelineBands.<id>` — **not** the `cv.json` organisation name. A band with no entry is a build error |
| Timeline band geometry | `cv.json` `start` / `end` via §5.1 |
| Timeline band colour and `tier` | `cv.json`, per entry. Missing colour = the diagram does not render. See §10 Q7 |
| Skill names and levels | `cv.skills.technical[]` where `rated: true` |
| Skill names needing English | `copy.sections.range.skillLabels.<cv name>` — two entries only, `Teamführung` and `C4-Modell / Architekturdiagramme`. The other sixteen render from `cv.json` unchanged |
| Radar spoke labels | `copy.sections.range.radarLabels.<cv name>` where an entry exists, else the full `cv.json` name. Eight are shortened; the lists always show the full name |
| Radar title and description | `copy.sections.range.radarTitle` / `.radarDescription` |
| Scale note | `copy.sections.range.levelScaleNote` |
| Highlight status text | `copy.microcopy.layerHighlighted` |
| Level display | `copy.microcopy.levelFormat` — `{level}/5` |
| Group labels | `copy.sections.range.group{Product,Methods,Technical}` |
| Tools line | `copy.sections.range.toolsLine` |
| Languages | names and levels from `copy.languages`, order from `cv.meta.languages[]` |
| Skip link, toggle, link labels | `copy.microcopy.*` |
| Footer heading and list labels | `copy.sections.footer.heading` / `.interestsLabel` / `.hobbiesLabel` |
| Interests, hobbies | `copy.interests.items[]` / `copy.hobbies.items[]` |
| `<title>`, meta description, OG title and description | `copy.meta.pageTitle` / `.metaDescription` / `.ogTitle` / `.ogDescription` |
| Profile links | `cv.meta.links[]` — **render what exists, invent nothing.** See §9 G2 |

The design's own `COPY` const and `GROUPS` array are a mockup convenience. They are the thing
`CLAUDE.md` forbids, and they are already stale — see §9.

## 5. The two custom components

### 5.0 No charting library

Both components are **hand-generated SVG and HTML, emitted at build time**. No D3, no Chart.js,
no Plotly, no Gantt library. This is a design decision, not only an architectural one, and it is
settled here rather than deferred to phase 5:

1. **`CLAUDE.md` forbids it.** "No runtime dependencies." A charting library is one, and it is
   also a second network request on the critical path against priority 3.
2. **Neither component is the shape any library draws.** A radar library plots one polygon per
   dataset over *n* equal axes. This radar has 18 axes, three group wedges that each span a
   contiguous arc and terminate at a half-step past their first and last member at *that
   member's* radius, labels at a constant radius with `text-anchor` varying by quadrant, and a
   per-group highlight. Every one of those is an override fighting the library's model. The
   timeline is worse: two lanes of percentage-positioned bands with alternating label rows to
   avoid collisions, which no charting library exposes at all.
3. **The geometry is five lines of trigonometry.** §5.2 states it completely. D3 would supply
   scales and selections for maths already written, at 100 KB.
4. **A library has a look, and priority 1 is not looking like anything else.** These read as
   bespoke because they are. Defaults leak — tick styling, tooltip chrome, font fallbacks,
   focus rings — and each leak is a fight to suppress.
5. ~~**Client-side rendering fails the approved UX spec.**~~ **[stale — ux rev. 2]** This
   argument is withdrawn. Revision 2 of the UX spec accepts that the diagrams are absent with
   JavaScript disabled, so the JS-off objection no longer distinguishes a library from
   hand-written SVG. **Reasons 1–4 stand unchanged**, and reason 2 is the decisive one.

A note on the premise, since it is what prompted the question: a charting library does not take
over the date arithmetic. You still compute the domain, still decide the end boundary, still map
each record to a start and a length — that is the part §5.1 specifies, and it is the same five
lines whether a library renders the result or not. What a library supplies is axes, scales and
drawing, which is precisely the part that does not fit here.

What phase 5 *does* decide is the generator: what runs it, where the geometry functions live,
and how they are tested. Not whether to reach for a library.

### 5.1 Timeline

Two lanes — Studium above, Beruf below — on one shared horizontal axis, with a tick row beneath.

**Axis is uniform and linear, origin 1 January 2007.** A month is a *span*, not an instant, so
every date maps to the first day of its month and a band's end boundary is the first day of the
month **after** its `end`. `cv.json`'s `end: "2023-10"` means "through October 2023", inclusive.

```
pos(y, m)  = (y + (m - 1)/12 - 2007) * pctPerYear     // 1st of month m

left%      = pos(start.y, start.m)
end%       = pos(endExclusive.y, endExclusive.m)      // end + 1 month, or the
                                                      // 1st of next month if end is null
width%     = end% - left%
```

`pctPerYear` is **5** while the axis ends at 2027-01, but see the axis-end note below — it is
derived, not a constant. Ticks currently land at `0 / 25 / 45 / 65 / 95%` =
`2007 / 2012 / 2016 / 2020 / 2026`.

**The handoff's closed bands are wrong and must not be transcribed.** They omit the `+ 1 month`,
so each one stops where its final month begins. Zühlke is drawn `l:60.83, w:22.92` → ending at
83.75% = 1 Oct 2023, while GLS starts at 84.17% = 1 Nov 2023. The same error appears at
COBI → Fahrrad XXL and Fahrrad XXL → Zühlke: **three one-month gaps that break a continuous
eleven-year employment run into four pieces.** Cádiz likewise loses October 2015, Sevilla loses
December 2011, and Movand's four-month internship renders as three. The handoff's *open* band is
correct — GLS's `w: 14.17` resolves to 1 September 2026, August included — so the right
convention is already in the file and simply was not applied to closed bands. With the formula
above, Zühlke ends at 84.167% and GLS begins at 84.167%: they abut exactly, and the four roles
form one unbroken bar.

Corrected values, for phase 6 to check its generator against (build date 2026-08-31):

| band | start | end | left% | width% |
|---|---|---|---|---|
| Sevilla | 2007-09 | 2011-12 | 3.333 | 21.667 |
| Cádiz | 2012-03 | 2015-10 | 25.833 | 18.333 |
| KIT exchange | 2013-10 | 2014-10 | 33.750 | 5.417 |
| Movand | 2012-03 | 2012-06 | 25.833 | 1.667 |
| KIT assistantship | 2014-02 | 2014-12 | 35.417 | 4.583 |
| Bosch | 2015-01 | 2015-09 | 40.000 | 3.750 |
| COBI | 2016-01 | 2016-12 | 45.000 | 5.000 |
| Fahrrad XXL | 2017-01 | 2019-02 | 50.000 | 10.833 |
| Zühlke | 2019-03 | 2023-10 | 60.833 | 23.333 |
| GLS | 2023-11 | *open* | 84.167 | 14.167 |

**The axis end has no rule and the design's fixed 2027-01 expires.** GLS reaches 98.33% today; in
January 2027 it hits 100% and after that every band overflows its container. Phase 5 must supply a
rule — the January boundary following the build date is the obvious one, at which point
`pctPerYear = 100 / axisSpanInYears` and every percentage in the table above, plus the tick
positions, is derived rather than fixed. **`cv.json` needs no change for any of this**; its
`start` / `end` shape is already correct.

This satisfies the UX spec's uniform-axis rule, and it preserves the thing the diagram exists to
show: **the 2012–2015 overlap.** Cádiz spans 25.83–43.75%, and Movand (25.83), the KIT
assistantship (35.42) and Bosch (40.00) all sit inside it, in the other lane. Studying and working
at the same time is visible as vertical coincidence. Nothing may compress the study years.

**The current role's width must be recomputed at build time** — GLS is `w: 14.17`, which is
`11/2023` to today. Hardcoding it makes the page silently wrong.

Lane construction, wide:

- Grid `112px minmax(0,1fr)`, lane label in mono at left, `20px` gap.
- Studies lane is `132px` tall; its three bands get **their own rows** at `top: 0 / 44 / 88px`,
  because they overlap in time and would otherwise collide.
- Work lane is `96px` tall; all seven bands sit at `top: 42px`, and labels alternate above
  (`top: 20px`) and below (`top: 64px`) via a per-band `tier: "up" | "down"` flag. This is
  hand-tuned collision avoidance, not a computed layout — the flags are part of the design.
- Bands are `16px` tall, `min-width: 5–6px`, filled and stroked in the organisation's tone.
- Tick row sits under a `1px solid --ink` rule.

Lane construction, narrow: two columns, Studium right-aligned and Beruf left-aligned across a
centre rule, on a **fixed `780px` tall** container. The same percentages become `top` and `height`.
The 375px artboard's caption confirms the intent: „Timeline gekippt, Radar entfallen."

The fixed pixel heights are defect A2.

### 5.2 Radar

An 18-spoke radar carrying all 18 rated skills, split into three contiguous wedges. This is the
page's signature object.

**Geometry — every literal coordinate in the handoff is reproduced by these rules:**

```
centre        (200, 200)          viewBox "-118 -48 636 516"
spoke i       θ = i × 20°, clockwise from 12 o'clock, i = 0…17
data point    r = level × 30      (level 5 → r = 150)
              x = 200 + r·sin θ
              y = 200 − r·cos θ
rings         r = 30, 60, 90, 120, 150  → the 1…5 scale
              outermost --rule-dotted, inner four --rule-faint
spoke lines   centre → r = 150, --rule-faint
```

**Spoke order is fixed and contiguous by group**, running clockwise from 12 o'clock:

| i | Skill | Level | Group |
|---|---|---|---|
| 0–5 | Product Management, Product Ownership, Requirements Engineering, Teamführung, Strategic Planning, Stakeholder Management | 5,5,5,4,4,4 | Produkt & Führung |
| 6–10 | Agile Development (Scrum), User Story Mapping, Design Thinking, Business Model Canvas, Product Roadmapping | 5,5,3,3,5 | Methoden & Werkzeug |
| 11–17 | C4-Modell / Architekturdiagramme, SQL, Python, Data Analysis, Business Analytics, API-Design, Figma | 3,3,2,4,4,2,3 | Technisch |

This is `cv.json` order within each group, and the group order the UX spec fixed. It matters:
changing it rotates the shape.

**Wedge path** — for a group spanning spokes `a…b`:

```
M 200 200
L  point at (a − 0.5) using level[a]      ← half-step boundary, so wedges meet cleanly
L  point at a … point at b                ← each member
L  point at (b + 0.5) using level[b]
Z
```

Verified: the Produkt wedge opens at `174.0 52.3` = index −0.5, r = 150 (matching Product
Management's 5), and closes at `312.8 241.0` = index 5.5, r = 120 (matching Stakeholder
Management's 4). Both exact.

**Labels** sit at a **constant radius of 162**, regardless of the data point's radius:

```
x = 200 + 162·sin θ
y = 200 − 162·cos θ      (index 9 only: +4px, baseline correction)
text-anchor: middle at i = 0 and i = 9; start for i = 1…8; end for i = 10…17
```

Each label is the skill name plus a `<tspan dx="5">` carrying `n/5`. Two mono scale ticks sit on
the vertical spoke: „1" at `(206, 195)` and „5" at `(206, 64)`.

Several radar labels are **shortened** from the full skill name — `Scrum`, `Story Mapping`,
`Roadmapping`, `Product Mgmt`, `Stakeholder Mgmt`, `Requirements Eng.`, `C4 / Architektur`. The
full names appear in the list beside it. These abbreviations are display strings and belong in
`copy.json`, not in the generator. See §9, gap G3.

**States.** Three: neutral (no group active), active, dimmed.

| | fill-opacity | stroke-width | stroke-opacity | label | number |
|---|---|---|---|---|---|
| neutral | 0.22 | 1.25 | 1 | `--ink` | `--ink-meta` |
| active | 0.40 | 2.5 | 1 | `--ink` | `--ink-meta` |
| dimmed | 0.05 | 1.25 | 0.22 | `#8A867A` | `#9A968A` |

The dimmed state fails AA — defect A4.

**Below 1080px the radar is removed, not shrunk.** The three grouped lists with their `n/5`
values carry the same information, which is why removing it costs nothing.

## 6. Interaction inventory

Five items. Everything else on the page is static.

1. **Language toggle.** Two buttons, `aria-pressed`, rendered twice (masthead and footer) and
   kept in sync. Sets `document.documentElement.lang`. Selected state = 600 weight + 2px `--ink`
   underline; unselected = 400 + 1px `--control-idle`.
2. **Timeline lane highlight.** Hover *and* focus on either lane dims the other — bands go flat
   `--band-dim-fill` / `--band-dim-stroke`, labels to `--ink-faint`. Reverses on blur and mouseleave.
3. **Radar group highlight.** Hover or focus a group heading in the Range list → that wedge goes
   active, the other two dim, and the heading gains the hint text „Ebene hervorgehoben".
4. **Skip link.** Hidden until focused.
5. **Viewport branch.** Wide ↔ narrow.

Items 2 and 3 are pure emphasis. **No information is available only on hover**, so they are safe
to drop entirely without JavaScript — which is what makes the JS-off fallback in §7 cheap.

## 7. Responsive behaviour

The design shipped one breakpoint at 1080px, applied in JavaScript. That is replaced. The user's
rule: **the phone layout is for phones; everything else gets the desktop layout.** Nothing is
removed from any viewport — in particular the radar, which the design deleted below 1080px, is
now present at every width.

That gives **one layout tier boundary** and **two component thresholds**:

| | Boundary | What changes | Why |
|---|---|---|---|
| Layout tier | **640px** | Portrait drops to `120px` above the text, role dates move above their titles, body prose steps to 17px, gutter to 20px, all multi-column regions collapse | The phone layout. 640px clears every current phone in portrait (largest is 430px) and sits below every tablet in portrait (768px), so no tablet ever sees it |
| Range grid | **1080px** | Two-column lists-beside-radar becomes one column, **radar above its groups** | The radar column has a 560px minimum; below ~1080px total there is not enough left for the lists beside it. Required by `docs/02-ux-spec.md:270-273` |
| Rail + timeline | **900px** | Year rail removed; timeline flips from horizontal two-lane to vertical two-column | Physics, not preference — see below |

**The 900px threshold is a trade and it is worth stating out loud.** Ten timeline bands
positioned by percentage across less than ~850px of content width put mono labels on top of one
another; the `tier: up/down` alternation is already collision avoidance at full width. The
vertical orientation exists to solve that, and the design's own 375px artboard is captioned
„Timeline gekippt" for that reason. The year rail is dropped at the same point because a fixed
104px column plus a `clamp(180px,21vw,272px)` portrait leaves the H1 under 500px, and priority 1
is the headline. So between 640px and 900px the visitor sees the desktop *content set* — nothing
missing — in a reflowed arrangement. That is the intent of the user's rule honoured as literally
as the geometry allows.

**All four boundaries are CSS media queries.** No layout state is read from JavaScript. See
defect A1: the design's `window.innerWidth` branch breaks browser text-only zoom and defaults
every JS-off visitor to the widest layout.

**The 640–1079px range was never rendered in Claude Design**, which only produced 375px and
1440px artboards. It is specified here, not observed, and phase 6 must verify it — particularly
the horizontal timeline between 900px and 1080px, which is the tightest case.

At 320px everything is single-column with `minmax(0,1fr)` and `overflow-wrap:break-word`
throughout, so there should be no horizontal scroll — **to be verified in phase 6**.

**JS-off.** Not addressed by the design, and it must be. JavaScript adds only (a) the language
toggle, if the single-document strategy is chosen, and (b) the two highlight interactions. All
layout and both diagrams are static markup. The `<noscript>` case must not be a blank page, and
`docs/02-ux-spec.md:411` additionally requires **both languages to stay reachable** without
JavaScript — which the design's JS toggle does not satisfy. Phase 5 resolves this; two generated
documents is the obvious answer and makes `lang`, `<title>` and SEO trivial at the same time.

## 8. Accessibility

Target is WCAG 2.1 AA, treated as a hard floor by the concept brief.

### 8.1 What the design gets right

- Landmarks: `header` / `main#inhalt` / `footer`, one `h1`, `h2` per section, `h3` beneath.
- Skip link, first in DOM order.
- `:focus-visible { outline: 2px solid #171716; outline-offset: 3px; }` — 17.04:1, well clear.
- `aria-pressed` on the language toggle; `role="group"` with `aria-label` around the pair.
- `document.documentElement.lang` follows the toggle — 3.1.1 and 3.1.2 satisfied.
- Radar is `role="img"` with `aria-labelledby` pointing at a real `<title>` and `<desc>`.
- Bullet em dashes are `aria-hidden="true"` — decorative glyphs stay out of the accessible name.
- Every level is printed as text (`n/5`) next to its skill, so the radar is never the only route
  to the data. 1.4.1 satisfied by construction.
- All body text passes comfortably: `#171716` 17.04:1, `#2A2822` 14.00:1, `#3B3931` 10.99:1,
  `#4E4B44` 8.26:1, `#5C594F` 6.66:1 against `#FAF9F6`.
- Every timeline band tone clears 3:1 (lowest is COBI `#0079A8` at 4.64:1).
- All three group tones clear 3:1 as strokes (4.44 – 5.83:1), which is what carries the wedge
  outlines; the low-opacity fills are reinforcement only.

### 8.2 Defects the build must fix

**A1 — layout branches on `window.innerWidth`, in JavaScript.** *Blocks 1.4.4 and 1.4.10.*
Browser text-only zoom does not change `innerWidth`, so at 200% text the page stays in the wide
layout and the fixed-height timeline and 170px date column overflow. With JS off, `w` initialises
to `1440` and every visitor gets the desktop layout regardless of device. **Fix:** CSS media
queries — or container queries — as the single source of the breakpoint. JS may read the same
breakpoint via `matchMedia` if it needs to know, but must not own it.

**A2 — fixed pixel heights on the timeline.** `132px`, `96px` and `780px` are hard-coded, with
absolutely positioned mono labels inside. At 200% text the labels overflow their lanes. **Fix:**
size the lanes in `em` or `rem` so they grow with the text, and let the narrow timeline's height
follow content rather than a magic 780.

**A3 — the radar group headings are `<button>`s that do nothing when pressed.** They respond only
to `mouseenter` / `focus`. A keyboard user tabs to one, presses Enter, and nothing happens; a
screen reader announces an actionable control that is not actionable. **Fix:** either make click
toggle a sticky highlight — the better answer, since it also gives touch users the interaction,
which they currently cannot reach at all — or drop the `<button>` and let the emphasis be
hover-only decoration on a plain heading.

**A4 — the dimmed radar state falls below AA.** Dimmed skill labels are `#8A867A` = **3.46:1**
and dimmed level numbers `#9A968A` = **2.81:1**, both against a 4.5:1 requirement. Dimmed wedge
strokes drop to 0.22 opacity, well under 3:1. **Fix:** floor the dimmed text at `#5C594F`
(6.66:1) and keep the dimmed stroke opacity at or above 0.55. De-emphasis can be carried by the
fill alone; it does not need to take the text with it.

**A5 — the radar rings encode the 1–5 scale at 1.24:1.** `#E4E1D8` is invisible to many viewers,
and the rings are what make a radial position readable as a number — so they are a graphical
object required to understand the content, not decoration. **Fix:** darken to at least
`#C6C2B6` (1.69:1 is still short; `#A9A59B` reaches ~2.6:1, `#8A867A` reaches 3.46:1). Take the
outer ring and the 1/5 tick marks to 3:1 at minimum; the intermediate rings can stay lighter if
the labelled ticks carry the scale.

**A6 — the unselected language toggle underline is `#C0BCB0` at 1.80:1.** The underline is the
control's affordance and the weight difference is subtle. `aria-pressed` covers screen readers,
so this is not 1.4.1, but it is 1.4.11. **Fix:** take the idle underline to `#8A867A` or darker.

**A7 — `tabIndex="0"` on the two timeline lanes.** They are `role="group"` wrappers with no
operation; they add two tab stops that do nothing but trigger the highlight. Defensible as a
keyboard equivalent for a hover effect, but it is unusual and the highlight conveys nothing a
keyboard user needs. **Fix:** remove the tab stops, or give them a visible focus style and a
purpose. Do not leave a focusable element with no visible focus consequence.

**A8 — the skip link uses `left:-9999px` plus a canvas-only `style-focus` attribute.** That
attribute does not exist outside Claude Design. **Fix:** ordinary `:focus` / `:focus-visible` CSS.

**A9 — radar text is 15px in SVG user units on a `width:100%` viewBox.** Effective size scales
with the container, so in the narrow half of the range grid it can render well under 15px CSS
pixels. **Fix:** verify computed size at the 1080px breakpoint, where the radar column is at its
`560px` minimum, and raise if needed.

**A10 — the portrait is `role="img"` on a striped `<div>`.** Correct for a placeholder, wrong for
a photograph. **Fix:** a real `<img>` with `alt` from `copy.meta.photoAlt`, plus `width`/`height`
to reserve layout. The file is supplied at `content/media/photo_square.jpg` — see that folder's
README for the aspect ratio and minimum size the layout assumes.

**A11 — the wedges are linked to their lists by colour alone.** A group's list and its arc are
connected only by a 13px swatch, and §2.1 measures the three tones as near-equiluminant. This
fails `docs/02-ux-spec.md:366` and WCAG 1.4.1. **Fix:** set each group's name against its wedge —
along the arc, or as a short label at the arc's mid-angle outside the outermost ring — so the
connection survives with colour removed. Promoted from open question Q4.

**A12 — the radar's group controls stay in the markup at every width.** Previously the design
removed the radar below 1080px while keeping the three `<button>`s, leaving controls for an
absent chart and an `aria-describedby` pointing at a `<desc>` that was no longer in the document.
§7 now keeps the radar at every width, which dissolves the dangling IDREF. **Fix:** verify in
phase 6 that `radar-desc` resolves in every tier, and that A3's touch and click behaviour works
in the stacked layout where the controls sit directly above the chart.

## 9. Drift and gaps

The design tracks `copy.json` revision 3 exactly for the headline, both opening paragraphs, all
section headings and intros, the attribution lines, all fourteen role bullets, both arc list
labels, the radar title and description, the scale note, and the languages block. The gaps below
were found against revision 3; **G1 and G3 are now closed by `copy.json` revision 4**, recorded in
`docs/03-copy.md`.

**G1 — the tools line is stale.** The design carries
„Werkzeug: Jira, Confluence, Miro, Office inkl. Copilot mit Agenten, **Snowflake**."
`copy.json` now reads
„Werkzeug: Atlassian Stack (Jira, Confluence), Miro, Microsoft Office Suite inkl. Copilot mit Agenten".
Snowflake was removed after the design was made. **`copy.json` wins.**

**CLOSED in copy rev. 4** as to the wording — three typos were also fixed there (`tlassian` →
`Atlassian`, „Microsoft Suite Office" → „Microsoft Office Suite", trailing full stop). What is
*not* closed is the reason the line went stale in the first place: `toolsLine` names Jira,
Confluence, Miro and Copilot, which are also facts in `cv.skills.technical[3]`. A fact duplicated
into `copy.json` is exactly what `CLAUDE.md` forbids, and it will drift again. **Phase 5 must
resolve it** — a template such as „Werkzeug: {tools}" over the `cv.json` list, with only the
label and the joining words living in `copy.json`.

**G2 — the LinkedIn link is invented.** The design hardcodes `https://www.linkedin.com/`.
`cv.meta.links` contains only Xing, and its URL is itself a placeholder
(`https://www.xing.com/profile/`, listed in `meta.placeholders`). `copy.microcopy.linkLinkedIn`
carries the note „Include only if a profile exists". **The build must render links from
`cv.meta.links` and omit what is not there** — it must not ship two placeholder hrefs.

**G3 — the shortened radar labels had no home in `copy.json`. CLOSED in copy rev. 4.**
`sections.range.radarLabels` now holds **eight** entries — the earlier count of seven was wrong —
keyed by the `cv.json` skill name, falling back to the full name when absent. Six are
language-neutral abbreviations (*Product Mgmt*, *Requirements Eng.*, *Stakeholder Mgmt*, *Scrum*,
*Story Mapping*, *Roadmapping*); two differ per language (*Teamführung* / *Team leadership*,
*C4 / Architektur* / *C4 / Architecture*).

**G5 — two skill names and two institution names were German-only facts. CLOSED in copy rev. 4.**
`cv.json` holds `Teamführung` and `C4-Modell / Architekturdiagramme` as skill names, and
`Karlsruher Institut für Technologie (KIT)` and `… – Institut für Produktionstechnik` as
institutions. Rendered as facts, the **English** page showed all four in German. `copy.json` now
carries `sections.range.skillLabels` and two `institutionLabel` entries. The other sixteen skill
names and both Spanish universities are not duplicated — a name needing no translation stays a
fact. Same bug class copy rev. 3 fixed for the languages block.

**G6 — about a dozen rendered strings had no key at all. CLOSED in copy rev. 4.** The ten
timeline band labels, the two lane labels, the year rail label, and the highlight status text.
The band labels matter most: they are editorial, not organisation names — `cv.json` says
*Universidad de Sevilla*, the bar says *Industriedesign, Sevilla* — so they could never have been
derived. They are keyed with the existing `copy.json` keys (`sevilla-diplomatura`, `zuhlke`, …)
rather than the handoff's short keys, so a band pairs to the same entry as its role text.

**Carried forward from G3, G5 and G6:** `skillLabels`, `radarLabels` and `timelineBands` are keyed
by strings — a `cv.json` skill name, or a `copy.json` slug. Renaming a skill silently drops its
translation. **Phase 5 should re-key to ids when it adds them** (§10 Q7), which is the same work
as the timeline `id`s and should be done once, together.

**G4 — `copy.microcopy.levelAriaFormat` is unused.** The design gives the radar one `<desc>` and
relies on the adjacent list for the numbers. That is a legitimate reading of the AA requirement,
so the key is either redundant or a missed opportunity. Phase 5 decides: use it as the accessible
name of each spoke, or delete it from `copy.json`.

**Not drift:** the portrait. `copy.meta.photoAlt` exists and `cv.meta.photo` names
`photo_square.jpg`, so the photo is approved content — the file is simply missing (Q3).

## 10. Open questions

Q1–Q5 were put to the user on 2026-08-31. Four are resolved and recorded below; the fifth
collapsed on inspection and is replaced by the question it was hiding.

**Q1 — breakpoint. RESOLVED.** The phone layout is for phones only; every other viewport gets
the desktop layout. Implemented in §7 as a layout tier boundary at 640px, the range grid at
1080px, and the rail and timeline orientation at 900px. The radar is no longer removed at any
width. Note that this also satisfies `docs/02-ux-spec.md:270-273`, which mandates a medium tier
where the radar moves above its groups — a requirement the earlier single-breakpoint draft
missed.

**Q2 — fonts. RESOLVED: self-hosted.** The user was indifferent and leaned toward the Google
Fonts `<link>`. Decided against it on two grounds: a `<link>` to `fonts.googleapis.com` transmits
every visitor's IP to Google before the page paints, which for a German-facing personal page is a
real exposure (LG München I, 3 O 17493/20, awarded damages for exactly this), and two extra
connections on the critical path cost more than the ~40 KB of subset WOFF2 they replace. Both
families are open-licensed. This is one line of CSS either way — say so and it reverts.

**Q3 — portrait. RESOLVED.** `content/media/` now exists with a README stating the filename,
aspect ratio, minimum size and framing. The user supplies `photo_square.jpg` there. `cv.json`
already names that file. Remaining for phase 5: whether a missing file is a build error or a
silently omitted element, and where the file is copied to in the output.

**Q4 — should the radar wedges be labelled in place? RESOLVED: yes, this is a requirement.**
Not a preference. `docs/02-ux-spec.md:366` binds "no meaning by colour alone — arcs are
distinguished by their labels and their position, not only by fill", and §2.1 of this document
measures the three group tones as near-equiluminant (relative luminance range 1.06–1.31), so the
13px swatch cannot be the only link between a group's list and its wedge. Tracked from here as
defect **A11** rather than as an open question.

**Q5 — the year rail. WITHDRAWN; the premise was false.** Q5 asked whether a decorative,
not-to-scale rail undercuts the to-scale timeline. Measurement of the handoff shows the rail is
linear at 34.75px per year and is generatable from `cv.json` — §3 is corrected. The real question
it was obscuring:

**Q6 — the two time axes run in opposite directions. RESOLVED: deliberate.** The year rail in
section 2 runs newest at top (2026 at `top:34px`, 2007 at `top:694px`); the timeline in section 4
runs oldest at left. The user confirms this is intended, and it is recorded here as a decision so
that **phase 6 does not "fix" it.** Neither axis may be flipped to match the other.

The reading it encodes: the rail is the CV *as read* — you arrive at the top of the page in the
present and travel back — while the timeline is the career *as lived*, left to right. Two
different questions about the same eighteen years, asked in the two places the page asks them.

The objection this question raised does not in fact arise, because of §7's thresholds. The rail
is removed below 900px and the timeline flips vertical below 900px — the same boundary — so the
two are never both vertical on screen at once. Above 900px one is vertical and one is
horizontal, which reads as two different instruments rather than two contradictory ones. Below
900px the rail is gone and the vertical timeline (oldest at top) is the only time axis present.

The residual, for the record: on a narrow viewport a reader meets no rail at all, and between
900px and 1080px they meet the rail first and the horizontal timeline three sections later. The
directions are therefore never compared side by side, only in sequence and across a change of
orientation. That is why the decision costs nothing.

**Q7 — where the per-band colours and `tier` flags live. RESOLVED: in `cv.json`, as data the
user maintains.** Each timeline entry gains a stable `id` and its own tone. A missing tone is a
**loud failure** — the diagram does not render — consistent with the existing rule for a skill
with no level (`docs/02-ux-spec.md`, edge cases). The page does not invent a colour, and does not
degrade quietly. Keeping a new entry legible is the maintainer's job at the moment of editing,
not the build's job to guess.

Adding `id` to the `experience`, `education` and `earlierStations` entries is agreed, but it is a
change to `cv.json`'s shape, which `CLAUDE.md` assigns to phase 5 (architecture). Recorded here
as decided; applied there. The nine keys the handoff already uses — `sev cad kit mov kith bos
cobi fxxl zuh gls` — are the natural starting set.

One asymmetry worth stating, because it is the single case this decision does not cover. Colours
only change when the user edits a file, so "the maintainer handles it" holds exactly. `tier` does
not: under UX rev. 2 the axis end moves every time the page loads, so `pctPerYear` shrinks by
about 5% a year and every band creeps leftward and closer together **with no edit at all**. A
label pair that clears today can collide next spring, on a page nobody has touched. Computing
`tier` at load — walk the bands in order, alternate rows only where a label would overlap its
predecessor — is roughly ten lines and removes the drift permanently. Recommended; if it stays
stored data, this document is on record that the arrangement has a shelf life.

## 11. What phase 5 must decide

- Build-time generation of the radar SVG from `cv.json` levels using §5.2. Non-negotiable: it is
  the difference between "change a level" being one JSON edit and being an SVG rewrite.
- Build-time computation of the timeline percentages using §5.1, **including recomputing the
  open-ended current role against the build date**.
- The two-language strategy: both languages in one document with a JS toggle (what the design
  assumes), or two generated pages. This decides whether `lang` switching, SEO, and the JS-off
  fallback are cheap or awkward.
- The `radarLabels` data shape from G3, and the `levelAriaFormat` decision from G4.
- Token delivery: CSS custom properties on `:root`, with the `oklch` group tones and their sRGB
  fallbacks.
- Font subsetting and self-hosting — decided in Q2, phase 5 chooses the subsetting mechanism.
- Where the radar and timeline generators live, what runs them, and how the geometry is tested.
  **Not** whether to use a charting library — §5.0 settles that.
- Whether a missing `content/media/photo_square.jpg` is a build error or a silently omitted
  element, and where the file lands in the output.

## 12. Out of scope

Unchanged from the UX spec, and the design respects all of it: no print stylesheet, no PDF, no
email or phone or postal location, no contact form, no analytics, no dark mode, no animation
beyond the state changes in §6, no internal navigation.
