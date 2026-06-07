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

import { useCallback, useEffect, useRef, useState } from 'react';
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
  /** Override iframe src (used in dev/testing to pass token via URL params). */
  preferencesUrl?: string;
}

export function PreferencesPageHost({ accessToken, userId, userEmail, userPhone, companyId, preferencesUrl }: PreferencesPageHostProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedStatus, setEmbedStatus] = useState<EmbedStatus>('idle');
  const [embedError, setEmbedError] = useState<EmbedErrorPayload | null>(null);
  // Track whether AUTH_TOKEN has been acknowledged so we stop resending.
  const tokenSentRef = useRef(false);

  const sendToken = useCallback(() => {
    if (tokenSentRef.current) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'AUTH_TOKEN', token: accessToken, userId, userEmail, userPhone, companyId },
      IFRAME_ORIGIN,
    );
  }, [accessToken, userId, userEmail, userPhone, companyId]);

  // Listen for status events from the embedded page.
  // The iframe pings CONSENT_ENGINE_LOADING_START every 300 ms until it gets
  // AUTH_TOKEN back, so we reply on every ping — no race condition possible.
  useEffect(() => {
    tokenSentRef.current = false;

    const handleMessage = (event: MessageEvent<EmbedMessage>) => {
      if (event.origin !== IFRAME_ORIGIN) return;

      switch (event.data?.type) {
        case 'CONSENT_ENGINE_LOADING_START':
          setEmbedStatus('loading');
          sendToken();
          break;
        case 'CONSENT_ENGINE_LOADING_END':
          tokenSentRef.current = true;
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
  }, [sendToken]);

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
          src={preferencesUrl ?? PREFERENCES_URL}
          title="Communication Preferences"
          className={styles.iframe}
        />
      </div>
    </div>
  );
}