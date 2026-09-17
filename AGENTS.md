# AGENTS.md

## Situation
- Small-scope project, total time budget < 1 hour. Requirements arrive at session start.
- Deliverable is a **Chrome extension** (Manifest V3). Build only what the requirements ask for: no extra features, abstractions, or "nice to haves".
- Keep chat output short. Don't narrate or survey options. Recommend one approach and move on.

## Workflow (STOP for user approval at the end of every phase)
1. **Design**: Turn the requirements into a compact `DESIGN.md` (≤ 1 page): goal, requirements checklist,
   stack, file layout (popup / background / content scripts as needed), core modules/functions with
   signatures, data shapes, permissions, open questions.
   Ask questions only when they block progress; otherwise state the assumption in DESIGN.md. → STOP.
2. **Shell**: Scaffold the extension so it builds with a placeholder (see Defaults). Confirm `npm start`
   (watch build) runs, `npm run typecheck` is clean, and that `dist/` is loadable as an unpacked
   extension. → STOP.
3. **Build**: Implement the extension. Keep `npm run typecheck` clean. Wire popup/background/content
   UI and Chrome APIs. → STOP.
4. **Manual test/debug**: Do not use Chrome DevTools MCP. The user loads `dist/` as an unpacked
   extension and reports back. Fix each piece of feedback quickly and keep the loop tight.
   → STOP after each round.

## Defaults (unless requirements say otherwise)
- **Language**: TypeScript (strict). If another language is requested, use its most common minimal
  tooling with the same workflow.
- **UI**: Vanilla DOM + plain CSS. No UI framework.
- **Extension build**: webpack 5 + ts-loader (no Babel) + html-webpack-plugin + copy-webpack-plugin.
  Watch mode for rebuilds; no webpack-dev-server.

### Extension shell reference
package.json scripts:

```json
"start": "webpack --mode development --watch",
"build": "webpack --mode production",
"typecheck": "tsc --noEmit"
```

devDependencies: `typescript`, `ts-loader`, `webpack`, `webpack-cli`, `html-webpack-plugin`,
`copy-webpack-plugin`

tsconfig.json: target ES2020, module ESNext, moduleResolution bundler, lib [ES2020, DOM, DOM.Iterable],
strict, isolatedModules, esModuleInterop, skipLibCheck, sourceMap, include ["src"].

webpack.config.js: multiple entries as needed (`popup`, `background`, `content`), output `dist` (clean),
resolve `.ts/.js`, rule `/\.tsx?$/` → ts-loader (exclude node_modules), HtmlWebpackPlugin for popup
HTML, CopyWebpackPlugin for `manifest.json` (and static assets),
devtool `eval-source-map` (dev) / `source-map` (prod). Background/service worker and content scripts
must be bundled as separate files named to match the manifest.

Layout (include only the surfaces the requirements need):

```
src/manifest.json     Manifest V3 (copied to dist)
src/popup.html        popup template
src/popup.ts          popup DOM wiring only
src/background.ts     service worker
src/content.ts        content script (if required)
src/logic/*.ts        shared logic
```

Load unpacked: Chrome → Extensions → Developer mode → Load unpacked → select `dist/`.

## Rules
- **Git**: The user makes all commits. Don't commit, stage, stash, reset, checkout, or otherwise change
  git state. Only use read-only git (`git status`, `git diff`, `git log`, `git show`) to compare against earlier checkpoints.
- Run webpack watch in the background. Don't block on it.
- Keep DESIGN.md current if scope changes mid-build (one-line edits).
- Environment: Windows, with PowerShell and Git Bash both available.
- Never use Chrome DevTools MCP (or any browser MCP) to drive or verify the extension.
