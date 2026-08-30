STATUS: APPROVED

# UX Spec

Phase 2. Derived from `docs/01-concept-brief.md` and the real content in `content/cv.json` and
`content/copy.json`. Decides what goes where and in what order. No colour, type or visual style
— that is phase 4 (UI).

**Note on the skill template.** `.claude/skills/ux-designer/SKILL.md` mandates a "Print
behaviour" section and an interview question about the PDF. `CLAUDE.md` puts print out of
scope and publishes no PDF. `CLAUDE.md` wins, so that section is absent by design, not by
omission. The skill file is stale and should be corrected.

**Note on phase numbering.** This spec follows `CLAUDE.md`'s phase table: 3 = Copy
(`content/copy.json`), 4 = UI, 5 = Architecture, 6 = Build. `docs/01-concept-brief.md` in
places still uses "phase 3" for typographic and visual decisions that belong to phase 4 (UI);
that mismatch changes nothing here.

## Revision 5 — one correction from phase 3

Returned to `DRAFT` under gate-protocol rule 4. Phase 3 rev. 3 hit a sentence in this document
that cannot be satisfied: revision 4 sent the three skill-group names to `cv.json`, which is
the language-neutral facts file and holds one language. A rendered group heading is prose and
duplicates per language, so the English page would have carried German headers, and the merged
group had no name in either language. **The group labels now live in `content/copy.json`**
(`sections.range.groupProduct` / `groupTechnical` / `groupMethods`), keyed to `cv.json`'s
category strings, which stay as the grouping key. Nothing else in this spec changed; the
structure, the radar requirements and the reading flow all stand.

Two smaller corrections came with it: the arc's two sub-lists gained labels
(`sections.arc.educationLabel`, `earlierStationsLabel`), and the languages block gained a
bilingual mirror in `copy.json` — it had been German-only in `cv.json`, which would have ended
the English page's Range section in German.

`docs/01-concept-brief.md` is unaffected and stays `APPROVED`. `docs/03-copy.md` is at `DRAFT`
alongside this.

## Revision 4 — the plausibility pass

Revisions 2 and 3 patched this spec while phase 3 was running: bullet budgets moved, the
above-the-fold rule was relaxed. Revision 4 is different — it is a full re-read of this spec
against the finished `content/copy.json` and the rev.-4 concept brief, and it repairs six
places where the spec had gone stale, self-contradictory, or arithmetically impossible.

| # | What was wrong | Resolution |
|---|---|---|
| 1 | `meta.headline` was a live, edited, bilingual string with no slot in the IA. The inventory claimed the opening statement "replaces" it; phase 3 kept it. | **The headline is now the page's display-scale line**, in the opening section above the statement. Decided in interview. |
| 2 | Above the fold was unachievable. This spec said "opening line at display scale"; `03-copy.md` said the display-scale run ends at "fürs Business" — 35 words, 226 chars. That cannot clear a 375px fold beside a work row. The declared fallback `openingStatementShort` is 31 words / 223 chars — the same size as the block it was meant to rescue. | Fixed by resolution 1. The display-scale text is now 9 words (de) / 11 (en). The whole 61-word statement runs at reading size. `openingStatementShort` is no longer needed by this spec. |
| 3 | Above-the-fold priority 1 called the display line "the span claim". Since brief rev. 4 the opening is the **generalist** claim; the span is the paragraph's last sentence — the part this spec permits to drop below the fold. The spec was protecting the wrong sentence. | Priority list rewritten around the headline and the generalist claim. |
| 4 | The reading-flow paragraph argued that the diagram shows "where the three lenses came from" and turns the Industriedesign → Wirtschaftsingenieurwesen → product sequence into "an explanation". That is the degree-sequence causality phase 3 established as **false** and binding. | Reading flow rewritten. The diagram's argument is now simultaneity, which is what the dates actually support. |
| 5 | The arc required a non-linear axis (study years compress, recent years expand) **and** required the 2012–2015 overlap to be legible. The first rule destroys the second — and expands the years the work list already covers in full. | **Uniform axis.** Decided in interview. One year, one unit, 2007 to present. |
| 6 | Range assumed two poles. Phase 3 delivered three groups, the third holding one item; the skill→pole mapping existed only as a table in `docs/03-copy.md`, in no machine-readable file; `Teamführung` was assigned to nothing. | **Three groups taken straight from `cv.json`'s own categories**, plus an interactive radar. Decided in interview. See *The range — structural requirements*. |

