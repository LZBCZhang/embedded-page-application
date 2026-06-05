import type { ConsentPreference } from '../types/preferences.types';
import { PreferenceToggle } from './PreferenceToggle';
import styles from './PreferenceItem.module.scss';

interface PreferenceItemProps {
  preference: ConsentPreference;
  onToggle: (id: string, enabled: boolean) => void;
}

export function PreferenceItem({ preference, onToggle }: PreferenceItemProps) {
  return (
    <article className={styles.item} aria-labelledby={`pref-${preference.id}`}>
      <div className={styles.content}>
        <h3 id={`pref-${preference.id}`} className={styles.label}>
          {preference.label}
        </h3>
        <p className={styles.description}>{preference.description}</p>
      </div>
      <PreferenceToggle
        id={preference.id}
        label={preference.label}
        enabled={preference.enabled}
        required={preference.required}
        onChange={(enabled) => onToggle(preference.id, enabled)}
      />
    </article>
  );
}
