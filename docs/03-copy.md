STATUS: APPROVED

# Copy

Phase 3 (`/copy`), **revision 3.** Rewrites the phase-0 German extraction in `content/cv.json`
into the concept brief's voice, in both languages, within the UX spec's density budget.
Output: `content/copy.json` (the phrasing, `{de, en}` per entry — `de` ships) and this review
document.

**Review the [Before and after](#before-and-after) table — that is the surface, not the
JSON.** Then check [New facts from interview](#new-facts-from-interview): every line marked
`source: interview` is something you told me and I have not verified.

> **Gate note.** All three documents read `APPROVED` when this revision started, so the phase
> 3 gate was met for the first time. Editing this file returns it to `STATUS: DRAFT`, per the
> gate protocol. `docs/02-ux-spec.md` also needs one line corrected — see *Where the group
> labels live* below — so it returns to DRAFT with this one. `docs/01-concept-brief.md` is
> untouched and stays `APPROVED`.

---

## What changed in revision 3, and why

Revision 3 is a **repair pass, not a rewrite.** No role bullet changed. `docs/02-ux-spec.md`
rev. 4 restructured two sections *after* this copy was written, and six things in
`content/copy.json` were left serving a page that no longer exists. Four were caused by that
restructure; two were older and nothing had caught them.

| # | Gap | Fix |
|---|---|---|
| 1 | The three skill-group names had no bilingual copy. UX spec rev. 4 sent them to `cv.json`, which is the facts file and holds one language — so the English page would have shown German group headers. The merged group had no name in either language. | `sections.range.groupProduct` / `groupTechnical` / `groupMethods`, bilingual, keyed to `cv.json`'s categories. |
| 2 | `poleDesignLabel`, `poleTechnicalLabel`, `poleSpanningLabel` were dead strings — rendered by nothing after the two-pole design was dropped. | Removed. |
| 3 | `sections.range.intro` still described a two-pole span above three source-shaped groups. | Rewritten for three groups, and it now introduces the radar. |
| 4 | The radar had no copy at all: no accessible name, no scale rendering, no honesty note. | `radarTitle`, `radarDescription`, `levelScaleNote`, plus `microcopy.levelFormat` and `levelAriaFormat`. |
| 5 | **Languages were entirely untranslated.** Names (`Spanisch`, `Französisch`) and levels (`Muttersprache`, `fließend`, `Grundkenntnisse`) existed only as German strings in `cv.json`. The English page closed its Range section in German — in the one place the brief calls "genuine differentiation". | New top-level `languages` block, bilingual, paired to `cv.json meta.languages[]` by order. |
| 6 | Under the timeline sat three degrees and three early stations — six single lines with nothing saying which were which. | `sections.arc.educationLabel` and `earlierStationsLabel`. |

Two more, minor: `skillsLabels` held a tombstone string that would have printed
„(gestrichen – siehe docs/03-copy.md)“ if anything ever rendered it — the whole block is gone.
And `meta.openingStatementShort` is **retired**: UX spec rev. 4 made the headline the
display-scale line, so the long-statement overflow it existed to rescue cannot happen. It was
never shorter than the block it was rescuing anyway (31 words against 35).

### Where the group labels live

UX spec rev. 4 says phase 4 "renders the group names from `cv.json`, not those labels." That
sentence cannot be satisfied: `cv.json` is the language-neutral facts file, and a rendered
group heading is prose that duplicates per language. You chose to put the labels here instead,
which is what `CLAUDE.md`'s content model actually requires — the category string in `cv.json`
stays as the **grouping key**, and `copy.json` carries the two labels drawn for it. The UX
spec's sentence needs correcting to match, which is why that document returns to DRAFT.

---

## What changed in revision 2, and why

You rejected revision 1: *"too dry and descriptive, not enough storytelling."* You supplied a
new positioning sentence and a sample set of GLS bullets. Four decisions came out of the
interview:

1. **New core message.** *Technical/business generalist who takes ambiguous problems,
   understands the technology, identifies opportunities, and turns them into products.* You
   chose **lead with the generalist claim, span as its proof** — so the design ↔ architecture
   range is now the *evidence* that you can cross the whole distance, not the claim itself.
   `docs/01-concept-brief.md` Core message and Positioning were rewritten to match
   (Revision 4).
2. **"…or businesses" is not claimed.** You said you're *"definitely a product person"* and
   that products exist to solve business or personal problems. So the opener lands on *"a
   product… that solves a real problem, for the people using it and for the business"* —
   evidenced, and it keeps the business dimension without claiming you founded companies.
3. **Voice is unchanged: full first person.** Your sample bullets are written in CV-participle
   style, and I asked whether that was the instruction. You said the sample was about *framing*,
   not tonality, and that the person/voice decision shouldn't move because of it. So: first
   person stays; what I took from the sample is the **causal density** — outcome first, then
   the mechanism that produced it.
4. **GLS bullet budget 5 → 6**, matching your six-bullet structure. `docs/02-ux-spec.md`
   updated (Rev. 3); page total is now fourteen bullets.

5. **The arc's causal claim was false, and is gone.** The first draft of this revision said
   „Design, dann Wirtschaftsingenieurwesen, dann Produkt – die Reihenfolge ist der Grund, warum
   ich beide Enden bedienen kann." You corrected it: the degrees are not why you can work both
   ends. See [The arc's attribution](#the-arcs-attribution) below.

**One reversal you should notice.** In round 1 you asked me to de-emphasise C4 and to avoid
anything reading as "I do it all alone." Your sample bullets restore both — `"per
C4-Modellierung sichtbar gemacht"` and `"Produktvision und Scope allein verantwortet"`. I
followed your sample. Your own draft shows where the real line is, and I think it's the right
line: **sole ownership of the product craft is stated plainly; the engineering is explicitly
shared** (`"Architektur- und API-Entscheidungen treffe ich gemeinsam mit den Entwicklern"`).
Say the word if you want either pulled back.

---

## Voice

**Full first person**, in the role bullets as well as the prose. Confirmed in round 1 and
re-confirmed in round 2.

**What the sample changed — content, not grammar.** Every bullet now carries a causal chain
instead of a duty:

| Revision 1 (rejected) | Revision 2 |
|---|---|
| „Organisatorische Probleme finde ich über eigene SQL-Analysen – und priorisiere die Features danach, was die Daten zeigen." | „Die Nutzung eines neuen internen Tools habe ich verdoppelt: per SQL-Analysen und Gesprächen mit den Nutzern herausgefunden, woran die Akzeptanz **tatsächlich** scheiterte – und die Roadmap konsequent darauf ausgerichtet." |

The difference is that rev. 2 names the *outcome*, then the *investigation*, then the
*decision it drove*. Rev. 1 named a capability.

**Sanctioned but unused:** "expert" / "Experte". You cleared it; the copy doesn't spend it.
Zühlke's real job title *Expert Business Analyst* is a fact in `cv.json` and is untouched.

---

## Headline

> **DE** — Vom unscharfen Problem zum ausgelieferten Produkt
> **EN** — From a fuzzy problem to a shipped product

**Changed in revision 3: the category label is gone.** UX spec rev. 4 made this string the
page's display-scale line, sitting directly above the opening statement — which opens
„Ich bin technisch-wirtschaftlicher Generalist“. The label therefore appeared twice, two lines
apart, in two different spellings, at two different type sizes. That was the open question
revision 2 left you; rev. 4 turned it from a consistency wrinkle into the most visible thing on
the page.

You chose to drop it from the headline. It resolves both problems in one edit — the German /
anglicism argument disappears with the disputed word, and so does the echo. The division of
labour is now clean:

| Line | Job |
|---|---|
| Headline, display scale | States the **method** — fuzzy problem in, shipped product out. |
| Opening statement, reading size | Names the **category** — „Ich bin technisch-wirtschaftlicher Generalist" — then evidences it. |

Six words in German, seven in English. It clears any fold at any width, which is what makes
the UX spec's above-the-fold priority list achievable.

| Alternative still on file | Why it lost |
|---|---|
| *(rev. 2, yours)* „Technisch-business Generalist — Vom unscharfen Problem zum ausgelieferten Produkt" | The category label duplicated the statement's opening clause once both were rendered together, and „business" spliced into a German compound read as a slip on a German-primary page. |
| DE „Product Owner, der unklare Probleme in Produkte übersetzt" | Leads with the job title, which undersells the generalist point — "Product Owner" is the category you're trying to escape. |
| DE „Technisch-business Generalist – ich mache aus unklaren Problemen Produkte" | The verb-led half of the merge; you kept the process-shaped half instead. |
| *(rev. 1)* „Product Owner, der beide Enden selbst übernimmt – Design und Architektur" | Superseded: the span is now evidence, not the claim. |

**The statement is unchanged.** It still opens by naming the category, which is now the only
place that word appears at the top of the page.

---

## Opening statement

> „Ich bin technisch-wirtschaftlicher Generalist: Ich nehme unklare Probleme, durchdringe die
> Technik dahinter, erkenne die Chance, und mache ein Produkt daraus. Eines, das ein echtes
> Problem löst, für die Nutzer wie fürs Business.
>
> Angefangen habe ich im Industriedesign, weitergemacht im Wirtschaftsingenieurwesen, und
> seitdem in vier Branchen gebaut. Heute als Product Owner verantworte ich die ganze Strecke –
> vom Design bis zur Architektur."

*Includes your direct edits to `copy.json`: „fürs Business" for „fürs Geschäft", and
„Wirtschaftsingenieurwesen" for „Ingenieurstudium" — the latter is more accurate, it is the
actual degree. The English mirror now reads "an industrial engineering and management degree".*

61 words. The paragraph break is deliberate: **the display-scale portion ends at "fürs
Business."** Everything after it can drop to a reading size, which is what makes the UX spec's
above-the-fold rule work.

**Closing line, revised.** The first draft of this revision ended „Heute als Product Owner:
Figma-Prototyp und Architekturdiagramm kommen beide von mir." — you called it too task-focused,
and you were right: it closed on *artefacts produced* rather than on *scope owned*. The line
now states the span as responsibility. The same phrasing was propagated to
`openingStatementShort`, `metaDescription` and `ogDescription`, which carried the same
artefact list.

---

## The arc's attribution

**What was there (false):**

> „Design, dann Wirtschaftsingenieurwesen, dann Produkt – die Reihenfolge ist der Grund, warum
> ich beide Enden bedienen kann."

It claimed the *sequence of degrees* produced the range. Your correction: industrial
engineering has nothing to do with IT, and you can work both ends because of capability built
at work, not because of what you studied.

**What replaces it** (`sections.arc.intro` + a new `sections.arc.attribution` block):

> „Drei Denkweisen, aus denen ich schöpfe. Zwei kommen aus dem Studium, eine nicht."
>
> — Industriedesign – Produkt- und Nutzerdenken
> — Wirtschaftsingenieurwesen – Business-, Prozess- und Systemdenken
> — Technologie – aus Erfahrung und Neugier, nicht aus dem Hörsaal

You asked whether the business/process/systems point was relevant. **It is the most useful
thing you have told me in this phase.** It does three jobs the old sentence couldn't:

- It makes the generalist claim *auditable*. "Technical/business generalist" is an assertion;
  three named lenses with three named sources is an argument.
- It supplies the **business** half of "technical-business", which until now rested only on the
  Fahrrad XXL pricing work and the COBI partnership line.
- Admitting one lens came from outside the classroom is more credible than a tidy academic
  pipeline — and it is the honest version.

It is three short lines and it heads the arc section. `docs/02-ux-spec.md` was updated so
phase 4 knows to lay it out.

**Naming, now enforced everywhere:** the degree is *Wirtschaftsingenieurwesen* /
*industrial engineering and management*. Never a bare „Ingenieurwesen" or "engineering" — that
reads as a software or mechanical degree you don't hold. Corrected in `metaDescription`,
`ogDescription`, the concept brief's References section and the UX spec's reading-flow text.

**One knock-on in the opening statement.** Its English mirror read *"I started in industrial
design, **sharpened it with** an industrial engineering and management degree"* — the same
causal implication in miniature. It now reads *"went on to industrial engineering and
management"*, matching the German, which was already pure chronology.

---

## Density budget

From `docs/02-ux-spec.md` → *Bullet budget* and *Section inventory*. Binding.

| Slot | Budget | Written |
|---|---|---|
| Headline | One display-scale line | 6 words (de) / 7 (en). Rev. 3 dropped the category label; see *Headline*. |
| Opening statement | Short paragraph, at reading size beneath the headline | 61 words (de). `openingStatementShort` **retired** in rev. 3 — the headline now carries display scale, so the overflow it guarded against cannot occur. |
| GLS — summary + bullets | 1 + **6** *(raised from 5)* | 1 + 6, in your supplied order — the doubled-adoption outcome now **opens** the role. |
| Zühlke — summary + bullets | 1 + **5** | 1 + 5. One per client project: special-machinery/IoT, medtech, appliances/master-data, consumer IoT, aviation. |
| Fahrrad XXL — summary + bullets | 1 + **2** | 1 + 2. Five source highlights folded to two. |
| COBI — bullets | **1**, no summary | 1, no summary (none in source). |
| Section headings | New | *Woran ich gearbeitet habe* / *Wie ich hierher kam* / *Beide Enden* / *Nebenbei*, plus a new one-line intro on the arc section. Alternates in `copy.json`. |
| `<title>`, meta description, OG title/description, photo alt | New | Rewritten to the generalist framing. |

**Fourteen bullets, down from twenty in the source.**

---

## Before and after

German shown (the shipped text); the English mirror is in `copy.json`.

### Opening statement

| | Text |
|---|---|
| **Before** (`summary`) | „Produktexperte mit über 8 Jahren Erfahrung … Kombiniert End-to-End-Produktverantwortung … mit technischer Tiefe: eigenständige Erstellung von C4-Architekturdiagrammen … Nächstes Ziel: … Head of Product." |
| **Rev. 1** (rejected) | „Ich bin übers Industriedesign in die Produktarbeit gekommen – über ein Ingenieurstudium … Das sind normalerweise zwei Rollen – für mich sind es zwei Seiten derselben Aufgabe." |
| **Rev. 2** | „Ich bin technisch-wirtschaftlicher Generalist: Ich nehme unklare Probleme, durchdringe die Technik dahinter, erkenne die Chance, und mache ein Produkt daraus. Eines, das ein echtes Problem löst, für die Nutzer wie fürs Business. // Angefangen habe ich im Industriedesign, weitergemacht im Wirtschaftsingenieurwesen, und seitdem in vier Branchen gebaut. Heute als Product Owner verantworte ich die ganze Strecke – vom Design bis zur Architektur." |
| **Changed** | Rev. 1 opened with autobiography; rev. 2 opens with the **claim** and puts the biography second as support. Four verbs carry the method (nehme / durchdringe / erkenne / mache). The closing line states the span as *scope owned* rather than as artefacts produced — revised after you flagged the first draft's „Figma-Prototyp und Architekturdiagramm" ending as too task-focused. |

### GLS IT Services — Product Owner *(6 bullets)*

| Before (`experience[0]`) | After (`roles.gls`) | Changed |
|---|---|---|
| Summary: „Fachliche Führung eines cross-funktionalen Teams aus Entwicklern und Testern (5 FTEs) und Verantwortung für Produktvision sowie strategische Ausrichtung der IT-Tools im Bereich Nahverkehr." | „Ich führe ein cross-funktionales Team aus Entwicklung und Test fachlich und trage die volle Produktverantwortung für die IT-Tools im Nahverkehr – **von der Analyse unklarer operativer Probleme bis zur ausgelieferten Lösung**." | Your closing clause adopted verbatim in sense — it states the generalist arc inside the role. "(5 FTEs)" deliberately **not** in the string: it is a fact, see Assumption 4. |
| „Ergebnis: Nutzungsrate eines zentralen Tools verdoppelt …" *(was last)* | „Die Nutzung eines **neuen internen** Tools habe ich verdoppelt: per Daten-Analysen auf SQL Basis und Gesprächen mit den Nutzern herausgefunden, woran die Herausforderungen tatsächlich liegen – und die Roadmap konsequent darauf ausgerichtet." | **Moved to first.** Merges the old SQL bullet into it as the *mechanism*. Kept "neues internes Tool" from your round-2 answer over the sample's „zentrales Tool". |
| „Eigenständige SQL-basierte Datenanalysen zur datengetriebenen Identifikation organisatorischer Probleme …" | „Unscharfe organisatorische Probleme aus dem operativen Nahverkehr übersetze ich eigenständig in priorisierte Produktentscheidungen – datengetrieben statt auf Zuruf." | Your sample line, first person. „statt auf Zuruf" is the opinionated register the brief's tone section asks for. |
| „Alleinige End-to-End-Produktverantwortung ohne dedizierten Business Analysten: UX/UI-Design (Figma), Requirements …" | „Produktvision und Scope verantworte ich **allein** – es gibt keine dedizierte BA-Rolle im Team: Nutzerkontakt, Requirements, UX/UI-Design in Figma und Support liegen in einer Hand." | Your sample restores "allein", which rev. 1 had removed. Kept — it's factual and the next bullet balances it. |
| „Erstellung von C4-Architekturdiagrammen …" + „Technische Diskussionen auf Augenhöhe …" | „Architektur- und API-Entscheidungen treffe ich **gemeinsam mit den Entwicklern**; Systemgrenzen und Abhängigkeiten mache ich per C4-Modellierung sichtbar und **kläre Integrationsrisiken, bevor die Umsetzung startet**." | C4 restored per your sample. The "gemeinsam" is what keeps the previous bullet from reading as lone-hero. The integration-risk clause is new from your sample — `source: interview`. |
| „Kommunikation und Verantwortung von Produktentscheidungen gegenüber … Director- und teilweise C-Level-Ebene; Vorbereitung von Budgetfreigaben" | „Produktentscheidungen und Budgetbedarfe vertrete ich gegenüber Director- und C-Level-Ebene – und **setze sie dort durch**." | „durchgesetzt" from your sample is a stronger claim than the CV's "Vorbereitung von Budgetfreigaben". See [New facts](#new-facts-from-interview). |
| „deutlich verbesserte Prozesstransparenz mit positivem Effekt auf die Kundenzufriedenheit" | „Die Prozesstransparenz im Nahverkehr habe ich deutlich erhöht, mit positivem Effekt auf die Kundenzufriedenheit, Effizienz und Qualität – und damit den Grundstein für den Umbau kritischer Abläufe gelegt." | **„messbar" from your sample was NOT adopted** — nothing evidences a measurement. Flagged below. |

### Zühlke Engineering — Expert Business Analyst *(5 bullets)*

| Before (`experience[1]`) | After (`roles.zuhlke`) | Changed |
|---|---|---|
| Summary: „Requirements Engineering und Product-Ownership-Rollen mit Schwerpunkt Anforderungserhebung und Kundenschnittstelle …" | „Als Berater bei Zühlke war ich **meist am Anfang im Projekt – dort, wo das Produkt noch unscharf ist**: Anforderungen erheben, das Produkt definieren, die Schnittstelle zum Kunden halten. Quer durch die Branchen." | Reframed to the generalist thesis. Evidenced: feasibility phase, product definition, Lastenheft are all early-stage work. |
| „Product Owner für die IoT-Erneuerung … – erfolgreich im Markt gelauncht" | „Als Product Owner habe ich die IoT-Neuentwicklung der Maschinensoftware eines Sondermaschinenbauers verantwortet – **von der Anforderungserhebung bis zum erfolgreichen Marktstart**." | Span made explicit; launch confirmed by you in round 2. |
| „Product-Team-Lead in der Machbarkeitsphase eines vernetzten Medizingeräts – Koordination eines 5-köpfigen Teams …" | „Für ein vernetztes Medizingerät habe ich das Produktteam durch die Machbarkeitsphase geführt – **die Frage war, ob aus der Idee überhaupt ein Produkt werden kann**. Den Kunden habe ich dabei bis auf Director-Ebene begleitet." | The added clause is a gloss of what a feasibility phase *is* — it makes the ambiguity explicit rather than assuming the reader supplies it. Team size (5) currently dropped; see Assumption 4. |
| „Requirements Engineering und API-Spezifikation für ein MDM-System …" | „Anforderungen und API-Spezifikation für das Stammdatensystem eines großen Hausgeräteherstellers – konsequent nach ‚API-First' und ‚API-as-a-Product', **also mit der Schnittstelle selbst als Produkt**." | "MDM" → "Stammdatensystem"; the closing clause glosses "API-as-a-Product" for readers who don't know it. No shipping claim — production unconfirmed. |
| „Produktdefinition und Lastenheft-Erstellung für eine smarte Matratze …" | „**Aus einer vagen Produktidee** habe ich für einen führenden Matratzenhersteller eine spezifizierte smarte Matratze gemacht – Produktdefinition und Lastenheft; sie hat einen **kleinen Marktstart** erreicht." | Restructured to problem → product, the page's thesis in miniature. Small launch from your round-2 answer. |
| „Requirements Engineering und Coaching des Projektteams für ein Personaleinsatzplanungssystem einer Fluggesellschaft …" | „Für das Personaleinsatzplanungssystem einer Fluggesellschaft habe ich die Anforderungen erhoben und das Projektteam gecoacht – trotz komplexer Anforderungslage durchgehend hohe Kundenzufriedenheit." | **No launch claimed** — you rolled off shortly before rollout. „Personaleinsatzplanungssystem" kept in German (a UX-spec wrap-test compound); glossed to "crew-scheduling system" in English. |

### Fahrrad XXL — Produktmanager E-Bike *(2 bullets)*

| Before (`experience[2]`) | After (`roles.fahrrad-xxl`) | Changed |
|---|---|---|
| Summary: „Management des Produktentwicklungsprozesses für den gesamten E-Bike-Bereich:" | „Ich habe den Produktentwicklungsprozess für den gesamten E-Bike-Bereich verantwortet – **und damit zum ersten Mal Produkt und Kommerz in einer Rolle**." | The added clause is what makes this role support the *business* half of the generalist claim. See Assumption 6 — "zum ersten Mal" is my inference from the chronology. |
| „Erstellung der Entwicklungs-Roadmap …" + „Erstellung der Produktpalette und Preisstrategie …" | „Roadmap und Produktanforderungen für eine Palette von **unter 20 E-Bike-Modellen** habe ich mit dem Engineering erstellt; Sortiment und Preisstrategie mit der Geschäftsführung festgelegt." | Two bullets merged; range size from your round-2 answer. |
| „Leitung des Zertifizierungsprozesses nach EMV-Richtlinien" + „Marktbeobachtung und Marktanalyse" | „Den Zertifizierungsprozess nach EMV-Richtlinien habe ich geleitet und den Markt laufend beobachtet und analysiert – **die Grundlage für die Roadmap**." | Two bullets merged; the closing clause connects market work to the roadmap rather than leaving it as a stray duty. |
| „Erstellung der Produktspezifikationen und Anpassung im Rahmen des Preisfindungsprozesses" | *(dropped)* | The exact sentence the concept brief names as its anti-reference register. |

### COBI — Account Manager Business Development *(1 bullet)*

| Before (`experience[3]`) | After (`roles.cobi`) | Changed |
|---|---|---|
| Three bullets: „Ansprechpartner für nationale und internationale E-Bike-Antriebshersteller" + „Projektleitung … Integrationsprojekte" + „Zusammenarbeit mit der Embedded-Systems-Abteilung" | „Ich war Ansprechpartner für **zwei bis drei** E-Bike-Antriebshersteller und habe die Projekte geleitet, die ihre Systeme mit COBI integriert haben – eng mit der Embedded-Abteilung. **Business Development hieß hier: die technische Integration und die Partnerschaft gleichzeitig verantworten.**" | Three folded to one. The closing sentence is the generalist claim at its earliest point in the career — technical and commercial in the same job. Partner count from your round-2 answer. |
| „Mitarbeit an der Erstellung zukünftiger Mobilitätskonzepte" | *(dropped)* | Throat-clearing; 1-bullet budget. |

### Microcopy & translated labels

Unchanged from revision 1 except for revision 3's additions. Full table in `copy.json` under
`sections.*` and `microcopy`.

| Added in rev. 3 | DE / EN | Why |
|---|---|---|
| `sections.arc.educationLabel` | Ausbildung / Education | Six unlabelled lines sat under the timeline. Nothing said which three were degrees. |
| `sections.arc.earlierStationsLabel` | Frühere Stationen / Earlier stations | Same. Note the trap this fixes: the KIT *exchange* is a degree and the KIT *assistantship* is a job, and both name the same institution. |
| `sections.range.radarTitle` | Spannweite im Überblick / The range at a glance | Accessible name for the chart. |
| `sections.range.radarDescription` | „Je weiter die Fläche in eine Richtung reicht, desto mehr liegt dort. Bei mir reicht sie in alle drei." | Tells the reader how to read the shape. Without it the radar is decoration. |
| `sections.range.levelScaleNote` | Selbsteinschätzung, 1 bis 5. / Self-assessment, 1 to 5. | **Required by the UX spec.** The levels are self-assessment, not measurement, and the page may not imply otherwise. |
| `microcopy.levelFormat` | `{level}/5` | The visible text beside each skill — the radar's AA text equivalent. You chose numeric over a word scale. |
| `microcopy.levelAriaFormat` | „{skill}: {level} von 5" / "{skill}: {level} out of 5" | So a level is never conveyed by geometry alone. |

**Removed in rev. 3:** the three pole labels, and the `skillsLabels` block with its tombstone
string.

**No CTA, no PDF-download label, no contact line** — all three out of scope per the concept
brief and UX spec. Recorded so their absence is deliberate.

### Languages — new in revision 3

They were German-only in `cv.json` and had no English mirror anywhere, so the English page
closed the Range section in German. Names and levels are rendered text, so they duplicate per
language and belong in `copy.json`; the list and its order stay in `cv.json`.

| `cv.json` | DE | EN |
|---|---|---|
| Spanisch / Muttersprache | Spanisch — Muttersprache | Spanish — Native speaker |
| Deutsch / fließend | Deutsch — fließend | German — Fluent |
| Englisch / fließend | Englisch — fließend | English — Fluent |
| Französisch / Grundkenntnisse | Französisch — Grundkenntnisse | French — Basic |

### Range section — the three groups

Replaces revision 2's two-pole proposal, which UX spec rev. 4 dropped. The groups are now
`cv.json`'s own categories, so **the mapping maintains itself** — every skill belongs to
exactly one group because the facts file already says which, and adding a skill places it
automatically. Under the two-pole proposal `Teamführung` had silently belonged to nothing.

| Group | Label (DE / EN) | Source | Items |
|---|---|---|---|
| 1 | Produkt & Führung / Product & leadership | `skills.technical[0]` verbatim | Product Management, Product Ownership, Requirements Engineering, Teamführung, Strategic Planning, Stakeholder Management |
| 2 | Technisch / Technical | `skills.technical[1]` verbatim | C4 / Architekturdiagramme, SQL, Python, Data Analysis, Business Analytics, API-Design, Figma |
| 3 | Methoden & Werkzeug / Methods & tools | `skills.technical[2]` + `[3]` merged | Agile Development (Scrum), User Story Mapping, Design Thinking, Business Model Canvas, Product Roadmapping — plus the Tools as `toolsLine` |

Two consequences worth seeing before you approve:

- **The heading stays „Beide Enden" over three groups**, by your decision. The section now
  promises two ends and delivers three categories. `sections.range.intro` was rewritten to
  carry the span idea in prose so the heading is not left unsupported, but the mismatch is
  real and it is recorded rather than hidden.
- **`Figma` sits in the Technisch group**, because `cv.json` puts it there. The concept brief's
  own example also lists Figma on the technical side. Under revision 2's two-pole proposal I
  had moved it to the understanding end, which was arguably the better editorial call and is
  now gone. Say so if you want Figma moved — that is a one-line edit to `cv.json`, not to
  this file.

---

## New facts from interview

**You supplied each of these; none is independently verified. Confirm or correct every line
before approving.** Full list in `copy.json` → `interviewFacts`.

| # | Fact now in the copy | Where |
|---|---|---|
| 1 | You are a **technical/business generalist**; products exist to solve business or personal problems. "…or businesses" deliberately **not** claimed. | `meta.headline`, `meta.openingStatement` |
| 2 | The GLS tool whose usage doubled was a **new** internal tool. | `roles.gls.bullets[0]` |
| 3 | Adoption was failing for reasons you found **via SQL analysis and user contact**, and you aimed the roadmap at them. | `roles.gls.bullets[0]` |
| 4 | You **clear integration risks before implementation starts**, and make boundaries/dependencies visible via C4. | `roles.gls.bullets[3]` |
| 5 | You don't just present at director/C-level — you **carry decisions and budget through** („durchgesetzt"). Stronger than the CV's "Vorbereitung von Budgetfreigaben". | `roles.gls.bullets[4]` |
| 6 | Groundwork laid for **reworking critical processes**. | `roles.gls.bullets[5]` |
| 7 | Special-machinery machine software **successfully launched in market**. | `roles.zuhlke.bullets[0]` |
| 8 | Smart mattress reached a **small market launch**. | `roles.zuhlke.bullets[3]` |
| 9 | Airline crew-scheduling: you **rolled off before rollout** — no launch claimed. | `roles.zuhlke.bullets[4]` |
| 10 | Fahrrad XXL range: **fewer than 20 models**. | `roles.fahrrad-xxl.bullets[0]` |
| 11 | COBI: **2–3 drive-system manufacturers**. | `roles.cobi.bullets[0]` |

**One thing I declined to write.** Your sample said the transparency gain had a *"messbar
positivem Effekt auf die Kundenzufriedenheit"* — **measurable**. Nothing in the CV evidences a
measurement, and the hard rule of this phase is that I don't invent metrics. The copy says
„mit positivem Effekt auf die Kundenzufriedenheit". **If a measurement actually exists, give me
the figure and I'll put the stronger claim back — with the number in it.**

---

## Cut

| Cut | From | Why | Fight for it? |
|---|---|---|---|
| "über 8 Jahren Erfahrung" | `summary` | Date-derived, drifts yearly; the arc section carries time. | Only if you want a hard "N years" line. Tell me the number and placement. |
| "Produktexperte" / self-labelling | `summary` | Replaced by the sharper generalist claim. | — |
| Head-of-Product goal | `summary` | Barred by the concept brief. | No — settled. |
| Industry name-drop list ("IoT, MedTech, E-Mobility, Sondermaschinenbau") | `summary` | The roles name their own industries; the opener says "vier Branchen" instead. | — |
| "Erstellung der Produktspezifikationen und Anpassung im Rahmen des Preisfindungsprozesses" | Fahrrad XXL | The brief's named anti-reference sentence. | No. |
| "Mitarbeit an der Erstellung zukünftiger Mobilitätskonzepte" | COBI | Throat-clearing; 1-bullet budget. | Low stakes — available if you'd rather have it than the integration line. |
| Medtech team size ("5-köpfiges Team") | Zühlke | It's a fact; per CLAUDE.md facts belong in `cv.json`, and it isn't a field there yet. | **Yes, possibly** — concrete evidence of leadership. Say so and phase 5 adds the field. |
| Personal skills (Teamarbeit, Kreativität, …) | `skills.personal` | Cut by the concept brief. | No. |
| Education sub-bullets | `education[].highlights` | Cut by the concept brief. | Possible: both theses are **bicycle** projects, a quiet through-line to the E-Bike years. One clause, not a bullet, if you want it. |
| Contact details | `meta.contact` | Cut by the concept brief — public page. | No. |

---

## Assumptions

Correct any that are wrong.

1. **Generalist claim leads, span is evidence** — your explicit choice. The concept brief's
   Core message and Positioning were rewritten to match; it is back at DRAFT for your
   re-approval.
2. **First person throughout**, unchanged by the sample's participle style — per your
   clarification that the sample was about framing, not tonality.
3. **"allein verantwortet" and C4 are back**, from your sample, reversing two round-1
   instructions. The balancing "gemeinsam mit den Entwicklern" is what keeps it from reading
   as lone-hero.
4. **Team sizes stay out of the copy strings.** GLS (5 FTE) and the Zühlke medtech team (5)
   are facts. `cv.json` has no `teamSize` field; phase 5 should add one and have the template
   slot it into the summary. Until then both numbers are absent from the page.
5. **"Nahverkehr" at GLS = local / last-mile delivery operations**, not public transport. The
   English says "local delivery operations". Correct if wrong.
6. **"zum ersten Mal Produkt und Kommerz in einer Rolle"** at Fahrrad XXL is my inference from
   the chronology (COBI was business development, not portfolio ownership). Drop "zum ersten
   Mal" if you'd rather not date it.
7. **Clients stay anonymised** (brief Assumption 8).
8. **Role pairing keys**: `gls`, `zuhlke`, `fahrrad-xxl`, `cobi`. `cv.json` has no `id`
   fields; phase 5 adds them or the build pairs by array order / company.
9. **Education field names and earlier-station role titles**: German is the original name,
   English a gloss. Borderline fact/prose — phase 5's data-contract call.
10. **LinkedIn label included** on spec; the build omits it if no profile exists.
11. **Section headings** — primaries chosen, alternates in `copy.json`. All rejectable.
12. **The technology came from experience and curiosity**, not from either degree — your
    correction, now recorded in the concept brief as binding on all downstream phases. If you
    would rather the page not say that out loud („nicht aus dem Hörsaal"), it can state the
    three lenses without naming where the third came from.
13. **`<title>` is your edit**: "Pedro López Chao — Product Management Professional", identical
    in both languages. I corrected a typo in it ("Managmenet" → "Management") — it would have
    shipped into the browser tab. Worth knowing: this title is the most generic string on the
    page, and it is what appears in a browser tab, a bookmark and a pasted-link preview. The
    `ogTitle` beneath it still carries the sharper „aus unklaren Problemen werden Produkte".
    Deliberate contrast, or should the `<title>` match the page's voice?
14. **The group labels are prose, not facts.** `cv.json`'s category strings stay as grouping
    keys; `copy.json` carries the two rendered labels. This is what requires the one-line
    correction to `docs/02-ux-spec.md`.
15. **English renderings of the language levels**: "Native speaker", "Fluent", "Basic". These
    are the conventional CV forms; correct them if you use different ones.
16. **Tools are not radar spokes**, per UX spec rev. 4 — they render as `toolsLine` inside the
    Methoden & Werkzeug group. Reversible, at the cost of four more levels to supply.
17. **The scale is 1–5 integers and is described on the page as self-assessment.** You chose
    numeric over a word scale. If you would rather the page not state that it is
    self-assessed, say so — but the UX spec requires the page not to imply measurement, so
    something has to carry that.

---

## Then stop

**Two documents return to `STATUS: DRAFT` and need your approval:** this one, and
`docs/02-ux-spec.md` — the latter only for the one sentence sending group labels to `cv.json`,
described under *Where the group labels live*. `docs/01-concept-brief.md` is untouched and
stays `APPROVED`. Phase 4 (UI) does not start until all three read `APPROVED`, and only you
change those lines.

**The radar is still missing its data, and that is not a copy problem.** `cv.json` holds skill
names only. The chart needs a self-assessed level for each of the eighteen spokes — the
Produkt & Führung, Technisch and Methoden items, but not the Tools. Phase 5 adds the field;
**you supply the eighteen numbers, because nobody else can.** Until they exist the radar does
not render and the section falls back to the three grouped lists, which are shipping content
either way. The build must never default a missing level to a midpoint — an invented number is
exactly what this phase refused when it declined to write „messbar".

**One cost to name before you approve:** this phase splits the source of truth. Facts live in
`content/cv.json`, phrasing in `content/copy.json`. **Adding a role later means editing both
files** — the dated facts in one, the `{de, en}` prose in the other — with their keys aligned.
That is the price of the bilingual, fact-deduplicated structure `CLAUDE.md` mandates, and it
is worth being sure now rather than at the first CV update.

Offered: the `design-critic` subagent, which reads this document for copy that lands as
generic or contradicts itself. Its findings come to you, not straight into the file.
