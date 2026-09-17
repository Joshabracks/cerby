import { mountWidget } from './logic/widget';
import { watchNavigation, whenBodyReady } from './logic/navigation';
import { toSiteKey } from './logic/domain';

// INVARIANT: no credential ever enters this file. The content script shares a
// DOM with the host page, so anything it holds or renders is within the page's
// reach. Secrets live only inside the panel iframe, which is a separate origin
// the page cannot read. Do not "just pass the password through" here.

// The panel is an extension page with its own origin, so it cannot read the
// host page's URL. Hand it the site key on the query string instead.
const PANEL_URL = `${chrome.runtime.getURL('panel.html')}?site=${encodeURIComponent(
  toSiteKey(location.href),
)}`;

function mount(): void {
  mountWidget(document, PANEL_URL);
}

whenBodyReady(() => {
  mount();
  watchNavigation(mount);
});
