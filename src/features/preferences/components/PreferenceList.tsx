import { useTranslation } from 'react-i18next';
import type { ConsentPreference } from '../types/preferences.types';
import { PreferenceItem } from './PreferenceItem';
import styles from './PreferenceList.module.scss';

interface PreferenceListProps {
  preferences: ConsentPreference[];
  onToggle: (id: string, enabled: boolean) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function PreferenceList({
  preferences,
  onToggle,
  onSave,
  isSaving,
}: PreferenceListProps) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('preferences.title')}>
      <ul className={styles.list} role="list">
        {preferences.map((pref) => (
          <li key={pref.id} role="listitem">
            <PreferenceItem preference={pref} onToggle={onToggle} />
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={onSave}
          disabled={isSaving}
          aria-busy={isSaving}
          type="button"
        >
          {isSaving ? t('preferences.saving') : t('preferences.save')}
        </button>
      </div>
    </section>
  );
}
