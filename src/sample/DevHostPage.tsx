import { PreferencesPageHost } from './PreferencesPageHost';

const IFRAME_ORIGIN = import.meta.env.VITE_EMBED_ORIGIN ?? 'http://localhost:5173';

const DEV_PROPS = {
  accessToken: 'dev-token-abc123',
  userId: 'user-dev-001',
  userEmail: 'dev@example.com',
  userPhone: '+1234567890',
  companyId: 'company-dev-001',
};

// Pass token via URL params so useEmbedToken can read them directly —
// this avoids the postMessage timing race that occurs during StrictMode
// double-mount when the iframe fully reloads on remount.
const devParams = new URLSearchParams({
  token: DEV_PROPS.accessToken,
  userId: DEV_PROPS.userId,
  userEmail: DEV_PROPS.userEmail,
  userPhone: DEV_PROPS.userPhone,
  companyId: DEV_PROPS.companyId,
}).toString();

export function DevHostPage() {
  return (
    <PreferencesPageHost
      {...DEV_PROPS}
      preferencesUrl={`${IFRAME_ORIGIN}/preferences?${devParams}`}
    />
  );
}