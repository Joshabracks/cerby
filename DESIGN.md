# DESIGN.md

## Goal
Chrome extension (MV3) that injects an "Open" button into the top-right corner of every site after navigation.

## Requirements
- [ ] MV3 extension, loadable unpacked
- [ ] Content script runs on all URLs
- [ ] Injects a fixed-position button, top-right, labeled "Open"
- [ ] Survives SPA navigation (re-injects if removed / URL changes)
- [ ] Click toggles an extension-hosted iframe panel containing a login form
- [ ] Submit saves credentials to `chrome.storage.local`, keyed by registrable domain
- [ ] Returning to a known site pre-fills the form

## Stack
TypeScript (strict) + webpack 5 + ts-loader. No UI framework. No tests this pass (per request).

## File layout
```
src/manifest.json      MV3 manifest (declares panel.html web-accessible)
src/panel.html          iframe document: login form
src/panel.ts            panel wiring: prefill + save
src/content.ts          content script entry: mount + navigation watch
src/logic/widget.ts     DOM builder: button + panel iframe
src/logic/domain.ts     toSiteKey (unit tested)
src/logic/credentials.ts chrome.storage.local read/write
webpack.config.js       entries content + panel, copies manifest + panel.html
```

## Core functions
- `createHost(doc, panelUrl): HTMLElement` — `#cerby-root` host div, shadow root, scoped CSS, button + hidden iframe.
- `mountWidget(doc, panelUrl): void` — idempotent; no-op if `#cerby-root` present.
- `toSiteKey(url): string` — registrable domain; `drive.google.com` → `google.com`. Small hardcoded
  two-part-suffix list (`co.uk` etc.), no Public Suffix List dependency.
- `loadCredentials(site)` / `saveCredentials(site, username, password)` — `site:<domain>` keys in `chrome.storage.local`.

## Data shape
`chrome.storage.local["site:google.com"] = { username, password, savedAt }`

## Notes
- The panel is an extension page with its own origin, so it cannot read the host URL. The content
  script computes the site key and passes it as `?site=` on the iframe src.
- Passwords are stored in plaintext in `chrome.storage.local`. Fine for a prototype, not for real use.

## Isolation model
- **INVARIANT: no credential enters the content script.** Secrets live only in the panel iframe,
  a separate origin the page cannot read. The content script only computes the site key.
- Closed shadow root; the handle stays in a module closure, so `#cerby-root.shadowRoot` is null to the page.
- `run_at: document_start`, `world: ISOLATED`. Natives are cached in `logic/natives.ts` before page
  scripts run (defense in depth — isolated worlds already have their own prototype chains).
- `use_dynamic_url: true` on web-accessible resources: the URL is a per-session UUID, so sites
  cannot fingerprint the extension or pre-target a fixed ID.
- Known residual risk: the page can still remove, move, or overlay the host element (clickjacking).
  Only an action popup avoids that.
- `watchNavigation(cb: () => void): void` — patches `pushState`/`replaceState`, listens `popstate`, plus a MutationObserver fallback.

## Assumptions
- Shadow DOM used for style isolation from host page.
- `z-index: 2147483647`, `position: fixed`, `top/right: 16px`.
- No `activeTab`/host permissions beyond `<all_urls>` content script matches; no background worker yet.

## Test plan
Manual: `npm run build`, load `dist/` unpacked, visit a few sites, confirm button appears. Tests deferred.
