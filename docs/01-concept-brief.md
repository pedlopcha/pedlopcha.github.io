STATUS: APPROVED

# Concept Brief

*Revised against the updated `CLAUDE.md` (print out of scope, `cv.tex` not a parity target,
priority 3 restated as speed / a11y / SEO, prose rewrite reassigned to the phase 3 Copy phase).
Sections changed in this revision: References, Constraints, Assumptions, Open questions. The
"Outstanding phase 1 work" section was removed — phase 1 no longer owns the prose rewrite;
that work now belongs to phase 3 (`/copy`), except restructuring `cv.json` into the
language-neutral-facts / per-language-prose shape, which is unassigned and needs an owner
(see `docs/02-ux-spec.md` and CLAUDE.md notes) before phase 5 (architecture).*

*Revision 2 (returned to DRAFT): corrected to `CLAUDE.md`'s two-file content model —
`content/cv.json` holds language-neutral facts, `content/copy.json` holds the per-language
prose and is the phase 3 (`/copy`) output that phase 4 (UI) and phase 6 (build) consume.
Sections changed: Constraints (the content-files bullet) and Open questions. Downstream doc
revised in the same pass: `docs/02-ux-spec.md`. Not swept, still flagged for re-approval:
this brief uses "phase 3" in several places for typographic/visual calls that `CLAUDE.md`'s
table assigns to phase 4 (UI).*

*Revision 3 (returned to DRAFT): the Core message was reworded during phase 3 (`/copy`).
Pedro asked that the site not frame him as working alone or doing everything. The span is now
stated as range brought to one role while still working with the team, and "C4" is generic
"architecture diagrams". The "owns … end to end alone / two different people" wording is gone.
Edited in the same pass: `docs/02-ux-spec.md` (Zühlke bullet budget 4 → 5; above-the-fold
relaxed for a ~60–80-word opening paragraph). `docs/03-copy.md` was already written to this
framing.*

*Revision 4 (DRAFT): **the core message changed again during phase 3.** Pedro rejected the
first copy pass as "too dry and descriptive, not enough storytelling" and supplied a new
positioning: a technical/business generalist who takes ambiguous problems, understands the
technology, identifies opportunities, and turns them into products. He chose *lead with the
generalist claim, use the design↔architecture span as its proof*. Sections changed: Core
message, Positioning. Edited in the same pass: `docs/02-ux-spec.md` (GLS bullet budget 5 → 6)
and `content/copy.json` + `docs/03-copy.md` (rewritten to this framing).*

## Audience

**Primary: hiring managers, VPs of Product, and founders** — the people who make the decision,
reading closely, arriving from an application they already have in hand. They have the CV.
They do not need the facts again; they need a reason to reconsider what kind of candidate
this is.

**Explicitly not the audience:**

- **HR and agency recruiters doing a 20-second keyword scan.** They receive the PDF CV through
  normal channels. Designing for their scan pattern would force scannability over depth and
  flatten the site into a template — the failure mode this project ranked against.
- **Consulting clients.** Pedro is not selling a service.
- **Anonymous portfolio browsers.** There is no discovery job here; every visitor arrives via
  a link Pedro placed. Confirmed in interview after `CLAUDE.md` added SEO to priority 3: SEO
  is hygiene, not acquisition. The page is not expected to be found by search, so this
  audience does not reopen.

## Job to be done

The site is the link inside an application that makes a hiring manager stop and reconsider
what kind of candidate they are looking at. It does not need to generate contact or convert —
the application already carries Pedro's details — it needs to move the reader's mental
category from "senior Product Owner" to "product person with unusual range at both ends."

## Core message

Pedro is a technical-business generalist: he takes a problem nobody has framed yet, works out
the technology underneath it, finds the opportunity in it, and turns it into a product that
solves a real problem — for the people using it and for the business.

The proof that he can cross that whole distance himself is that the Figma prototype and the
architecture diagram both come from him. That range normally takes two people; he brings it to
one role, working shoulder to shoulder with the team rather than around it.

**Ordering, decided in the phase 3 interview:** the generalist claim leads, the design ↔
architecture span is the evidence beneath it. Not the reverse. Pedro is *"definitely a product
person"* — products exist to solve business or personal problems — so the page claims products,
never "and businesses", which the CV does not evidence.

## Positioning

**What the CV currently says:** over ten years, four industries, a list of responsibilities, and
an ambition to become Head of Product.

