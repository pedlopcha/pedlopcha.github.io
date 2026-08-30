---
description: Run phase 0 — parse content/cv.tex into structured content/cv.json
---

Read `content/cv.tex`. Parse it into structured JSON at `content/cv.json`.

Rules:
- Preserve everything. This is the source of truth; cutting happens in phase 1, not here.
- Use stable, semantic keys. Arrays of objects for roles, education, projects, publications.
- Split compound fields: dates into `start` and `end` (ISO where possible, `null` for present),
  locations into `city` and `country`, bullet lists into arrays of strings.
- Keep LaTeX escapes out — output real UTF-8 characters.
- Add a `meta` block: name, headline, contact, links, languages.

Then show the user the schema you produced and the count of items in each array, and ask them
to confirm nothing was lost before continuing. Do not proceed to phase 1 in the same turn.