**Two decisions in this pass override earlier documents. Both are the user's, both are recorded
rather than smoothed over:**

- **Skill proficiency levels are now in scope.** `docs/01-concept-brief.md` content priority 5
  reframes skills "as evidence for the span … rather than a keyword dump", and rules out
  "skill bars and percentage proficiency meters" by inference from it. A radar plotted on
  self-assessed levels is a proficiency meter. The user chose it after that conflict was put
  to them explicitly. **The brief's priority-5 sentence is therefore contradicted by this
  spec and should be reconciled at its next revision** — this spec does not edit an approved
  document.
- **The „Beide Enden" heading stays over three source-shaped groups.** The user chose this
  over rewriting the section's copy. The cost is named in *The range* below: the heading
  promises two ends and the content delivers three categories, and with three arcs the
  opposition cannot be carried by the geometry.

**On the concept brief's Core message.** It states the proof of range as "the Figma prototype
and the architecture diagram both come from him." The user confirms this is **true** but that
phase 3 was right not to render it as page copy — it reads as artefacts produced rather than
scope owned, and the shipped opening states the span as responsibility instead. It stands as a
true statement in the brief; it is not a copy instruction, and no downstream phase should
reintroduce the artefact list into the page.

## Site shape

**One page, one continuous scroll, one document per language.**

Rejected: anchored sections with a nav, and a small multi-page site. Both fragment the single
continuous read the concept is built on — the argument is cumulative, and a reader who jumps
to "Skills" from a nav has skipped the thing that makes the skills mean anything. Both also
add routing or scroll-spy machinery against priority 2.

The two language versions are structurally identical. Whether they are two documents or one
document switched at runtime is phase 5's (architecture) decision; nothing in this spec depends
on the answer, except that the `lang` attribute must be correct for whichever version is
showing.

## Section inventory

| # | Section | Purpose | Source fields | Priority |
|---|---|---|---|---|
| 0 | Document head | `<title>`, meta description, Open Graph card, `lang`. Not visible; the brief's SEO-hygiene scope. | `meta.pageTitle`, `meta.metaDescription`, `meta.ogTitle`, `meta.ogDescription` (copy.json) | Must |
| 1 | Masthead | Name, and the language toggle. Nothing else. | `meta.name` (cv.json); `microcopy.langToggle*` (copy.json) | Must |
| 2 | Opening | **The headline at display scale**, then the statement paragraph at reading size, with the photo. The whole positioning in one screen. | `meta.headline`, `meta.openingStatement`, `meta.photoAlt` (copy.json); photo path `meta.photo` (cv.json) | Must |
| 3 | Work | Section heading, then the four principal roles, reverse chronological, with the bullet budget below. | `experience[]` dated facts — employer, title, dates (cv.json); `sections.work.heading`, `roles.*.summary`, `roles.*.bullets[]` (copy.json) | Must |
| 4 | The arc | Heading, the three-line attribution block, the two-lane timeline, and beneath it the compact education and early-stations lists it indexes. | `education[]`, `earlierStations[]`, `experience[]` dated facts (cv.json); `sections.arc.*` incl. `educationLabel` and `earlierStationsLabel`, `education.*.fieldLabel`, `earlierStations.*.roleLabel` (copy.json) | Must |
| 5 | Range | The three skill groups and the radar, closing with the tooling line and languages. | `skills.technical[]` items and category keys, `meta.languages[]` (cv.json); `sections.range.*` incl. the three group labels, `languages.*` names and levels, `microcopy.level*` (copy.json) | Should |
| 6 | Human footer | Hobbies, interests, outbound links, language toggle repeated. | `hobbies[]`, `interests[]`, `meta.links[]` (cv.json); `sections.footer.*`, `microcopy.link*` (copy.json) | Should |

Sections 3, 4, 5 and 6 each carry a visible heading from `copy.json`. Sections 1 and 2 do not —
the name and the headline are the heading.

