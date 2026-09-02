/* Language state and the [data-copy] swap.

   Structure comes from cv.json, which has no language, so structure is identical
   in both languages: nothing is created or destroyed on switch. Scroll position
   is exact, focus stays on the button that was pressed, and the two diagrams are
   untouched.

   The mount vocabulary:
     data-copy="<dot path>"        text content from copy.json
     data-copy-index="2"           ... where the path holds an array of strings
     data-copy-part="1"            ... where the string splits on a blank line
     data-copy-else="<literal>"    fall back to this fact when the path is absent
     data-copy-optional            absent is normal; hide the element, do not warn
     data-copy-fmt="<dot path>"    a template, filled from this element's data-fmt-*
     data-copy-attr="alt:<path>"   an attribute rather than a text node
*/

export const LANGS = ['de', 'en'];
const warned = new Set();

function warnOnce(key, message) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

/** Walk a dot path. Returns undefined if any step is missing. */
function at(copy, path) {
  let node = copy;
  for (const key of path.split('.')) {
    if (node == null) return undefined;
    node = node[key];
  }
  return node;
}

/**
 * Resolve a dot path to a string in `lang`, or null if there is no entry.
 * A missing English string falls back to German and warns once — there is no
 * build to fail against, so 02-ux-spec.md's "fail-build vs fall-back" resolves
 * to fall-back. The page never shows an empty element or a raw key.
 */
export function resolve(copy, path, lang, index = null) {
  let node = at(copy, path);
  if (node == null) return null;
  if (index != null) {
    if (!Array.isArray(node)) return null;
    node = node[index];
    if (node == null) return null;
  }
  if (typeof node === 'string') return node;
  if (node[lang] != null) return node[lang];
  if (node.de != null) {
    warnOnce(`${path}:${lang}`, `copy.json: "${path}" has no "${lang}" string; using German`);
    return node.de;
  }
  return null;
}

/** Resolve, warning if the key is missing entirely. */
export function lookup(copy, path, lang, index = null) {
  const value = resolve(copy, path, lang, index);
  if (value == null) {
    warnOnce(path, `copy.json: no entry at "${path}"`);
    return '';
  }
  return value;
}

export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? values[k] : `{${k}}`));
}

const PARAGRAPH = /\n\s*\n/;

/** Swap every language-dependent string in place. */
export function applyLanguage(root, copy, lang) {
  for (const el of root.querySelectorAll('[data-copy]')) {
    const { copy: path, copyIndex, copyPart, copyElse } = el.dataset;
    const index = copyIndex == null ? null : Number(copyIndex);
    let value = resolve(copy, path, lang, index);

    if (value != null && copyPart != null) {
      value = value.split(PARAGRAPH).map((s) => s.trim()).filter(Boolean)[Number(copyPart)] ?? null;
    }
    if (value == null && copyElse != null) value = copyElse;

    const optional = 'copyOptional' in el.dataset;
    if (value == null) {
      if (!optional) warnOnce(path, `copy.json: no entry at "${path}"`);
      el.hidden = true;
      el.textContent = '';
      continue;
    }
    el.hidden = false;
    el.textContent = value;
  }

  for (const el of root.querySelectorAll('[data-copy-fmt]')) {
    const values = {};
    for (const [k, v] of Object.entries(el.dataset)) {
      if (k.startsWith('fmt')) values[k.slice(3).toLowerCase()] = v;
    }
    el.textContent = fill(lookup(copy, el.dataset.copyFmt, lang), values);
  }

  for (const el of root.querySelectorAll('[data-copy-attr]')) {
    for (const pair of el.dataset.copyAttr.split(',')) {
      const [attr, path] = pair.split(':');
      el.setAttribute(attr.trim(), lookup(copy, path.trim(), lang));
    }
  }

}

/**
 * The document-level half of a language switch: the lang attribute, the head
 * strings index.html duplicates for crawlers and unfurlers, and the toggles'
 * pressed state. Separated so it runs once per switch rather than once per
 * rendered fragment.
 */
export function applyDocument(copy, lang) {
  document.documentElement.lang = lang;

  document.title = lookup(copy, 'meta.pageTitle', lang);
  setMeta('name', 'description', lookup(copy, 'meta.metaDescription', lang));
  setMeta('property', 'og:title', lookup(copy, 'meta.ogTitle', lang));
  setMeta('property', 'og:description', lookup(copy, 'meta.ogDescription', lang));
  setMeta('property', 'og:locale', lang === 'de' ? 'de_DE' : 'en_GB');

  for (const btn of document.querySelectorAll('[data-lang]')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  }
}

function setMeta(keyAttr, key, value) {
  const el = document.head.querySelector(`meta[${keyAttr}="${key}"]`);
  if (el) el.setAttribute('content', value);
}
