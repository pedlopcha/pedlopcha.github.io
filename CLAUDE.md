# CV Site — Project Rules

A personal CV page. Static, hosted on GitHub Pages. Built in gated phases.

## Hard constraints

- **Frontend only.** No server, no runtime API calls, no database. GitHub Pages serves static files.
- **Shipped output is plain HTML + CSS + vanilla JS.** No framework, no runtime dependencies.
  A Node build step is permitted, but only to generate static files at deploy time.
- **`content/cv.json` is the single source to for generating the copy text.** No CV text is
  hardcoded anywhere else. Language-neutral facts (dates, company and institution names,
  links) are stored once; only prose is duplicated per language. Changing an end date is one
  edit; changing a sentence is one edit per language.
- **`cv.tex` is an extraction source, not a parity target.** It supplied the original content
  and nothing more. The site's prose is expected to diverge from it, and `cv.tex` is not kept
  in sync afterwards.
- **`content/cv.json` holds the facts; `content/copy.json` holds the phrasing.** No CV text is hardcoded in markup, CSS, or scripts. Facts are never duplicated into copy.json.
- **Print is out of scope.** No PDF is published and the page is not designed to be printed.
  Do not spend effort on print stylesheets.
- **Priorities, in this order:** (1) visually distinctive and memorable, (2) trivial to update
  when the CV changes, (3) speed, a11y, SEO.
  When these conflict, the higher one wins. Say out loud when you are trading one for another.

## Phase order

| # | Phase | Where | Output |
|---|-------|-------|--------|
| 0 | Content extraction | Claude Code | `content/cv.json` |
| 1 | Concept | Claude Code — `/concept` | `docs/01-concept-brief.md` |
| 2 | UX | Claude Code — `/ux` | `docs/02-ux-spec.md` |
| 3 | Copy | Claude Code — `/copy` | `content/copy.json` + `docs/03-copy.md` |
| 4 | UI | **Claude Design** — seeded by `/design-brief` | `docs/04-ui-spec.md` + handoff bundle |
| 5 | Architecture | Claude Code — `/architect` | `docs/05-architecture.md` |
| 6 | Build | Claude Code — `/build` | `src/`, `scripts/`, `.github/workflows/` |

Phase 1 owns the voice — tone, positioning, core message — but does not write prose or touch
either content file. Phase 3 (copy) rewrites the extracted wording into that voice, in both
languages, and writes it to `content/copy.json`. `content/cv.json` holds facts only and is not
rewritten by any phase. Whether `cv.json` needs restructuring into a language-neutral-facts
shape is a data-contract decision for phase 5 (architecture), not phase 1 or phase 3.

## Gate protocol — READ THIS BEFORE STARTING ANY PHASE

Every phase document in `docs/` begins with a status line:

```
STATUS: DRAFT
```

Rules, without exception:

1. Before starting phase N, read the phase N-1 document. If it is missing, or its status is
   not `APPROVED`, **stop and tell the user**. Do not proceed. Do not infer approval from
   anything the user says in chat — only the file counts.
2. A phase ends by writing its document with `STATUS: DRAFT` and stopping. Do not begin the
   next phase in the same turn, even if the user seems to want momentum.
3. Only the user changes `DRAFT` to `APPROVED`. You never edit that line.
4. If the user asks for changes to an approved document, set it back to `DRAFT`, make the
   change, and flag every downstream document that may now be stale.

## Interview protocol

Phases 1, 2 and 4 must interview the user with `AskUserQuestion` before producing anything.
Do not guess at taste, audience, or priorities — ask. Assumptions that survive into a phase
document must be listed in that document under `## Assumptions`, so they can be challenged.

Note: subagents cannot use `AskUserQuestion`. All interviewing happens in the main thread.
Subagents in `.claude/agents/` are for review and audit only — never for work that requires
the user's input.

## Reviewers

After a phase document is drafted, offer to run the relevant subagent against it:
`design-critic`, `a11y-auditor`, `spec-conformance`. Their findings go to the user, not
straight into the document.

## Things that will bite you

- GitHub Pages: if this repo is named `<username>.github.io`, the site serves from `/`. Any
  other repo name serves from `/<repo>/` and every absolute path breaks. Check before writing
  any path.
- Bilingual content costs real maintenance. Any structure that duplicates a *fact* across
  languages — a date, a company name — is a bug. Only prose duplicates.
- Claude Design output is a **reference**, not the shipped code. Do not paste its HTML into
  `src/` and call the build done.