Field paths are indicative. Shipped content is two files, per `CLAUDE.md`: `content/cv.json`
holds language-neutral facts (dates, company and institution names, links) once;
`content/copy.json` holds the per-language prose and is what phase 4 (UI) and phase 6 (build)
consume for shipped text. Phase 5 (architecture) owns the final data contract; it may rename or
restructure freely so long as no fact is duplicated across languages.

**Not present as sections:** contact details (cut by the brief), personal skills (cut),
education sub-bullets (cut), projects and publications (empty and unsourced).

**Fields in `cv.json` that must not reach the page.** The phase-0 extraction still carries
prose and stale pointers that the two-file split supersedes. Phase 6 renders none of them:
`meta.headline` and `meta.headlineParts` (the Head-of-Product line, barred by the brief),
`summary`, `experience[].summary` and `experience[].highlights` (superseded by `copy.json`),
`skills.personal` (cut), `education[].highlights` (cut), and **`meta.contact`, which still
holds a placeholder email, phone and location** — the brief bars all three from a public page.
`experience[0].resultHighlightIndex` points at the outcome bullet's old last position; phase 3
moved it to first, so the pointer is stale and must not drive ordering.

### Bullet budget — binding

| Role | Bullets | Rationale |
|---|---|---|
| GLS IT Services, Product Owner | 6 | Leads. Retains the quantified outcome — tool adoption doubled — which is the only number in the CV, and which opens the role rather than closing it. |
| Zühlke Engineering, Expert Business Analyst | 5 | One per client project — special-machinery/IoT, medtech, appliances/master-data, consumer IoT, aviation. Breadth must read as breadth, not as a summary claim. |
| Fahrrad XXL, Produktmanager E-Bike | 2 | Supporting. |
| COBI, Account Manager Business Development | 1 | Supporting. Has no summary line in the source and does not need one. |

Fourteen bullets, down from twenty. Delivered and verified against `content/copy.json`.
Hierarchy is produced by the quantity of text itself, so no visual device is needed to signal
which role matters. Each role also carries its own one-line summary except COBI.

## Above the fold

**Desktop.** A thin masthead — name left, language toggle right. Below it the opening occupies
the left roughly two thirds: **the headline at display scale**, and beneath it the statement
paragraph at a reading size. The photo is a block to its right, vertically aligned to the
opening rather than to the viewport. Under the statement, a rule, then the top of the work
section — its heading, and as much of the first role row (date, role, company for GLS) as the
viewport allows. Nothing else. No scroll cue, no button, no navigation.

The clipped work section is doing real work: it tells a hiring manager arriving mid-application
that this is a CV and that there is a career below, without the opening having to share
authority with anything.

**375px.** Masthead, headline, statement, photo, work heading. What must survive above the
fold, in this priority order, and phase 4 (UI) must respect it:

1. **The headline, complete, at display scale, never truncated.** 9 words in German, 11 in
   English. This is the positioning; it is not permitted to break across the fold.
2. The statement's first sentence, at reading size.
3. The work section heading.
4. The photo.

On a short viewport the tail of the statement and the photo drop below the fold. That is the
correct trade: the headline is the claim, the statement is its elaboration.

**`openingStatementShort` is no longer required.** It existed as the fallback for a
display-scale block that no longer exists, and at 31 words it was never shorter than the block
it was rescuing. Phase 3 may retire it; if it is kept, nothing in this spec renders it.

**One knock-on for phase 3.** The headline and the statement's first sentence now sit two lines
apart and make the same claim in the same words — „Technisch-business Generalist" above „Ich
bin technisch-wirtschaftlicher Generalist". `docs/03-copy.md` already flags the DE/EN
inconsistency in that term; with both strings now rendered adjacently, the echo is a copy
problem this spec cannot solve. Phase 3 should either trim the statement's opening clause or
settle the term to one rendering.

## Reading flow

**Intended path** — the hiring manager who reads:

Headline → statement → GLS in detail → back through Zühlke, Fahrrad XXL, COBI → the arc, where
the attribution block names the three lenses and the diagram shows the years they were built in
→ education and early stations as the arc's footnotes → range → the human close.