**What it fails to say:** that the *range* is the whole point. In the LaTeX CV, "UX/UI-Design
(Figma)" and "C4-Architekturdiagramme (System Context, Container, Business)" appear as two
bullets among six under the GLS role, weighted identically to "Kommunikation von
Produktentscheidungen." The single most unusual thing about this candidate is buried in a list
and given the same visual authority as a line about communication. The CV also spends its most
valuable real estate — the headline — on an ambition rather than a capability.

**How the site closes the gap:**

1. It leads with the generalist claim — ambiguous problem → technology understood → opportunity
   found → product shipped — and then uses the span between the two poles as the *evidence*
   that the claim is real, rather than leaving that span buried as two line items inside one
   role.
2. It uses the career arc — Industriedesign (Sevilla) → Wirtschaftsingenieurwesen (Cádiz/KIT) →
   Produktmanager E-Bike → Requirements consultant at Zühlke → solo PO at GLS — as *evidence*
   for the range, not as chronological filler. The arc is the argument.

   **What each stage actually contributed** — corrected by Pedro in the phase 3 interview, and
   binding on every downstream phase:

   | Source | What it gave him |
   |---|---|
   | Industriedesign | Product and user thinking |
   | Wirtschaftsingenieurwesen | Business, process and systems thinking — **not** IT |
   | Experience and curiosity on the job | The technology. Neither degree supplied it. |

   Copy that implies the *sequence of degrees* is why he can work both ends is false and must
   not ship. The range comes from capability built at work, and the studies explain two of the
   three lenses he brings to it — which is a more credible story than a tidy academic pipeline.
   Name the degree in full — *Wirtschaftsingenieurwesen* / *industrial engineering and
   management* — never a bare "Ingenieurwesen" or "engineering", which reads as a software or
   mechanical degree he does not hold.
3. It writes the work in Pedro's own voice, so the reader meets a person with opinions about
   product work rather than a neutral list of duties.
4. It makes every role bullet carry a causal chain rather than a duty — the outcome first, then
   the mechanism that produced it. Settled in the phase 3 interview after the first copy pass
   was rejected as too descriptive. This is a *content* requirement, not a grammar one: the
   first-person voice stays.

**Explicitly dropped from the positioning:** the "Auf dem Weg zur Head of Product" frame. The
user identified this as a miscue. The site demonstrates seniority and scope; it does not ask
for a title. The headline currently carried by the extraction — "Product Owner mit technischer
Tiefe | Auf dem Weg zur Head of Product" — must not reach the shipped content.

## Tone

- **First-person, but not confessional.** "I" throughout; no anecdote-blogging, no origin myth.
- **Warm, but not chatty.** A person is speaking. Not a LinkedIn post, not an emoji, not
  "let's be honest —".
- **Opinionated, but not combative.** Willing to state what he believes is true about product
  work. Not dunking on other approaches, not contrarian for effect.
- **Readable, but not padded.** The explicit instruction was "it shall not be boring to read."
  Equally: it must not be long. Interesting is a function of density, not word count.

The German prose in the extraction is the anti-reference. "Erstellung der Produktspezifikationen
und Anpassung im Rahmen des Preisfindungsprozesses" is the exact register to move away from.

## Content priorities

**Leads**

1. The core message — the design ↔ architecture span, stated as a capability.
2. The current GLS role, including the only quantified outcome in the CV: tool adoption
   doubled.

**Supports**

3. The four principal roles (GLS, Zühlke, Fahrrad XXL, COBI), bullets rewritten in voice.
4. The career arc as visible time structure — this is half the argument, not decoration.
5. Skills, reframed as evidence for the span (SQL, C4, API design, Figma on one side;
   Roadmapping, Stakeholder Management on the other) rather than a keyword dump.
6. Languages — Spanish native, German and English fluent, French basic. Genuine
   differentiation and cheap to show.

**Demoted (kept, deliberately small)**

7. Early stations 2012–2015 (Bosch/Mobility Media, KIT, Movand). The user chose to keep them.
   One quiet line each.
8. Education — the three degrees survive; their sub-bullets do not.
9. Hobbies (Triathlon, Musik, Kunst) as a small human footer. This was reversed mid-interview:
   with the personal-skills list cut and the tone set to warm first-person, hobbies do the
   humanising work so the role bullets do not have to.

**Cut**

- The personal skills list — "Teamarbeit, Kreativität, analytisches Denkvermögen,
  Pragmatismus." Unfalsifiable adjectives that every CV claims; the work demonstrates them.
- Education detail bullets — course focuses and thesis titles for all three degrees.
- The Head-of-Product ambition headline.
- All contact details — email, phone, and location.

## References

Supplied as images in `content/inspiration/`. They divide into two distinct ideas, and the
user chose **both**: type-led surface over a time-led spine.

