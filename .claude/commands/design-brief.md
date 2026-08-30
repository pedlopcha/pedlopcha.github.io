---
description: Package the approved concept and UX specs into a prompt to paste into Claude Design (phase 3)
---

Phase 3 happens in Claude Design, not here. Your job is to prepare the handoff.

1. Gate check: `docs/01-concept-brief.md` , `docs/02-ux-spec.md` and `docs/03-copy.md` must be `APPROVED`.
   If either is not, stop and say which.

2. Read all those briefs, plus `content/copy.json`.

3. Output a single fenced code block the user can copy straight into a new Claude Design
   project. It must be self-contained — Claude Design cannot see this repo. Include:

   - A one-line statement of what is being designed and who for.
   - The core message and tone from the concept brief, verbatim where it is sharp.
   - The section inventory and order from the UX spec.
   - Real content, pulled from `copy.json` — never lorem ipsum.
     Designs made against fake content fall apart against real content.
   - The above-the-fold requirement, at desktop and at 375px.
   - The hard constraints: static HTML/CSS/vanilla JS output, no framework.
   - The liked/disliked references from the brief, with the stated reasons.
   - An explicit instruction to produce **three visually divergent directions** before
     refining any of them. Distinctiveness was ranked first; a single first draft will
     converge on the safe option.

4. After the code block, give the user a short working sequence for Claude Design:
   - Paste the prompt, ask for three directions.
   - Pick one, then refine by inline comment on specific elements rather than by rewriting
     the whole prompt.
   - Ask it explicitly for the print view and the 375px view — they will not appear on their own.
   - When happy, use the Claude Code handoff bundle rather than the plain HTML export. The
     bundle carries layout, colour values, spacing and component intent; the HTML export
     carries only the result.

5. Tell them that when they come back, phase 4 needs `docs/04-ui-spec.md` to exist with
   `STATUS: DRAFT`. Offer to write that file for them from the handoff bundle once they have
   it — extracting the design tokens, type scale, spacing scale, colour roles and component
   list into a form phases 4 and 5 can build against.
