# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Fracciones VS** — a Spanish-language fraction-practice game for kids, deployed as a Cloudflare Worker (`math.giorgiosaud.io`) that serves a React SPA plus a small D1-backed leaderboard API. All UI copy is in Spanish; keep it that way. **The one exception is `src/lib/jokes.ts`**, which mixes in English jokes on purpose — the kids playing are bilingual, and those jokes are puns that only work in English (`7 8 9` / "seven ate nine"). Do not translate them; translating kills the joke.

It was built by the owner so his son could practice fractions with his friends — which is why it's Spanish-only, two players share one keyboard, there are no accounts, and a network failure never blocks play.

## Commands

Package manager is **pnpm**.

```bash
pnpm dev                    # Vite dev server (Cloudflare plugin runs the worker locally too)
pnpm build                  # tsc -b && vite build
pnpm lint                   # eslint .
pnpm preview                # build + wrangler dev (production-like worker + assets)
pnpm deploy                 # build + wrangler deploy
```

There is **no `test` script** — run Vitest directly:

```bash
pnpm vitest run                              # all tests once
pnpm vitest run src/lib/topics/registry.test.ts   # single file
pnpm vitest run -t "name of test"            # single test by name
pnpm vitest                                  # watch mode
```

D1 schema lives in `migrations/*.sql`, applied with wrangler:

```bash
pnpm wrangler d1 migrations apply fracciones-leaderboard --local   # or --remote
```

## Architecture

**Single-page, screen-switch app.** `src/App.tsx` holds all top-level state (`Screen`, `GameConfig`, final scores) and swaps between four screens — there is no router. Screens: `Home` → `Game` (2-player VS) or `SoloGame` → `FinalScoreboard`. Adding a screen means extending the `Screen` union in `src/lib/types.ts` and the conditional chain in `App.tsx`.

**Topics are a registry; the game engine knows nothing about maths.**
- `src/lib/topics/` is the single source of truth for which topics exist. Each topic is a self-contained folder (`fracciones/`, `decimales/`, `algebra/`) exporting generators, a `Render` component, and its `describe`/`hint` text, registered in `topics/index.ts`. **Adding a topic is a new folder plus one line in that index** — no changes to the game screens.
- `Exercise` carries only what the game consumes (`topic`, `type`, `answer`, `displayAnswer`, `options`) plus an opaque `payload` that only the owning topic reads. Each topic narrows that payload in exactly one place (`fraccionesPayload`, `decimalesPayload`).
- `generateExercise(round, topics, indice)` picks the topic *first*, then a generator within it — a flat draw would over-weight whichever topic has more generators. With `indice` (the question number, which both game screens pass) the topics rotate **by turn** instead of being drawn: an independent draw only gets the proportion right in the long run, and a ten-question game could hand out 6-2-2. Difficulty still comes from `round` alone, which is the question number divided by three.
- **A new device starts with every topic ticked** (`DEFAULT_TOPICS`), not just fractions.
- `ExerciseStatement` passes `selectedOption` to **every** topic's `Render`; the topic decides whether to use it. Do not reintroduce a list of exercise-type names in the game screens — that was a leak that made adding a type require editing both screens.
- `components/exercise/ExerciseDisplay.tsx` dispatches to the topic's renderer and owns only the generic parts (option grid, label formatting). `exerciseText.ts` holds the non-component helpers.
- `registry.test.ts` walks every generator of every registered topic and checks the `Exercise` contract, so **a new topic inherits test coverage by registering**.
- Exercise content follows the pupil's textbook (SM Savia, Matemática 5º básico) literally — its notation lives in the bpl-context spec `fracciones-vs-temario`. Algebra multiplication is **order-dependent**: a number before a letter is juxtaposed (`3x`), anything else takes a middle dot (`x · 2`, `a · b`). `algebra/expresion.ts` is the only place that decides this.
- Spanish numerals live in `src/lib/palabras.ts`, outside the topics: it is language, not maths, and both decimales and algebra need it.
- Decimals are integers scaled by a power of ten (`units / 10^scale`), never floats — `0.1 + 0.2 !== 0.3` and a kid must not lose a question to IEEE 754. Repeating fractions are excluded at generation. Display uses a comma.
- `Game.tsx` (VS buzzer duel: `q`/`p` keys, HP, streak-multiplied damage via `calcDamage`, second chance, comeback) and `SoloGame.tsx` (`calcPoints` — same streak curve times `timerMultiplier`) only forward `config.topics`. **If you change one scoring curve, check the other** — they are deliberately parallel.

`Game.tsx` and `SoloGame.tsx` are the two large files (~500-600 lines each) and hold most of the effects/sound wiring. `useSoundFX` and `useBGM` synthesize everything with the WebAudio API — no audio assets.

**Leaderboard: offline-first, never blocking.** The chain is
`SoloGame` → `submitOrQueueScore` (`scoreSync.ts`) → `submitScore` (`leaderboardApi.ts`) → worker.

