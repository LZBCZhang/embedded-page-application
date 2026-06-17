import { useTranslation } from 'react-i18next';
import type { Purpose } from '../types/preferences.types';
import { PreferenceItem } from './PreferenceItem';
import styles from './PreferenceList.module.scss';

interface PreferenceListProps {
  purposes: Purpose[];
  isPreferenceConsented: (purposeId: string, prefId: string) => boolean;
  isAllUnsubscribed: (type: string) => boolean;
  onToggle: (purposeId: string, prefId: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function PreferenceList({
  purposes,
  isPreferenceConsented,
  isAllUnsubscribed,
  onToggle,
  onSave,
  isSaving,
}: PreferenceListProps) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('preferences.title')}>
      <ul className={styles.list} role="list">
        {purposes.map((purpose) => (
          <li key={purpose.id} role="listitem">
            <PreferenceItem
              purpose={purpose}
              isPreferenceConsented={isPreferenceConsented}
              isAllUnsubscribed={isAllUnsubscribed}
              onToggle={onToggle}
            />
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
