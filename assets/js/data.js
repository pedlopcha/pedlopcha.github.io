/* Fetch, parse and validate the two content files.

   Validation runs to completion before anything is written to the DOM, so a
   tier-1 failure means the DOM was never touched — there is no half-built page
   to clean up. Failure modes are in docs/05-architecture.md. */

export class DataError extends Error {}

export async function load() {
  const [cv, copy] = await Promise.all([
    fetchJson('/content/cv.json'),
    fetchJson('/content/copy.json'),
  ]);
  validate(cv, copy);
  return { cv, copy };
}

async function fetchJson(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (cause) {
    throw new DataError(`${url}: network error`, { cause });
  }
  if (!res.ok) throw new DataError(`${url}: HTTP ${res.status}`);
  try {
    return await res.json();
  } catch (cause) {
    throw new DataError(`${url}: not valid JSON`, { cause });
  }
}

/** Tier 1 — the page cannot render. Structural, and unpairable records. */
function validate(cv, copy) {
  for (const key of ['meta', 'experience', 'skills']) {
    if (!cv[key]) throw new DataError(`cv.json: missing "${key}"`);
  }
  if (!copy.meta || !copy.sections) throw new DataError('copy.json: missing "meta" or "sections"');

  pair(cv.experience, copy.roles, 'experience', 'roles');
  pair(cv.education, copy.education, 'education', 'education');
  pair(cv.earlierStations, copy.earlierStations, 'earlierStations', 'earlierStations');

  for (const l of cv.meta.languages ?? []) {
    if (!copy.languages?.[l.id]) throw new DataError(`copy.json: no languages.${l.id}`);
  }
  for (const cat of cv.skills.technical ?? []) {
    if (!cat.id) throw new DataError('cv.json: a skills.technical category has no id');
    if (cat.rated && !copy.sections.range?.groups?.[cat.id]) {
      throw new DataError(`copy.json: no sections.range.groups.${cat.id}`);
    }
  }
}

function pair(records, prose, cvKey, copyKey) {
  for (const r of records ?? []) {
    if (!r.id) throw new DataError(`cv.json: an entry in "${cvKey}" has no id`);
    if (!prose?.[r.id]) throw new DataError(`copy.json: no ${copyKey}.${r.id} for cv.json "${r.id}"`);
  }
}

/**
 * Tier 2 — one component does not render, the rest of the page does.
 * Returns null and logs, rather than throwing, so the caller can omit just the
 * diagram. The visible signal is the component's absence, which on a page with
 * two large diagrams is unmissable.
 */
export function tier2(label, fn) {
  try {
    return fn();
  } catch (err) {
    console.error(`${label} not rendered: ${err.message}`);
    return null;
  }
}