The order is deliberate: the diagram sits *after* the work list, not before it. A reader who
meets it cold has no roles to attach it to. A reader who has just finished the career sees the
shape of what they read. This also gives education and the early stations a home — they hang
off the diagram as its labels instead of sitting at the bottom of the page as an appendix
nobody reaches.

**What the diagram argues.** Not that the sequence of degrees produced the range — phase 3
established that claim as false and the correction is binding. What the dates actually show is
**simultaneity**: through 2012–2015 the Wirtschaftsingenieurwesen years run alongside the
Movand internship, the KIT assistantship and the Bosch placement. That is the visual evidence
for the attribution block's third line — that the technology came from work and curiosity, not
from a lecture hall. The diagram shows *when the lenses were being built*, and shows that two
of them were being built at once. It does not claim causality between them.

**Scan path** — the reader who will not read: headline, GLS role title and its quantified
outcome, the diagram's shape, the years, the radar's shape. The page must survive being read in
that order alone, which is why the outcome bullet is protected in the budget and why both
diagrams carry text labels rather than relying on the reader having read the lists.

## Interaction inventory

Five interactive things exist on this page. Everything else is text.

**1. Language toggle.** In the masthead, repeated in the human footer so a reader at the bottom
of a long page is not sent back to the top.
- **Labels come from `copy.json`** — `microcopy.langToggleDe` / `langToggleEn`, which supply
  full words ("Deutsch" / "Englisch"), not the two-letter form earlier drafts of this spec
  assumed. Phase 4 sets the presentation; the accessible name is the full word.
  `microcopy.langToggleAriaLabel` names the control group.
- States: current language marked as current, not merely styled — `aria-current` or an
  equivalent that is not colour-dependent, per the AA floor.
- Keyboard: two ordinary focusable controls, visible focus, activated by Enter or Space.
- Changing language changes the document `lang` attribute.
- Without JS it must still work — which pushes phase 5 (architecture) toward two documents and
  plain links.
- Justification: a hard constraint from the brief. Bilingual is non-optional.

**2. Timeline lane highlight.** Hover or keyboard focus on a lane emphasises it and
de-emphasises the other; nothing is ever hidden.
- Both lanes are fully visible at rest and remain so with JS disabled. The highlight is an
  enhancement, never the means of reading the diagram.
- Keyboard: each lane is a single focusable element with an accessible name, in DOM order —
  studies, then work. Not each segment; that would flood the tab order.
- Touch: no hover exists. Tap highlights, tapping elsewhere clears.
- Reduced motion: the transition is removed, the state change is instant.
- De-emphasis must not push any text below the AA contrast floor — on touch a lane can be left
  dimmed.
- Justification: the reader asked to be able to separate studies from work. This is the
  cheapest version that does it, and the only one with no failure state.

**3. Range radar highlight.** Hover or keyboard focus on one of the three group labels
emphasises that group's arc and dims the other two. Same pattern as the timeline lanes, same
rules: nothing hidden, dimmed text stays above the contrast floor, reduced motion removes the
transition, touch taps to highlight and taps out to clear.
- Keyboard: **three focusable elements — one per group, not one per spoke.** Eighteen tab stops
  for eighteen skills would flood the tab order for no gain.
- Justification: chosen by the user in interview. It is the only interaction on this page not
  demanded by a hard constraint, and it is specified to the same no-failure-state standard as
  the timeline so that its cost stays proportionate.

**4. Outbound links (Xing, LinkedIn).** Ordinary links in the human footer, external, with the
destination legible. No icons standing alone. LinkedIn renders only if a profile exists.
- Justification: the brief's only permitted contact surface.

**5. Skip link.** To the main content, first in the tab order. Required for keyboard users on a
single long page.

### Explicitly rejected interactions

- **Filter or hide controls on the timeline.** Asked for in interview, then decided against in
  favour of highlight-only.
- **Persistent year rail down the work list.** Considered, and dropped with the same decision.
- **Collapsing older roles, accordions, "read more".** The bullet budget already solved the
  length problem. Progressive disclosure would hide content from the reader who scans and add
  state for no gain.
- **Scroll-driven animation, pinning, parallax, fade-in-on-scroll.** Named as an anti-reference
  in the brief. Also costs speed and fights the reflow requirement.
