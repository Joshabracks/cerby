import { describe, expect, it } from 'vitest';
import { toSiteKey } from './domain';

describe('toSiteKey', () => {
  it('strips subdomains', () => {
    expect(toSiteKey('https://drive.google.com/drive/my-drive')).toBe('google.com');
    expect(toSiteKey('https://www.google.com/something-else')).toBe('google.com');
    expect(toSiteKey('https://google.com')).toBe('google.com');
    expect(toSiteKey('https://a.b.c.example.com/x?y=1#z')).toBe('example.com');
  });

  it('handles bare hostnames without a scheme', () => {
    expect(toSiteKey('www.google.com/something-else')).toBe('google.com');
    expect(toSiteKey('drive.google.com')).toBe('google.com');
  });

  it('keeps two-part public suffixes intact', () => {
    expect(toSiteKey('https://www.bbc.co.uk/news')).toBe('bbc.co.uk');
    expect(toSiteKey('https://shop.company.com.au')).toBe('company.com.au');
  });

  it('normalizes case, ports, and trailing dots', () => {
    expect(toSiteKey('https://WWW.GitHub.COM/user')).toBe('github.com');
    expect(toSiteKey('localhost:3001')).toBe('localhost');
    expect(toSiteKey('https://example.com./')).toBe('example.com');
  });

  it('gives dotless hosts and IPs their own bucket', () => {
    expect(toSiteKey('http://localhost:3001/app')).toBe('localhost');
    expect(toSiteKey('http://127.0.0.1:8080/x')).toBe('127.0.0.1');
  });

  it('returns empty string for empty input', () => {
    expect(toSiteKey('')).toBe('');
  });
});
