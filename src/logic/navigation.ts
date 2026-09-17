/**
 * Calls `cb` after every navigation, including SPA history changes,
 * and whenever the page mutates enough to have dropped our node.
 */
export function watchNavigation(cb: () => void): void {
  const history = window.history;
  const fire = () => setTimeout(cb, 0);

  for (const name of ['pushState', 'replaceState'] as const) {
    const original = history[name];
    history[name] = function (this: History, ...args: Parameters<History['pushState']>) {
      const result = original.apply(this, args);
      fire();
      return result;
    };
  }

  window.addEventListener('popstate', fire);
  window.addEventListener('pageshow', fire);

  const observer = new MutationObserver(() => cb());
  const start = () => observer.observe(document.body, { childList: true });
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
}