- **Sticky navigation or scroll-spy.** No anchored sections exist to navigate.
- **Tooltips on radar spokes.** The level is rendered as text beside the skill name; a tooltip
  would hide it behind a hover that touch cannot produce.

## Responsive behaviour

Described as behaviour, not pixel values. Phase 4 (UI) sets the actual breakpoints.

**Wide.** Two-column opening — headline and statement left, photo right. Work list runs as date
/ content columns with the dates in their own aligned column. The timeline runs horizontally,
time left to right, two lanes stacked vertically. The range presents the radar beside its three
labelled groups.

**Medium.** The opening stays two-column until the statement can no longer hold its line
length, then stacks. Work list keeps its date column. The timeline stays horizontal. The radar
moves above its groups rather than beside them.

**Narrow.** Single column throughout. The opening stacks in the priority order above. Dates
move above their role rather than beside it. **The timeline rotates: time runs top to bottom,
and the two lanes become two adjacent vertical columns.** Overlap stays legible as horizontal
adjacency, and no horizontal scrolling is introduced — a horizontally-scrolling diagram
container would technically satisfy reflow but would hide the overlap, which is the one thing
the diagram exists to show. **The radar is dropped** below the width at which its eighteen
spoke labels stay legible; the grouped lists carry the same information at every width and are
always present, so nothing is lost. See *The range* below.

At every width, the page itself never scrolls horizontally, and all content and function
survive at 200% text size — both are AA floor requirements from the brief, not preferences.

## The arc — structural requirements

The diagram is a content object, not decoration, so its behaviour is specified here rather than
left to phase 4 (UI).

- **A three-line attribution block heads the section** (`sections.arc.intro` +
  `sections.arc.attribution`): what Industriedesign contributed, what Wirtschaftsingenieurwesen
  contributed, and that the technology came from experience rather than either degree. Three
  short labelled lines, not a diagram, and not to be conflated with the timeline's lane labels.
- **Two lanes: studies and work.** Both drawn for the full span, 2007 to present.
- **Uniform time axis.** One year, one unit, end to end. Revision 4 replaced the earlier
  non-linear rule, which compressed exactly the years the diagram exists to show and expanded
  the years the work list above already covers in full. A uniform axis needs no
  compression-disclosure tick labels to be honest, and it is trivially generated from the dated
  records.
- **The empty stretches are expected and must not be padded or hidden.** 2007–2011 is
  studies-only; 2016 onward is work-only. A lane with nothing in it is a true statement about
  those years. Phase 4 must not invent filler bands, and must not crop the axis to hide them.
- **The overlap is the feature.** 2012–2015 must visibly show Wirtschaftsingenieurwesen
  (Cádiz, 03/2012–10/2015, with the KIT exchange 10/2013–10/2014 inside it) running while
  Movand (03–06/2012), the KIT assistantship (02–12/2014) and Bosch (01–09/2015) happen
  alongside. If a design renders that period as a single undifferentiated block, it has failed.
- **Every band carries a text label.** Meaning may not be conveyed by colour, fill or position
  alone; this is an AA floor requirement and it also makes the diagram work in the scan path.
- **The diagram is generated from the same dated records as the work list**, never hand-drawn
  with its own copy of the dates. A date exists once. Hard-coding the geometry would duplicate
  facts across the page and break priority 2 on the first CV update.
- Directly beneath it: the three degrees as single lines, then the three early stations as
  single lines. Both are demoted, both stay factual, neither gets sub-bullets.

## The range — structural requirements

Added in revision 4. The section's structure, its chart, and the data the chart does not yet
have.

**Three groups, taken from `cv.json`'s own categories.** Chosen by the user in interview over
the two-pole regrouping earlier drafts assumed:

| Group | Grouping key in `cv.json` | Label in `copy.json` | Items |
|---|---|---|---|
| Produkt & Führung | `skills.technical[0]` | `sections.range.groupProduct` | 6 |
| Technisch | `skills.technical[1]` | `sections.range.groupTechnical` | 7 |
| Methoden & Werkzeug | `skills.technical[2]` + `[3]` merged | `sections.range.groupMethods` | 5 + 4 |

This is the version of the section with **no mapping to maintain**. Every skill belongs to
exactly one group because `cv.json` already says which, so no skill can be silently dropped —
which is what happened to `Teamführung` under the two-pole proposal in `docs/03-copy.md`. Adding
a skill to `cv.json` places it automatically.

