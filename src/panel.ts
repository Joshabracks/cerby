import { loadCredentials, saveCredentials } from './logic/credentials';

const site = new URLSearchParams(location.search).get('site') ?? '';

const form = document.getElementById('login-form') as HTMLFormElement;
const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const status = document.getElementById('status') as HTMLParagraphElement;
const siteLabel = document.getElementById('site') as HTMLElement;

function setStatus(message: string, tone: 'ok' | 'error' = 'ok'): void {
  status.textContent = message;
  status.className = `status ${tone}`;
}

siteLabel.textContent = site || 'this page';

void (async () => {
  const saved = await loadCredentials(site);
  if (!saved) return;
  email.value = saved.username;
  password.value = saved.password;
  setStatus('Saved credentials loaded.');
})();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!site) {
    setStatus('No site detected for this page.', 'error');
    return;
  }
  if (!email.value || !password.value) {
    setStatus('Enter both an email and a password.', 'error');
    return;
  }

  void saveCredentials(site, email.value, password.value)
    .then(() => setStatus(`Saved for ${site}.`))
    .catch((error: unknown) => {
      setStatus('Could not save credentials.', 'error');
      console.error('[cerby] save failed', error);
    });
});
