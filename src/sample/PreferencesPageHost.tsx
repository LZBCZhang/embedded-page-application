/**
 * PreferencesPageHost — sample host page that embeds PreferencesPage inside an iframe.
 *
 * Communication protocol:
 *   Parent → iframe : { type: 'AUTH_TOKEN', token: string }
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
  /** A valid bearer token for the currently authenticated user. */
  accessToken: string;
}

export function PreferencesPageHost({ accessToken }: PreferencesPageHostProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedStatus, setEmbedStatus] = useState<EmbedStatus>('idle');
  const [embedError, setEmbedError] = useState<EmbedErrorPayload | null>(null);

  // Send the auth token once the iframe has fully loaded.
  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'AUTH_TOKEN', token: accessToken },
      IFRAME_ORIGIN,
    );
  };

  // Listen for status events emitted by the embedded page.
  useEffect(() => {
    const handleMessage = (event: MessageEvent<EmbedMessage>) => {
      if (event.origin !== IFRAME_ORIGIN) return;

      switch (event.data?.type) {
        case 'CONSENT_ENGINE_LOADING_START':
          setEmbedStatus('loading');
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
  }, []);

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
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
}