import { useTranslation } from 'react-i18next';
import { usePreferences } from './hooks/usePreferences';
import { EmbedErrorPage } from './components/EmbedErrorPage';
import { PreferenceList } from './components/PreferenceList';
import { PreferenceToggle } from './components/PreferenceToggle';
import styles from './PreferencesPage.module.scss';

export function PreferencesPage() {
  const { t } = useTranslation();
  const {
    purposes,
    allCommPrefTypes,
    loading,
    saving,
    loadError,
    saveSuccess,
    saveError,
    savePreferences,
    isPreferenceConsented,
    isAllUnsubscribed,
    togglePreference,
    toggleUnsubscribeAll,
    embedStatus,
    embedReason,
    successMessage,
    saveErrorMessage,
  } = usePreferences();

  if (embedStatus === 'error') {
    return <EmbedErrorPage reason={embedReason ?? undefined} />;
  }

  if (embedStatus === 'waiting' || loading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <p>{embedStatus === 'waiting' ? t('preferences.waitingToken') : t('preferences.loading')}</p>
      </div>
    );
  }

  if (loadError) {
    return <EmbedErrorPage reason="api_failure" />;
  }

  return (
    <main className={styles.page} aria-labelledby="preferences-title">
      <h1 id="preferences-title" className={styles.title}>
        {t('preferences.title')}
      </h1>
      <p className={styles.description}>{t('preferences.description')}</p>

      {saveSuccess && (
        <p className={styles.successBanner} role="status">{successMessage}</p>
      )}
      {saveError && (
        <p className={styles.errorBanner} role="alert">{saveErrorMessage}</p>
      )}

      {allCommPrefTypes.length > 0 && (
        <section className={styles.globalSection} aria-label={t('preferences.globalSection')}>
          <h2 className={styles.globalTitle}>{t('preferences.globalSection')}</h2>
          {allCommPrefTypes.map((commType) => (
            <div key={commType.type} className={styles.globalRow}>
              <PreferenceToggle
                id={`global-${commType.type}`}
                label={commType.name}
                enabled={!isAllUnsubscribed(commType.type)}
                onChange={() => toggleUnsubscribeAll(commType.type)}
              />
            </div>
          ))}
        </section>
      )}

      <PreferenceList
        purposes={purposes}
        isPreferenceConsented={isPreferenceConsented}
        isAllUnsubscribed={isAllUnsubscribed}
        onToggle={togglePreference}
        onSave={savePreferences}
        isSaving={saving}
      />
    </main>
  );
}