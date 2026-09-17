/**
 * Native DOM references captured at document_start, before any page script runs.
 *
 * Chrome gives each isolated world its own V8 context with its own prototype
 * chains, so a page script cannot actually reach the prototypes this content
 * script sees. This module is defense in depth: it keeps the guarantee intact
 * if any of this code ever moves to the MAIN world, where the page could patch
 * built-ins out from under us.
 */

const rawApply = Reflect.apply;

const rawAttachShadow = Element.prototype.attachShadow;
const rawCreateElement = Document.prototype.createElement;
const rawGetElementById = Document.prototype.getElementById;
const rawAppendChild = Node.prototype.appendChild;
const rawSetAttribute = Element.prototype.setAttribute;
const rawRemoveAttribute = Element.prototype.removeAttribute;
const rawAddEventListener = EventTarget.prototype.addEventListener;
const rawSetTextContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')!.set!;

export const RawMutationObserver = MutationObserver;

export function createElement<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
): HTMLElementTagNameMap[K] {
  return rawApply(rawCreateElement, doc, [tag]) as HTMLElementTagNameMap[K];
}

export function getElementById(doc: Document, id: string): HTMLElement | null {
  return rawApply(rawGetElementById, doc, [id]) as HTMLElement | null;
}

export function appendChild(parent: Node, child: Node): void {
  rawApply(rawAppendChild, parent, [child]);
}

export function setAttribute(el: Element, name: string, value: string): void {
  rawApply(rawSetAttribute, el, [name, value]);
}

export function removeAttribute(el: Element, name: string): void {
  rawApply(rawRemoveAttribute, el, [name]);
}

export function addEventListener(
  target: EventTarget,
  type: string,
  listener: (event: Event) => void,
  options?: AddEventListenerOptions,
): void {
  rawApply(rawAddEventListener, target, [type, listener, options]);
}

export function setTextContent(node: Node, text: string): void {
  rawApply(rawSetTextContent, node, [text]);
}

/** Attaches a closed shadow root; the returned handle never leaves this world. */
export function attachClosedShadow(host: Element): ShadowRoot {
  return rawApply(rawAttachShadow, host, [{ mode: 'closed' }]) as ShadowRoot;
}