**Liked — type as the statement**

- **"Where I've worked."** — an enormous display headline on the left against a spare
  right-hand column of date / rôle / company. Named as the model for career-as-list: it gets
  its confidence entirely from the proportion between the two halves.
- **The cream "( My believes ) / ( My journey )" panel** — tiny parenthetical section labels,
  dotted hairline rules, one oversized statement paragraph, entries with right-aligned dates.
  Named for how much authority it extracts from restraint.
- **Mirko Romano portfolio** — huge lowercase headings ("about", "works"), extreme white
  space, an oversized ghosted name, utilitarian micro-navigation. Named for treating type as
  the primary visual event rather than as labelling.

**Liked — time as the structure**

- **Ahmad Shadeed's "How it's all started?"** — a persistent left rail of years acting as
  index and progress indicator; the career narrated explicitly as a timeline. Named for making
  time navigable.
- **The stream-graph "My experience"** — overlapping career threads (Design, Mentorship, Sales,
  Photography) drawn as continuous bands across years. Named for making a mixed, non-linear
  background legible as a *shape* rather than a list. Directly relevant: Pedro's Industriedesign
  → Wirtschaftsingenieurwesen → product path is exactly this kind of overlapping-threads story.

**Disliked — do not produce these**

No specific sites were named; these were selected from a list of common CV-site failure modes
and are binding on phase 3 as stated.

- **Dark background with a saturated neon accent** (lime, cyan, violet). The current default
  costume for "technical person with taste", which is exactly what makes it forgettable. A
  dark surface is not banned in itself; a dark surface *plus* a neon highlight is the specific
  cliché to avoid.
- **The startup landing-page CV** — big centred hero, a call-to-action button, three feature
  cards, testimonial-shaped blocks. A career wearing a SaaS homepage's clothes. This also
  conflicts with the job to be done: there is no conversion event to build a CTA around.
- **Scroll-jacked animation** — sections that fade, slide or pin as the reader scrolls, the
  page fighting the scroll wheel. Reads as template flourish, slows the read, and costs both
  priority 3 (speed) and the AA reflow requirement below.

Offered and *not* named as off-putting: skill bars and percentage proficiency meters. They are
nonetheless ruled out by content priority 5, which reframes skills as evidence rather than as
quantities.

## Constraints

**From the interview**

- **Distinctiveness: "editorial statement piece."** The user selected the highest-risk option
  short of genuinely unconventional. Phase 3 is expected to take real typographic risk;
  reverting to safe professional norms would fail the brief. Bounded by the accessibility
  floor below — see the declared trade-off.
- **Both organising ideas.** Type-led surface, time-led spine — not one or the other.
- **Font direction: Bebas Neue or a compatible condensed display face.** Recorded here as a
  directive to hand to phase 3, not as a decision made in this phase.
- **Bilingual German / English with a toggle.** German is the primary market.
- **English drafted by Claude, reviewed and corrected by Pedro.**
- **Photo required.** `photo_square.jpg` is already referenced by the LaTeX source.
- **No email, no phone, no postal location anywhere on the site.** It is a public page.
- **Xing (and LinkedIn, if it exists) are the only outbound contact surface.**
- **No PDF download. Web page only.**
- **Content rewrite is in scope.** Role bullets get a voice pass; the shipped prose will
  diverge in wording from `cv.tex`.

**Accessibility — WCAG 2.1 AA is a hard floor**

Decided in interview. Phase 3 may not trade any of the following for visual effect:

- Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text (≥ 24 px regular, ≥ 18.7 px bold) and
  for meaningful graphical objects and UI components.
- Text resizable to 200% without loss of content or function.
- Reflow at a 320 px-equivalent viewport with no horizontal scrolling.
- No information carried by colour alone.
- Keyboard operability with visible focus, correct semantics, and a language attribute that
  changes with the toggle.

AA does not test typographic case, condensed widths, tracking, or x-height, so those remain
phase 3's judgement — but the intent behind this answer was that readability is not the thing
sacrificed for distinctiveness. Phase 3 should read the spirit, not hunt the loophole.

**SEO — hygiene only**

Decided in interview. In scope: an accurate `<title>`, a meta description, semantic HTML,
correct `lang`, and an Open Graph card that renders well when the link is pasted into
LinkedIn, Slack or an email. Out of scope: keyword targeting, ranking ambitions, content
shaped to be indexable. The page is a link target, not a discovery surface.

**From CLAUDE.md, and how this concept interacts with them**

