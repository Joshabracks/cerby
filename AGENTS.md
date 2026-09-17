# AGENTS.md

## Situation
- Small-scope project, total time budget < 1 hour. Requirements arrive at session start.
- Speed over polish. Build only what the requirements ask for: no extra features, abstractions, or "nice to haves".
- Keep chat output short. Don't narrate or survey options. Recommend one approach and move on.

## Workflow (STOP for user approval at the end of every phase)
1. **Design**: Turn the requirements into a compact `DESIGN.md` (≤ 1 page): goal, requirements checklist,
   stack, file layout, core modules/functions with signatures, data shapes, test plan, open questions.
   Ask questions only when they block progress; otherwise state the assumption in DESIGN.md. → STOP.
2. **Shell**: Scaffold the project so it builds/runs with a placeholder (see Defaults). Confirm
   `npm start` (or equivalent) and `npm test` both run. → STOP.
3. **Tests**: Write Vitest unit tests for the CLI-testable logic listed in DESIGN.md (pure functions,
   parsing, state/transforms). Keep logic out of DOM code so it can be tested. Tests may fail at this point. → STOP.
4. **Build**: Implement until the tests pass (`npx vitest run`) and `npm run typecheck` is clean. Then wire up the UI. → STOP.
5. **Manual test/debug**:
   - Browser app: drive it with the Chrome DevTools MCP (navigate, snapshot, click/fill, check console
     messages for errors, take screenshots), fix issues, then hand off to the user.
   - Browser extension or non-browser app: skip Chrome MCP. The user tests manually and reports back.
     Fix each piece of feedback quickly and keep the loop tight.
   → STOP after each round.

## Defaults (unless requirements say otherwise)
- **Language**: TypeScript (strict). If another language is requested, use its most common minimal
  tooling and its standard test runner, with the same workflow.
- **UI**: Vanilla DOM + plain CSS. No UI framework.
- **Tests**: Vitest (`vitest run` for CI-style, `vitest` for watch). Tests live next to the code as `*.test.ts`.
- **Browser build**: webpack 5 + ts-loader (no Babel) + html-webpack-plugin + webpack-dev-server with `hot: true`.

### Browser shell reference
package.json scripts:

```json
"start": "webpack serve --mode development",
"build": "webpack --mode production",
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

devDependencies: `typescript`, `ts-loader`, `webpack`, `webpack-cli`, `webpack-dev-server`,
`html-webpack-plugin`, `vitest`

tsconfig.json: target ES2020, module ESNext, moduleResolution bundler, lib [ES2020, DOM, DOM.Iterable],
strict, isolatedModules, esModuleInterop, skipLibCheck, sourceMap, include ["src"].

webpack.config.js: entry `./src/index.ts`, output `dist` (clean), resolve `.ts/.js`,
rule `/\.tsx?$/` → ts-loader (exclude node_modules), HtmlWebpackPlugin template `./src/index.html`,
devtool `eval-source-map` (dev) / `source-map` (prod), devServer `{ port: 3001, hot: true, open: true }`.

Layout:

```
src/index.html        page template
src/index.ts          DOM wiring only
src/logic/*.ts        pure logic (unit tested)
src/**/*.test.ts      Vitest tests
```

## Rules
- **Git**: The user makes all commits. Don't commit, stage, stash, reset, checkout, or otherwise change
  git state. Only use read-only git (`git status`, `git diff`, `git log`, `git show`) to compare against earlier checkpoints.
- Run the dev server in the background. Don't block on it.
- Keep DESIGN.md current if scope changes mid-build (one-line edits).
- Environment: Windows, with PowerShell and Git Bash both available.

## Optional SQL (Docker)
Use only if a requirement needs a database. Do not add a DB otherwise.

Container: `cerby-mysql` (MySQL 8, `localhost:3306`). DB `cerby`. User `cerby` / `dev` (root password `dev`).

```powershell
docker start cerby-mysql
docker stop cerby-mysql
```
