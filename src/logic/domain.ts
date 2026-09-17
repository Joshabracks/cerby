/**
 * Two-part public suffixes we care about. Not exhaustive — a full answer needs
 * the Public Suffix List; this covers the common cases without a dependency.
 */
const MULTI_PART_SUFFIXES = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'me.uk',
  'com.au', 'net.au', 'org.au',
  'co.jp', 'co.kr', 'co.nz', 'co.za', 'co.in',
  'com.br', 'com.cn', 'com.mx', 'com.tr', 'com.sg', 'com.hk',
]);

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

/**
 * Reduces a URL or hostname to the registrable domain used as the storage key.
 * "https://drive.google.com/x" and "www.google.com/y" both become "google.com".
 * Hosts without a dot (localhost), IP literals, and unparseable input are
 * returned as-is so they still get their own bucket.
 */
export function toSiteKey(input: string): string {
  const raw = input.trim();
  let host = '';

  try {
    // "localhost:3001" parses as scheme "localhost:" with no hostname, so an
    // empty hostname means this wasn't really a URL.
    host = new URL(raw).hostname;
  } catch {
    host = '';
  }

  if (!host) {
    // Bare host — drop any scheme, path, or port that came along with it.
    host = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').split('/')[0].split(':')[0];
  }

  host = host.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (!host || IPV4.test(host) || !host.includes('.')) return host;

  const labels = host.split('.');
  const lastTwo = labels.slice(-2).join('.');
  const take = MULTI_PART_SUFFIXES.has(lastTwo) ? 3 : 2;
  return labels.slice(-take).join('.');
}
