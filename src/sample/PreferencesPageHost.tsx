/**
 * PreferencesPageHost — sample host page that embeds PreferencesPage inside an iframe.
 *
 * Communication protocol:
 *   Parent → iframe : { type: 'AUTH_TOKEN', token: string, userId: string,
 *                       userEmail?: string, userPhone?: string, companyId?: string }
 *   iframe → Parent : { type: 'CONSENT_ENGINE_LOADING_START' }
 *                     { type: 'CONSENT_ENGINE_LOADING_END' }
 *                     { type: 'CONSENT_ENGINE_ERROR', payload: { code, message, status? } }
 *                     { type: 'CONSENT_ENGINE_PREFERENCES_SAVED' }
 */

import { useEffect, useRef, useState } from 'react';
import styles from './PreferencesPageHost.module.scss';

const IFRAME_ORIGIN = import.meta.env.VITE_EMBED_ORIGIN ?? 'http://localhost:5173';
const PREFERENCES_URL = `${IFRAME_ORIGIN}/preferences`;

type EmbedStatus = 'idle' | 'loading' | 'ready' | 'error' | 'saved';

interface EmbedErrorPayload {
  code: 'NO_TOKEN' | 'TOKEN_INVALID' | 'API_FAILURE';
  message: string;
  status?: number;
}

interface EmbedMessage {
  type: string;
  payload?: EmbedErrorPayload;
}

interface PreferencesPageHostProps {
  /** Bearer token for the authenticated user (required). */
  accessToken: string;
  /** User identifier (required). */
  userId: string;
  /** User email address (optional — stored in additionalInfo). */
  userEmail?: string;
  /** User phone number (optional — stored in additionalInfo). */
  userPhone?: string;
  /** Company identifier (optional — stored in additionalInfo). */
  companyId?: string;
}

export function PreferencesPageHost({ accessToken, userId, userEmail, userPhone, companyId }: PreferencesPageHostProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedStatus, setEmbedStatus] = useState<EmbedStatus>('idle');
  const [embedError, setEmbedError] = useState<EmbedErrorPayload | null>(null);

  const sendToken = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'AUTH_TOKEN', token: accessToken, userId, userEmail, userPhone, companyId },
      IFRAME_ORIGIN,
    );
  };

  // Listen for status events from the embedded page.
  // CONSENT_ENGINE_LOADING_START is the iframe's signal that its listener is
  // mounted — respond immediately with the token to avoid the race condition
  // where onLoad fires before the React app inside the iframe has initialised.
  useEffect(() => {
    const handleMessage = (event: MessageEvent<EmbedMessage>) => {
      if (event.origin !== IFRAME_ORIGIN) return;

      switch (event.data?.type) {
        case 'CONSENT_ENGINE_LOADING_START':
          setEmbedStatus('loading');
          sendToken();
          break;
        case 'CONSENT_ENGINE_LOADING_END':
          setEmbedStatus('ready');
          break;
        case 'CONSENT_ENGINE_ERROR':
          setEmbedStatus('error');
          setEmbedError(event.data.payload ?? null);
          break;
        case 'CONSENT_ENGINE_PREFERENCES_SAVED':
          setEmbedStatus('saved');
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [accessToken, userId, userEmail, userPhone, companyId]);

  return (
    <div className={styles.host}>
      <h2 className={styles.heading}>Communication Preferences</h2>

      {embedStatus === 'saved' && (
        <p className={styles.successBanner} role="status">
          Preferences saved successfully.
        </p>
      )}

      {embedStatus === 'error' && embedError && (
        <p className={styles.errorBanner} role="alert">
          {embedError.message} (code: {embedError.code})
        </p>
      )}

      <div className={styles.iframeWrapper} aria-busy={embedStatus === 'loading'}>
        <iframe
          ref={iframeRef}
          src={PREFERENCES_URL}
          title="Communication Preferences"
          className={styles.iframe}
        />
      </div>
    </div>
  );
}