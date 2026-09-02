/* Entry point. fetch -> validate -> render -> bind.

   The page is rendered in the browser from content/cv.json and content/copy.json,
   which GitHub Pages serves as ordinary static assets. There is no build step.
   What that buys: the timeline axis ends in the current month on every page load,
   forever, with nobody touching the repository. What it costs is in <noscript>. */

import { load } from './data.js';
import { renderAll, setBulletCounts, packTimeline, fitRadar, relaxRadarLabels, syncRadarScroll } from './render.js';
import { applyLanguage, applyDocument, lookup, LANGS } from './i18n.js';
import { bindHighlight, onResize, announce } from './a11y.js';
import * as T from './timeline.js';
import * as R from './radar.js';

const DEFAULT_LANG = 'de';

main();

async function main() {
  let data;
  try {
    data = await load();
  } catch (err) {
    // Tier 1. Validation completes before anything is appended, so the DOM was
    // never touched: there is no half-built page to clear away.
    console.error(err);
    document.getElementById('fehler')?.removeAttribute('hidden');
    return;
  }

  const { cv, copy } = data;
  let lang = DEFAULT_LANG;

  setBulletCounts(copy);
  const { masthead, main: mainFragment, footer, refreshers } = renderAll(cv, copy, lang);

  // One synchronous block: the visitor sees the shell, then the finished page.
  // No partial states, no skeleton, no spinner.
  document.getElementById('masthead').replaceChildren(masthead);
  document.getElementById('inhalt').replaceChildren(mainFragment);
  document.getElementById('footer-inhalt').replaceChildren(footer);

  const setLanguage = (next) => {
    lang = next;
    applyLanguage(document.body, copy, lang);
    applyDocument(copy, lang);
    for (const refresh of refreshers) refresh(lang);
    // English labels are longer than German in places, so the labels are
    // re-relaxed and the frame refitted.
    relaxRadarLabels(document);
    fitRadar(document);
  };
  setLanguage(lang);

  bindLanguageToggles(copy, setLanguage);
  bindHighlights(copy, () => lang);

  // Packing needs real layout, so it waits for the first paint.
  requestAnimationFrame(() => {
    relaxRadarLabels(document);
    fitRadar(document);
    packTimeline(document);
  });
  onResize(() => {
    packTimeline(document);
    syncRadarScroll(document.querySelector('.range__radar'));
  });

  // Geometry is pure (data, date) -> numbers, so it is checkable from the
  // console against the tables in docs/05-architecture.md and 04-ui-spec.md §5.2.
  window.__geo = { timeline: T, radar: R, cv, copy, relaxRadarLabels, fitRadar, packTimeline };
}

function bindLanguageToggles(copy, setLanguage) {
  for (const btn of document.querySelectorAll('[data-lang]')) {
    btn.addEventListener('click', () => {
      const next = btn.dataset.lang;
      if (!LANGS.includes(next)) return;
      setLanguage(next);
      // An in-place text swap is silent to a screen reader. Focus stays on the
      // button that was pressed, because nothing is created or destroyed.
      announce(lookup(copy, 'microcopy.langToggleAriaLabel', next));
    });
  }
}

function bindHighlights(copy, currentLang) {
  const status = () => lookup(copy, 'microcopy.layerHighlighted', currentLang());

  const groups = document.querySelector('.range__groups');
  const radar = document.querySelector('.radar');
  if (groups && radar) {
    // One control set drives both the list and its wedge, so the link between
    // them is an interaction as well as a label (A11).
    bindHighlight({
      containers: [groups, radar],
      controls: [...groups.querySelectorAll('.skillgroup__btn')],
      groups: [...groups.querySelectorAll('.skillgroup'), ...radar.querySelectorAll('[data-group]')],
      statusText: status,
    });
  }

  const timeline = document.querySelector('.timeline');
  if (timeline) {
    bindHighlight({
      containers: [timeline],
      controls: [...timeline.querySelectorAll('.timeline__lane-label')],
      groups: [...timeline.querySelectorAll('.timeline__lane')],
      statusText: status,
    });
  }
}