**The heading stays „Beide Enden" / "Both ends".** The user's choice, and the cost is real and
named here so phase 4 does not try to fix it in the layout: the heading promises two ends and
the section delivers three groups. `sections.range.intro` still describes a two-pole span, and
`sections.range.intro` was rewritten in phase 3 rev. 3 to carry the span idea in prose so the
heading is not left unsupported, and the three obsolete pole labels were deleted.

**The group labels are prose and live in `copy.json`** — corrected in revision 5. `cv.json`'s
category string is the grouping key the two files pair on; the rendered heading is a `{de, en}`
label in `sections.range.group*`. Revision 4 sent the names to `cv.json`, which cannot hold two
languages without duplicating prose into the facts file — the thing `CLAUDE.md`'s content model
exists to prevent.

**The radar.** Chosen by the user in interview, against this spec's earlier out-of-scope line
and the brief's content priority 5. Requirements:

- **One spoke per skill**, eighteen in total — the Produkt & Führung, Technisch and Methoden
  items. **The four Tools items are not spokes**; rating "Office" on a five-point scale claims
  something no reader believes. They render as `sections.range.toolsLine`, the quiet text line
  phase 3 already wrote, inside the Methoden & Werkzeug group.
- **Spokes are grouped into three contiguous arcs**, in the order Produkt & Führung → Methoden
  & Werkzeug → Technisch. The two named ends are placed as far apart as three arcs permit, with
  the methods arc between them, reading as the bridge. **With three arcs, true opposition is
  geometrically impossible** — „Beide Enden" is carried by the labels and the copy, not by the
  shape. That is the cost of keeping the heading over three groups.
- **The shape is the argument.** A radar filled across all three arcs is what a generalist
  looks like; a radar filled on one arc is what a specialist looks like. This is the one
  reading that justifies the chart's cost, and phase 4 should compose for it.
- **Text equivalent, always present.** The three grouped lists render as text at every width,
  with each skill's level beside its name. The radar is a second view of data the page already
  states in words — never the only place a skill or a level appears. This satisfies the AA
  floor without a hidden `alt` doing the work.
- **No meaning by colour alone.** Arcs are distinguished by their labels and their position,
  not only by fill.
- **Generated at build time from `cv.json`.** A static SVG, drawn from the same records as the
  lists. No runtime JS is required to draw it; the highlight interaction is progressive
  enhancement on top. With JS disabled the chart and the lists both render.
- **Dropped, not scrolled, when it stops being legible** — below the width at which eighteen
  spoke labels fit, and at text sizes where labels collide. The lists carry the same
  information, so this is removing a redundant view, not hiding content.
- **Phase 4 must load the `dataviz` guidance before drawing it.** Form, label placement, scale
  treatment and colour are that phase's decisions, and a radar is the form most likely to be
  drawn badly.

**The data does not exist yet.** `cv.json` holds skill *names* only. The radar needs a
self-assessed level per skill, and phase 3 refused to write "messbar" for exactly this reason —
nothing evidences it. Therefore:

- **Phase 5 adds a level field.** `skills.technical[].items` becomes objects — name plus an
  integer level on a declared scale (1–5 unless the user sets another) — rather than strings.
  The level is a language-neutral fact and belongs in `cv.json`, never in `copy.json`.
- **The user supplies eighteen values.** Nobody else can. They are self-assessment, not
  measurement, and the page should not imply otherwise.
- **Until the levels exist, the radar does not render.** The section falls back to the three
  grouped lists, which are the shipping content either way. **The build must not default a
  missing level** to a midpoint, to zero, or to anything else — an invented number is the exact
  failure phase 3 refused.

**The section closes** with the tooling line and then languages —
`sections.range.languagesLabel` over `meta.languages[]` from `cv.json`, with the language
**names and proficiency levels rendered from `copy.json`'s `languages.*`**. Those are rendered
text and duplicate per language; before phase 3 rev. 3 they existed only as German strings in
`cv.json`, which would have closed the English page's Range section in German.

## Empty and edge cases

