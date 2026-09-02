/* Focus management, the live region, and the sticky highlights.

   A3 / A7: the radar's group headings and the timeline's lane labels are real
   buttons that toggle a sticky highlight on click or Enter, with aria-pressed,
   in addition to responding to hover and focus. The design responded only to
   mouseenter, so a keyboard user got nothing from pressing Enter and a touch
   user could not reach the interaction at all. */

export function announce(text) {
  const region = document.getElementById('ansage');
  if (!region) return;
  // Re-setting identical text does not re-announce; clear first.
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = text; });
}

/**
 * Wire one set of controls to a highlight across one or more containers.
 *
 * One controller, not one per container: the group headings drive both their own
 * list and the radar, and two independent controllers fight — each one's
 * click-outside handler cancels the other's sticky state, because the button
 * lives inside one container and not the other.
 *
 * - hover and focus preview the highlight,
 * - click or Enter/Space makes it sticky (aria-pressed), a second press clears it,
 * - a click outside every container clears it.
 */
export function bindHighlight({ containers, controls, groups, statusText }) {
  let sticky = null;

  const paint = (preview) => {
    const active = preview ?? sticky;
    for (const el of groups) {
      el.toggleAttribute('data-active', active != null && el.dataset.group === active);
    }
    for (const btn of controls) {
      btn.setAttribute('aria-pressed', String(sticky === btn.dataset.group));
    }
    for (const box of containers) box.toggleAttribute('data-highlight', active != null);
  };

  for (const btn of controls) {
    const key = btn.dataset.group;
    btn.addEventListener('pointerenter', () => paint(key));
    btn.addEventListener('pointerleave', () => paint(null));
    btn.addEventListener('focus', () => paint(key));
    btn.addEventListener('blur', () => paint(null));
    btn.addEventListener('click', () => {
      sticky = sticky === key ? null : key;
      paint(null);
      if (sticky && statusText) announce(statusText());
    });
  }

  document.addEventListener('click', (ev) => {
    if (sticky == null) return;
    if (containers.some((box) => box.contains(ev.target))) return;
    sticky = null;
    paint(null);
  });

  return { clear() { sticky = null; paint(null); } };
}

/** Re-run `fn` after a resize, debounced. The only place layout is read. */
export function onResize(fn, wait = 150) {
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(fn, wait);
  });
}
