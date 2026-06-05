/**
 * PreferencesPage — embedded mode only.
 *
 * PARENT-SIDE INTEGRATION EXAMPLE:
 * ---------------------------------
 * const iframe = document.getElementById('consent-iframe');
 * iframe.addEventListener('load', () => {
 *   iframe.contentWindow.postMessage(
 *     { type: 'AUTH_TOKEN', token: accessToken },
 *     'https://consent-engine.yourcompany.com'
 *   );
 * });
 *
 * window.addEventListener('message', (event) => {
 *   if (event.origin !== 'https://consent-engine.yourcompany.com') return;
 *   const { type, payload } = event.data;
 *   if (type === 'CONSENT_ENGINE_LOADING_START') showSpinner();
 *   if (type === 'CONSENT_ENGINE_LOADING_END')   hideSpinner();
 *   if (type === 'CONSENT_ENGINE_ERROR')          showError(payload);
 *   if (type === 'CONSENT_ENGINE_PREFERENCES_SAVED') showSuccess();
 * });
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmbedToken } from './hooks/useEmbedToken';
import { usePreferences } from './hooks/usePreferences';
import { useUpdatePreference } from './hooks/useUpdatePreference';
import { usePostMessageEmitter } from '../../hooks/usePostMessageEmitter';
import { EmbedErrorPage } from './components/EmbedErrorPage';
import { PreferenceList } from './components/PreferenceList';
import type { ConsentPreference } from './types/preferences.types';
import styles from './PreferencesPage.module.scss';

export function PreferencesPage() {
  const { t } = useTranslation();
  const { status, reason } = useEmbedToken();
  const { emitLoadingEnd, emitError, emitPreferencesSaved } = usePostMessageEmitter();

  const { data, isLoading, isError } = usePreferences(status === 'ready');
  const { mutate: updatePref, isPending: isSaving } = useUpdatePreference();

  const [localPrefs, setLocalPrefs] = useState<ConsentPreference[]>([]);

  useEffect(() => {
    if (data?.preferences) setLocalPrefs(data.preferences);
  }, [data]);

  useEffect(() => {
    if (data?.preferences) emitLoadingEnd();
  }, [data, emitLoadingEnd]);

  useEffect(() => {
    if (isError) emitError('api_failure');
  }, [isError, emitError]);

  const handleToggle = (id: string, enabled: boolean) => {
    setLocalPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled } : p))
    );
  };

  const handleSave = () => {
    localPrefs.forEach((pref) => {
      updatePref({ id: pref.id, enabled: pref.enabled });
    });
    emitPreferencesSaved();
  };

  if (status === 'error') {
    return <EmbedErrorPage reason={reason ?? undefined} />;
  }

  if (status === 'waiting' || isLoading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <p>{status === 'waiting' ? t('preferences.waitingToken') : t('preferences.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return <EmbedErrorPage reason="api_failure" />;
  }

  return (
    <main className={styles.page} aria-labelledby="preferences-title">
      <h1 id="preferences-title" className={styles.title}>
        {t('preferences.title')}
      </h1>
      <p className={styles.description}>{t('preferences.description')}</p>
      <PreferenceList
        preferences={localPrefs}
        onToggle={handleToggle}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </main>
  );
}
