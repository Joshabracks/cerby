import {
  addEventListener,
  appendChild,
  attachClosedShadow,
  createElement,
  getElementById,
  removeAttribute,
  setAttribute,
  setTextContent,
} from './natives';

export const ROOT_ID = 'cerby-root';

const HOST_STYLE = [
  'position: fixed',
  'top: 16px',
  'right: 16px',
  'z-index: 2147483647',
  'width: auto',
  'height: auto',
  'margin: 0',
  'padding: 0',
].join(';');

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

/**
 * Creates the host element. The shadow root is closed and its handle stays in
 * this closure, so the page cannot reach the button or the panel iframe through
 * `.shadowRoot`. Only the empty host div is visible in the light DOM.
 */
export function createHost(doc: Document, panelUrl: string): HTMLElement {
  const host = createElement(doc, 'div');
  setAttribute(host, 'id', ROOT_ID);
  setAttribute(host, 'style', HOST_STYLE);

  const shadow = attachClosedShadow(host);

  const style = createElement(doc, 'style');
  setTextContent(style, STYLES);

  const stack = createElement(doc, 'div');
  setAttribute(stack, 'class', 'stack');

  const panel = createElement(doc, 'iframe');
  setAttribute(panel, 'src', panelUrl);
  setAttribute(panel, 'hidden', '');

  const button = createElement(doc, 'button');
  setAttribute(button, 'type', 'button');
  setTextContent(button, 'Open');

  let open = false;
  addEventListener(button, 'click', () => {
    open = !open;
    if (open) removeAttribute(panel, 'hidden');
    else setAttribute(panel, 'hidden', '');
    setTextContent(button, open ? 'Close' : 'Open');
  });

  appendChild(stack, button);
  appendChild(stack, panel);
  appendChild(shadow, style);
  appendChild(shadow, stack);
  return host;
}

/** Idempotent: mounts the widget unless it is already present. */
export function mountWidget(doc: Document, panelUrl: string): void {
  if (!doc.body || getElementById(doc, ROOT_ID)) return;
  appendChild(doc.body, createHost(doc, panelUrl));
}