Invariants to preserve:
- Every function in `leaderboardApi.ts` swallows errors and returns a "no data"/`'unknown'` value. The leaderboard is a bonus; a network failure must never block gameplay or exiting a session.
- A failed submit is queued in localStorage (`scoreQueue.ts`, capped at 20) and retried by `registerScoreSync()` — mounted once for the app's lifetime in `App.tsx` — on load and on the `online` event.
- Retries are safe because each submission carries a stable `idempotencyKey`; the worker records it in `processed_submissions` and no-ops duplicates.
- Name ownership is a "silent claim": `deviceId.ts` stores a random UUID in localStorage, sent as `ownerToken`. Same name + different device → HTTP 409 `name_taken`. No accounts, no login.

**Worker (`worker/index.ts`)** is a plain fetch handler — three routes under `/api/leaderboard/` (`check`, `submit`, `top`), everything else falls through to `env.ASSETS` (SPA fallback configured in `wrangler.jsonc`). It re-validates all input: names truncated, ints clamped, and `questionLimit`/`timerSeconds` **snapped to the fixed sets that match the Home screen selectors** — if you add an option in `Home.tsx`, add it to `QUESTION_LIMITS`/`TIMER_SECONDS_OPTIONS` in the worker or scores get bucketed into the wrong leaderboard. Leaderboards are segmented by `question_limit` **and `topic_category`** (`fracciones` / `decimales` / `algebra` / `mixto`, derived from the session's topics in `topicSelection.ts` — the player never picks it directly). **A new topic needs its category added to both `TopicCategory` (client) and `TOPIC_CATEGORIES` (worker) in the same change**, or a single-topic session derives a value the worker rejects and files under the default. An unknown category is filed as `fracciones` rather than rejected: losing a kid's score is worse than misfiling it. Accuracy is only recorded past `MIN_ATTEMPTS_FOR_ACCURACY` (10) — a constant duplicated in `soloStorage.ts`.

**localStorage keys** (all reads defensively try/catch — private browsing must degrade, not crash): `fracciones:deviceId`, `fracciones:soloHighScore`, `fracciones:pendingScores`, `fracciones-vs-wins` (VS-mode win tally, `wins.ts`).

Ideas and follow-ups that are not yet decided go to `openspec/roadmap.md` — an org rule, so they do not die inside the proposal of finished work.

## Change workflow (OpenSpec)

Planning lives in `openspec/`, and each change gets its own branch:

1. `openspec new change "<kebab-name>"` → write `proposal.md`, `specs/`, `design.md`, `tasks.md`. Run `openspec instructions <artifact> --change "<name>" --json` first; it carries the project context and per-artifact rules from `openspec/config.yaml`.
2. Branch `change/<name>` and commit the artifacts **before** writing code — the branch opens with the spec.
3. Implement by working `tasks.md` top to bottom (`/opsx:apply`), committing as tasks complete.
4. `openspec validate <name>` must pass; `openspec archive <name>` promotes the delta specs into `openspec/specs/`.
5. Open the PR after archiving, so it carries spec, implementation, and the updated living specs together.

`openspec/config.yaml` holds the product constraints and the per-artifact rules (Spanish, TDD, visual verification, `frontend-design` for UI direction). Superpowers skills cover the *process* — brainstorming, TDD, verification, code review; OpenSpec owns the *artifacts*. Don't run `superpowers:writing-plans`: `tasks.md` replaces it.

The three documents in `docs/superpowers/` predate this and describe already-shipped work. They are history — don't migrate or update them.

## Conventions

- No semicolons, single quotes, 2-space indent.
- **Styling:** existing screens use Tailwind, but **new code must not add it** — the intent is to remove Tailwind in a separate change. New UI follows BPL DS (https://ds.bepartnerlabs.com/AGENTS.md): component tokens named after the CSS property they resolve (`--chip-background`), states redeclaring the same token instead of a `-hover` suffix, private resolvers prefixed `--_`, and live state in native pseudo-classes (`:checked`) rather than toggle classes. See `TopicSelector.css`. Take the DS's patterns and tokens, not its palette: the arcade look — display type, saturated colours, hard shadows, framer-motion — is deliberate and stays.
- **`pnpm lint` must be completely clean.** It was red with 24 pre-existing errors until Aug 2026; that exception is over. There are no `eslint-disable` comments in the repo — when a `react-hooks` rule fires, check whether the state is redundant before reaching for a suppression.
- Tests are colocated (`foo.ts` + `foo.test.ts`), Vitest + Testing Library, jsdom, globals enabled (`src/test-setup.ts`). **fast-check** covers the pure modules and the phrase catalogue with properties; it cannot reach inside the generators, which draw from `Math.random()` directly. `vite.config.ts` skips the Cloudflare and PWA plugins under `VITEST` — don't remove that guard, the Worker environment breaks the Vitest pool.
- Comments here explain *why* a rule exists (product decisions about kids playing offline), not what the code does. Match that when adding non-obvious logic.
- `docs/superpowers/` holds the design specs and implementation plans this project was built from — useful background for feature work.
- The `README.md` is still the untouched Vite template and describes nothing about this project.
