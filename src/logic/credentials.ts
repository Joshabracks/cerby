export interface Credentials {
  username: string;
  password: string;
  savedAt: number;
}

const PREFIX = 'site:';

export function storageKey(site: string): string {
  return `${PREFIX}${site}`;
}

/** Returns the stored credentials for a site key, or null if none are saved. */
export async function loadCredentials(site: string): Promise<Credentials | null> {
  if (!site) return null;
  const key = storageKey(site);
  const stored = await chrome.storage.local.get(key);
  const value = stored[key] as Partial<Credentials> | undefined;
  if (!value || typeof value.username !== 'string' || typeof value.password !== 'string') {
    return null;
  }
  return {
    username: value.username,
    password: value.password,
    savedAt: typeof value.savedAt === 'number' ? value.savedAt : 0,
  };
}

// [NOTE]: Given extra time I would be encrypting these credentials so that, if there were any chance of them being retrieved by outside sources, they wouldn't be worth much
/** Writes credentials for a site key, replacing anything already there. */
export async function saveCredentials(
  site: string,
  username: string,
  password: string,
): Promise<Credentials> {
  const record: Credentials = { username, password, savedAt: Date.now() };
  await chrome.storage.local.set({ [storageKey(site)]: record });
  return record;
}