- **Shipped content lives in two files, per `CLAUDE.md`.** `content/cv.json` holds
  language-neutral facts (dates, company and institution names, links) stored once.
  `content/copy.json` holds the prose, duplicated per language — it is the phase 3 (`/copy`)
  output and the file phase 4 (UI) and phase 6 (build) consume for every piece of shipped
  text. No CV text is hardcoded in markup, CSS or scripts, and no fact is duplicated into
  `copy.json`. Priority 2 depends on the split: changing an end date stays one edit in
  `cv.json`; changing a sentence is one edit per language in `copy.json`.
- **The current `content/cv.json` is a phase 0 extraction, not the shipping content.** Confirmed
  by the user. It is a working document. Its *facts* are treated as accurate; its wording,
  structure and field names are not binding on what ships, and the shipped file (or files) may
  differ substantially. Nothing downstream should treat the extraction's shape as a spec.
- **`cv.tex` is an extraction source, not a parity target**, and is not kept in sync afterwards.
  This resolves what the previous revision of this brief carried as an open question.
- **Print is out of scope**, and no PDF is published. The previous revision argued at length for
  demoting print parity; `CLAUDE.md` now grants it outright, so the argument is removed rather
  than restated. Phase 3 and phase 5 should spend nothing on print stylesheets.
- **GitHub Pages:** the repository is `pedlopcha.github.io`, so the site serves from `/` and
  root-absolute paths are safe. Verified against the repository name.

**Trade-off declared** (required by the priorities rule in `CLAUDE.md`)

Priority 1 is distinctiveness; priority 3 contains accessibility. The user has chosen to bind
priority 3 as a floor, which partially reverses the risk level the "editorial statement piece"
answer implies. The practical consequence for phase 3: distinctiveness must be produced by
scale, proportion, composition, structure and restraint — the qualities every liked reference
was actually named for — and not by anything that degrades legibility. This is a real
constraint on phase 3's freedom and is recorded deliberately rather than smoothed over. User comment: Readibility is a must but aesthetics need to be compeling.

## Assumptions

Inferred rather than asked. Please correct any that are wrong.

1. **The facts in `content/cv.json` are accurate.** It was produced in phase 0 and presented for
   confirmation, but the user moved to phase 1 without explicitly confirming it. Dates,
   employers, institutions and titles are treated as correct. Its wording is explicitly *not*
   treated as final — see Constraints.
2. **A LinkedIn profile exists.** `cv.tex` lists only Xing, and with a placeholder URL. If
   there is no LinkedIn, the contact surface is Xing alone.
3. **The site is a single continuous page**, not a multi-page site. Phase 2 formally decides
   information architecture, but this concept's "one continuous read" assumes a single page.
4. **German loads by default**, English is the toggle — following the primary market.
5. **The "human footer" carries hobbies only.** The two `Interessen` lines (nachhaltige
   Produktentwicklung und Design; neue Technologien und Wissenschaft) are assumed to survive
   there alongside Triathlon/Musik/Kunst. They could equally be cut or promoted into the
   opening statement, where they would read as product values rather than trivia.
6. **The doubled tool adoption at GLS can be foregrounded.** It is the only quantified outcome
   anywhere in the CV. If it is confidential or contested, the "leads" section loses its only
   number.
7. **No case studies or project deep-dives.** `projects` and `publications` are empty in the
   extraction and nothing in `cv.tex` supplies them. The site argues from roles, not artefacts.
8. **Client names stay anonymised.** The Zühlke entries describe clients as "führender
   Matratzenhersteller", "führende Hersteller von Haushaltsgeräten" and similar. Assumed to be
   deliberate NDA-driven phrasing that must be preserved.

## Open questions

Deferred, with the phase that owns each.

| Question | Phase |
|---|---|
| How literal is the "time-led spine" — a drawn timeline graphic, an overlapping-threads diagram like the stream-graph reference, or an arc merely implied by ordering and typography? | 2 |
| Is a condensed all-caps face viable against German compounds — *Personaleinsatzplanungssystem*, *Wirtschaftsingenieurwesen*? None of the supplied references use a condensed face; they are all wide neo-grotesques. With AA now binding, display-only usage is the likely resolution. | 3 |
| How does a language toggle work with no server? URL parameter, `localStorage`, or two static pages — and which keeps `content/cv.json` and `content/copy.json` free of duplicated facts and the `lang` attribute correct for AA? | 5 |
| How is a missing translation handled at build time — fail the build, or fall back to German? The prose location is settled: `content/copy.json`, keyed per language. Only the failure mode is open. | 5 |
| Real Xing and LinkedIn URLs. `cv.tex` contains a placeholder. | 5 |
