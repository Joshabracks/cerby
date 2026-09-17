export const ROOT_ID = 'cerby-root';

const STYLES = `
  :host { all: initial; }
  .stack {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
  button {
    font: 500 14px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 8px 16px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    background: #ffffff;
    color: #1a1a1a;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }
  button:hover { background: #f2f2f2; }
  button:active { transform: translateY(1px); }
  iframe {
    width: 360px;
    height: 480px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  }
  iframe[hidden] { display: none; }
`;

/** Creates the shadow-DOM host element containing the button and its panel iframe. */
export function createHost(doc: Document, panelUrl: string): HTMLElement {
  const host = doc.createElement('div');
  host.id = ROOT_ID;
  host.style.cssText = [
    'position: fixed',
    'top: 16px',
    'right: 16px',
    'z-index: 2147483647',
    'width: auto',
    'height: auto',
    'margin: 0',
    'padding: 0',
  ].join(';');

  const shadow = host.attachShadow({ mode: 'open' });
  const style = doc.createElement('style');
  style.textContent = STYLES;

  const stack = doc.createElement('div');
  stack.className = 'stack';

  const panel = doc.createElement('iframe');
  panel.src = panelUrl;
  panel.hidden = true;

  const button = doc.createElement('button');
  button.type = 'button';
  button.textContent = 'Open';
  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.textContent = panel.hidden ? 'Open' : 'Close';
  });

  stack.append(button, panel);
  shadow.append(style, stack);
  return host;
}

/** Idempotent: mounts the widget unless it is already present. */
export function mountWidget(doc: Document, panelUrl: string): void {
  if (!doc.body || doc.getElementById(ROOT_ID)) return;
  doc.body.appendChild(createHost(doc, panelUrl));
}
