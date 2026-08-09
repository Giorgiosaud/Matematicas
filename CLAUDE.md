# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Fracciones VS** — a Spanish-language fraction-practice game for kids, deployed as a Cloudflare Worker (`fractions.bepartnerlabs.com`) that serves a React SPA plus a small D1-backed leaderboard API. All UI copy is in Spanish; keep it that way.

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
pnpm vitest run src/lib/exercises.test.ts    # single file
pnpm vitest run -t "name of test"            # single test by name
pnpm vitest                                  # watch mode
```

D1 schema lives in `migrations/*.sql`, applied with wrangler:

```bash
pnpm wrangler d1 migrations apply fracciones-leaderboard --local   # or --remote
```

## Architecture

**Single-page, screen-switch app.** `src/App.tsx` holds all top-level state (`Screen`, `GameConfig`, final scores) and swaps between four screens — there is no router. Screens: `Home` → `Game` (2-player VS) or `SoloGame` → `FinalScoreboard`. Adding a screen means extending the `Screen` union in `src/lib/types.ts` and the conditional chain in `App.tsx`.

**Two game modes share one exercise engine.**
- `src/lib/exercises.ts` — `generateExercise(round)` produces an `Exercise` (type, fractions, correct answer, shuffled multiple-choice `options`) and `validateAnswer` checks a pick. Difficulty is driven purely by the `round` number, which selects the denominator pool. `src/lib/fractions.ts` wraps `fraction.js` for the arithmetic.
- `src/components/exercise/ExerciseDisplay.tsx` — shared rendering (`renderExercise`, `OptionGrid`, `buildHint`, `exerciseLabel`) used by both `Game.tsx` and `SoloGame.tsx`.
- `Game.tsx` is a fighting-game-style buzzer duel: `q`/`p` keys lock in a player, HP bars, damage with a streak multiplier (`calcDamage`), second-chance rounds, comeback mechanic.
- `SoloGame.tsx` scores points via `calcPoints` — the same streak curve as VS damage, times `timerMultiplier` (harder = shorter timer = more points; "no limit" = ×0.5). **If you change one scoring curve, check the other** — they are deliberately parallel.

`Game.tsx` and `SoloGame.tsx` are the two large files (~500-600 lines each) and hold most of the effects/sound wiring. `useSoundFX` and `useBGM` synthesize everything with the WebAudio API — no audio assets.

**Leaderboard: offline-first, never blocking.** The chain is
`SoloGame` → `submitOrQueueScore` (`scoreSync.ts`) → `submitScore` (`leaderboardApi.ts`) → worker.

Invariants to preserve:
- Every function in `leaderboardApi.ts` swallows errors and returns a "no data"/`'unknown'` value. The leaderboard is a bonus; a network failure must never block gameplay or exiting a session.
- A failed submit is queued in localStorage (`scoreQueue.ts`, capped at 20) and retried by `registerScoreSync()` — mounted once for the app's lifetime in `App.tsx` — on load and on the `online` event.
- Retries are safe because each submission carries a stable `idempotencyKey`; the worker records it in `processed_submissions` and no-ops duplicates.
- Name ownership is a "silent claim": `deviceId.ts` stores a random UUID in localStorage, sent as `ownerToken`. Same name + different device → HTTP 409 `name_taken`. No accounts, no login.

**Worker (`worker/index.ts`)** is a plain fetch handler — three routes under `/api/leaderboard/` (`check`, `submit`, `top`), everything else falls through to `env.ASSETS` (SPA fallback configured in `wrangler.jsonc`). It re-validates all input: names truncated, ints clamped, and `questionLimit`/`timerSeconds` **snapped to the fixed sets that match the Home screen selectors** — if you add an option in `Home.tsx`, add it to `QUESTION_LIMITS`/`TIMER_SECONDS_OPTIONS` in the worker or scores get bucketed into the wrong leaderboard. Leaderboards are segmented by `question_limit`. Accuracy is only recorded past `MIN_ATTEMPTS_FOR_ACCURACY` (10) — a constant duplicated in `soloStorage.ts`.

**localStorage keys** (all reads defensively try/catch — private browsing must degrade, not crash): `fracciones:deviceId`, `fracciones:soloHighScore`, `fracciones:pendingScores`, `fracciones-vs-wins` (VS-mode win tally, `wins.ts`).

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

- No semicolons, single quotes, 2-space indent. Tailwind for styling.
- Tests are colocated (`foo.ts` + `foo.test.ts`), Vitest + Testing Library, jsdom, globals enabled (`src/test-setup.ts`). `vite.config.ts` skips the Cloudflare and PWA plugins under `VITEST` — don't remove that guard, the Worker environment breaks the Vitest pool.
- Comments here explain *why* a rule exists (product decisions about kids playing offline), not what the code does. Match that when adding non-obvious logic.
- `docs/superpowers/` holds the design specs and implementation plans this project was built from — useful background for feature work.
- The `README.md` is still the untouched Vite template and describes nothing about this project.
