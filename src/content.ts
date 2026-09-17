import { mountWidget } from './logic/widget';
import { watchNavigation } from './logic/navigation';
import { toSiteKey } from './logic/domain';

// The panel is an extension page with its own origin, so it cannot read the
// host page's URL. Hand it the site key on the query string instead.
const PANEL_URL = `${chrome.runtime.getURL('panel.html')}?site=${encodeURIComponent(
  toSiteKey(location.href),
)}`;

function mount(): void {
  mountWidget(document, PANEL_URL);
}

mount();
watchNavigation(mount);
