# Claude Design handoff bundle — REFERENCE ONLY

Pulled 2026-08-30 from Claude Design project `e232be1b-7e7d-403e-ac5c-d85658db3dd5`
("Drei Designrichtungen für Jahresschiene") via the `DesignSync` tool.

`Pedro Lopez Chao - Seite.dc.html` is the chosen direction, unmodified.

**This file is not shipped and must never be copied into `src/`.** Per `CLAUDE.md`:

> Claude Design output is a **reference**, not the shipped code. Do not paste its HTML into
> `src/` and call the build done.

It is a Claude Design canvas document: `<x-dc>` template syntax, `{{ }}` bindings, `<sc-if>` /
`<sc-for>` elements and a `DCLogic` subclass, all of which depend on the canvas runtime
(`support.js`) and React. None of that survives the hard constraint of plain HTML/CSS/vanilla JS.

It also hardcodes every string in a `COPY` const, which violates the single-source rule.
`docs/04-ui-spec.md` is the extraction of its *decisions*; that is what phases 5 and 6 build from.

Two project files were deliberately not kept:

- `support.js` — the generated Claude Design canvas runtime (`// GENERATED from dc-runtime/src/*.ts`).
  Editor plumbing, no design content.
- `375 px Ansicht.dc.html` — a canvas artboard that embeds the page twice in iframes. Its only
  substantive content is the caption "Timeline gekippt, Radar entfallen", recorded in the spec.