| Case | Required behaviour |
|---|---|
| Long German compounds (*Personaleinsatzplanungssystem*, *Wirtschaftsingenieurwesen*) in a role title, diagram label or radar spoke | Must wrap, never truncate with an ellipsis and never overflow. This is the practical reason display type is display-only, and a reason the radar drops rather than shrinks. |
| A role with no summary (COBI today) | Renders without a gap or a placeholder. The summary is optional in the template. |
| Current role, `end` is null | Renders as an open range using `microcopy.currentRoleDateSuffix` — "11/2023 – heute" / "– present". **Phase 4 picks one form and uses it everywhere**; earlier drafts of this spec also permitted a bare em dash ("2023—") and `copy.json` records both. Never "null", never today's date. |
| A missing English string | Phase 5 (architecture) decides fail-build vs fall-back-to-German. The page must never show an empty element or a raw key. |
| A skill with no level | The radar does not render at all. See *The range*. No defaulting. |
| A skill added to `cv.json` | It joins its category's group and gains a spoke. If it has no level, the radar stops rendering until one is supplied — a loud failure, deliberately, rather than a quiet wrong number. |
| Group with 4 items vs 9 | The three groups are visibly unequal (6 / 7 / 9) and that is fine. No fixed-height columns, and the radar's arcs are proportional to their item counts, not forced equal. |
| Photo missing or slow | The opening is never blocked by it and never reflows around its arrival. Reserved space, `meta.photoAlt` from `copy.json`. |
| A new role added, or a date changed | One edit to `cv.json` for the dates, one per language in `copy.json` for the prose. The work list, the diagram geometry and the axis all follow. Nothing about page position is hand-tuned per entry. |
| JS disabled | Everything is readable. Both timeline lanes visible, the radar drawn, all three skill groups listed, both languages reachable, no hidden content. |
| Fifteen roles instead of four | Out of scope as a design target, but the diagram must not assume exactly four work entries. |

## Out of scope

Phase 4 (UI) must not reintroduce these.

- **Print stylesheets and any PDF.** Out of scope per `CLAUDE.md`.
- Contact details of any kind — email, phone, postal location. Including the placeholders still
  sitting in `cv.json`'s `meta.contact`.
- A call-to-action, a hero button, feature cards, testimonial blocks — the startup-landing-page
  anti-reference.
- Dark background with a saturated neon accent — named anti-reference.
- Scroll-jacked or scroll-triggered animation — named anti-reference.
- **Skill bars, percentage meters and proficiency dots.** Skill *levels* are now in scope, on
  the radar and as text beside each skill name — that is the user's explicit override, recorded
  above. A second meter rendering the same numbers a second way is not.
- The Head-of-Product ambition headline, in any form.
- Case studies or project pages. `projects` and `publications` are empty and nothing sources
  them.
- Progressive disclosure of any kind.
- Search-engine keyword targeting. SEO is hygiene only, per the brief.

## Assumptions

Inferred rather than asked. Correct any that are wrong.

1. **The diagram sits after the work list, not before it.** Reasoned from the reading flow, not
   asked directly. If you want the arc to open the career section instead, it changes the
   section order but nothing else here.
2. **Education and early stations live under the diagram** rather than as their own sections.
   This is what stops them being a dead appendix, but it does demote them further than the
   brief strictly required.
3. **Languages close the Range section** rather than sitting in the footer. The brief ranks
   languages as *supporting*, not demoted, and the footer would demote them.
4. **Tools are not radar spokes.** They stay as the quiet text line inside the Methoden &
   Werkzeug group. Reversible — if you want Jira and Office rated, they become four more
   spokes and four more numbers to supply.
5. **The level scale is 1–5 integers.** Say the word if you want 1–10, or a three-step
   scale, or something other than a number.
6. **The masthead is static, not sticky.** The language toggle is duplicated in the footer
   instead. Cheaper, and it keeps the opening screen undisturbed.
7. **`interests[]` survives in the human footer** alongside hobbies, per the brief's own
   Assumption 5.
8. **The photo is a single square image.** `meta.photo` names one file and the LaTeX source
   used it as a portrait.
9. **The headline renders identically in both languages' layouts.** German is 9 words, English
   11; phase 4 sets the display size against the longer of the two so neither breaks the fold.
