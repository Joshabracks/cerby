import { RawMutationObserver, addEventListener } from './natives';

/**
 * Runs `cb` once `document.body` exists. At document_start the body has not
 * been parsed yet, so everything that touches it has to wait.
 */
export function whenBodyReady(cb: () => void): void {
  if (document.body) {
    cb();
    return;
  }
  addEventListener(document, 'DOMContentLoaded', () => cb(), { once: true });
}

/**
 * Calls `cb` after navigations and whenever the page mutates enough to have
 * dropped our node.
 *
 * Note: monkey-patching history.pushState would be pointless here — the page's
 * History object lives in its own world, so our patch would only ever see our
 * own calls. Events do cross worlds, and the observer catches SPA re-renders.
 */
export function watchNavigation(cb: () => void): void {
  addEventListener(window, 'popstate', () => cb());
  addEventListener(window, 'pageshow', () => cb());

  const observer = new RawMutationObserver(() => cb());
  observer.observe(document.body, { childList: true });
}
