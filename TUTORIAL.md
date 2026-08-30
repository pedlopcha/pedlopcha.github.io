# Setting this up from zero

Written for someone who has never used Claude Code. Budget about 45 minutes for parts 1–6.
Nothing here is hard, but a few steps are easy to get subtly wrong, and I've flagged those.

---

## Part 0 — What you need first

- **A Claude paid plan.** Pro, Max, Team, or Enterprise. Claude Code is not on the free plan.
- **A GitHub account.** Free is fine.
- **Your LaTeX CV file** (`.tex`).
- **Git installed.** Check by opening a terminal and running `git --version`. If that errors,
  get it from [git-scm.com](https://git-scm.com/downloads).

You do **not** need Node.js yet. If phase 4 settles on a build step, Claude Code will tell you
then, and you can install it at that point.

### Opening a terminal

- **macOS** — Cmd+Space, type "Terminal", Enter.
- **Windows** — Start menu, "Terminal". This opens PowerShell by default, which is what you want.
- **Linux** — you know where it is.

---

## Part 1 — Install Claude Code

Pick the line for your system and paste it into the terminal.

**macOS / Linux / WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

> If you get `'irm' is not recognized`, you're in CMD rather than PowerShell. Your prompt shows
> `PS C:\` in PowerShell and just `C:\` in CMD. Close it and open "Terminal" instead.

Alternatives if you prefer a package manager: `brew install --cask claude-code` on macOS, or
`winget install Anthropic.ClaudeCode` on Windows. Both work, but neither auto-updates — the
native installer above does, which is one less thing to remember.

**On native Windows, also install [Git for Windows](https://git-scm.com/downloads/win).**
Without it Claude Code falls back to PowerShell for shell commands, which behaves differently
enough to cause confusing failures. If you're on WSL, skip this.

Check it worked:
```bash
claude --version
```
You should see a version number followed by `(Claude Code)`.

---

## Part 2 — Log in

```bash
claude
```

First run opens your browser to sign in. Do that, come back to the terminal, and you're
authenticated for good. To switch accounts later, type `/login` inside a session.

Type `/exit` to quit for now.

---

## Part 3 — Create the repo

Go to [github.com/new](https://github.com/new).

**Name it `<your-username>.github.io`** — literally your GitHub username, then `.github.io`.
So if you're `jsmith`, the repo is `jsmith.github.io`.

This matters more than it looks. A repo with that exact name serves your site from
`https://jsmith.github.io/`. Any other name serves from `https://jsmith.github.io/reponame/`,
and then every path in your CSS, every image link, every anchor needs a prefix — and the day
you forget one, it works locally and 404s in production. Use the special name and the problem
never exists.

Set it **Public** (GitHub Pages needs public on free accounts). Tick "Add a README file".
Create.

Then clone it to your machine. On the repo page, click the green **Code** button, copy the
HTTPS URL, and:

```bash
cd ~/Documents
git clone https://github.com/jsmith/jsmith.github.io.git
cd jsmith.github.io
```

Substitute your own URL and pick whatever folder you like instead of `~/Documents`.

---

## Part 4 — Add the scaffold

Unzip `cv-site-scaffold.zip` and copy its contents — **the contents, not the folder** — into
the repo folder you just cloned. When you're done, `CLAUDE.md` should sit next to `README.md`
at the top level, and there should be a `.claude` folder beside them.

The `.claude` folder starts with a dot, so it's hidden by default. On macOS press
**Cmd+Shift+.** in Finder to show hidden files. On Windows, View → Show → Hidden items.

Then drop your LaTeX CV in as `content/cv.tex`. Rename it to exactly that.

Check the structure from the terminal:
```bash
ls -a
```
You want to see `.claude`, `CLAUDE.md`, `content`, `docs`, `src`, `README.md`.

---

## Part 5 — First session

```bash
claude
```

You'll get a prompt. Before anything else, Claude Code will ask whether you trust this folder.
**Say yes.** Project-level agents and skills don't load until you do, so if you decline, the
whole setup silently doesn't work.

Now verify everything loaded. Type:

```
/doctor
```

Then type `/` on its own — you should see `/concept`, `/ux`, `/design-brief`, `/architect`,
`/build`, and `/extract-cv` in the list alongside the built-in commands.

If they're missing: press Ctrl+C twice to quit, run `claude` again. The agents and commands
directories are only picked up at startup if they existed when the session began.

---

## Part 6 — The eight things you actually need to know

**Terminal:**

| | |
|---|---|
| `cd foldername` | go into a folder |
| `cd ..` | go up one |
| `ls` | list what's here (`dir` on Windows CMD) |
| `pwd` | where am I |

Drag a folder onto the terminal window to paste its path. Press ↑ for your last command.

**Inside Claude Code:**

| | |
|---|---|
| `/help` | list commands |
| `/clear` | wipe the conversation, keep the session |
| `/exit` | quit |
| **Esc** | interrupt Claude mid-answer — use this, it's the most useful key |
| **Shift+Tab** | cycle permission modes |
| `claude -c` | reopen your last conversation in this folder |

**About permission modes.** In your first session Claude Code asks before every file change.
After that, on Pro/Max/Team it switches to auto mode, where a classifier approves most actions
for you. For this project that's fine — it's a fresh repo with nothing to break. But press
Shift+Tab and look at the modes now, while it's low-stakes, so you know they exist.

**A habit worth forming: `/clear` between phases.** Each phase reads its input from `docs/`,
not from the conversation, so a fresh context loses nothing and keeps Claude sharp. A session
that's been running for three phases is a session carrying two phases of noise.

---

## Part 7 — Running the project

### Phase 0 — extract your CV

```
/extract-cv
```

Claude parses `content/cv.tex` into `content/cv.json` and shows you what it found. **Read it
against your actual CV.** This is the source of truth for everything downstream; a job that
gets dropped here is a job that never appears on the site. Tell Claude what it missed.

When it looks right, commit — this gives you an undo point:
```
commit this with a message about extracting the CV
```
Yes, you can just ask in English. Claude Code runs git for you.

### Phase 1 — concept

```
/clear
/concept
```

Claude will interview you. **Answer properly.** If it asks what makes you distinctive and you
say "I'm a good communicator," you will get a website that looks like everyone else's. The
questions about sites you *dislike* are the ones that shape the design most — be specific and
be blunt.

It writes `docs/01-concept-brief.md` and stops.

Now the important bit. Open that file. Read it. Then optionally:
```
@design-critic review docs/01-concept-brief.md
```
That's a read-only reviewer whose job is to find the vague, agreeable sentences that would
produce a generic result. Take its findings back to the main conversation and fix them.

When you're happy, **edit the file yourself** and change line 1 from:
```
STATUS: DRAFT
```
to:
```
STATUS: APPROVED
```

Nothing else unlocks phase 2. Saying "looks good, continue" won't do it — that's deliberate.

Commit, then repeat the shape for the rest.

### Phase 2 — UX

```
/clear
/ux
```
Same pattern: interview → `docs/02-ux-spec.md` → read → critic → approve → commit.

### Phase 3 — the design detour

```
/design-brief
```

This doesn't design anything. It prints a block of text. **Copy the whole block.**

Now leave the terminal. Open Claude Design, start a new project, paste the block.

Three things to do there:

1. Ask for the three directions and actually look at all three before picking. The first one
   is rarely the interesting one.
2. Refine by clicking an element and leaving an inline comment, not by rewriting your whole
   prompt. Rewriting the prompt regenerates everything and you lose what was working.
3. Explicitly ask to see the **print view** and the **375px mobile view**. Neither shows up on
   its own, and both are on your priority list.

When you're happy, use the **Claude Code handoff** export rather than the plain HTML export.
The handoff bundle carries colour values, spacing, and component intent; the HTML export only
carries the finished pixels.

Back in the terminal:
```
/clear
I have the Claude Design handoff bundle at <path>. Write docs/03-ui-spec.md from it.
```

Read it, approve it, commit.

### Phase 4 — architecture

```
/clear
/architect
```

This one asks a real question: how content gets from `cv.json` into the page. Claude will lay
out three options with a recommendation. The recommendation involves a small build step, which
means installing Node.js. If that's a step too far, say so — there's a simpler fallback and
Claude will explain the trade-off rather than sulk about it.

Approve, commit.

### Phase 5 — build

```
/clear
/build
```

Claude builds section by section from the UX spec's order and shows you each one. To see it in
a browser, open `src/index.html` — or ask Claude to start a local server and it will give you
a URL.

When it says it's done:
```
@a11y-auditor audit the built site
@spec-conformance check the build against all approved specs
```

Fix what they find. Commit.

---

## Part 8 — Publish

```bash
git push
```

Then on GitHub: your repo → **Settings** → **Pages** (left sidebar) → under "Build and
deployment", set Source. If phase 4 chose no build step, pick **Deploy from a branch**, branch
`main`, folder `/root` or `/docs` depending on where your `index.html` lives. If phase 4 chose
a build step, pick **GitHub Actions** — Claude Code will have written the workflow file.

Save. Wait two or three minutes. Your site is at `https://<your-username>.github.io`.

Check the **Actions** tab if nothing appears — a red X there tells you what failed, and you can
paste the error straight into Claude Code.

---

## Part 9 — Updating it later

Change a job title:

1. Edit `content/cv.json`.
2. `git add . && git commit -m "update role" && git push`

That's it. If it ever takes more than that, something drifted from the architecture spec and
it's worth asking `@spec-conformance` about it.

---

## When something goes wrong

**Commands don't appear after `/`** — quit (Ctrl+C twice) and restart `claude`. Directories are
scanned at startup.

**"Skipped agent file"** — you declined the folder trust prompt. Restart and accept it.

**Claude starts phase 3 while you're still on phase 2** — the previous doc's STATUS line isn't
`APPROVED`, or you approved a doc that doesn't exist yet. Press Esc, check the files.

**Claude ignores the gate entirely** — press Esc and say "read CLAUDE.md and follow the gate
protocol." Long sessions drift; this is what `/clear` between phases prevents.

**The site is blank on GitHub Pages but fine locally** — almost always the repo-name path
problem from Part 3. Paste the browser console errors into Claude Code.

**You want to undo everything since the last phase** — `git log --oneline` to see commits,
then ask Claude to reset to whichever one you name. This is why you commit after each phase.

**Anything else** — you can just ask. Claude Code answers questions about itself:
```
why didn't my custom command load?
```
