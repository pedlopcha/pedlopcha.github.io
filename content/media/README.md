# Portrait

Copy the photograph into this folder as **`photo_square.jpg`**.

The filename is fixed — `content/cv.json` → `meta.photo` refers to it. Changing the
name means editing `cv.json` too.

| | |
|---|---|
| Filename | `photo_square.jpg` |
| Aspect ratio | **1:1 square.** The layout reserves a square box (`clamp(180px, 21vw, 272px)` at desktop). A non-square image will be cropped to centre, which may cut the top of the head. |
| Minimum size | 544 × 544 px — twice the largest rendered size, so it stays sharp on a 2× display. |
| Recommended | 800 × 800 px or larger. Anything above ~1200px is wasted; the build downscales. |
| Format | JPEG. PNG is accepted but will be larger for a photograph. |
| Weight | Aim under 200 KB after export. The build may re-encode. |

Framing: head and shoulders, eyes roughly on the upper third, some space above the head.
The box has no border and no rounded corners — the photograph sits directly on the paper
ground, so a busy or high-contrast background will fight the page.

The alt text is **not** set here. It lives in `content/copy.json` → `sections.opening.photoAlt`,
in both languages, and is approved phase 3 copy.

Until a real file is present the build has no portrait. Phase 5 decides whether a missing
file is a build error or a silently omitted element — see `docs/04-ui-spec.md` §10, Q3.
