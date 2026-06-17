import type { Purpose } from '../types/preferences.types';
import { PreferenceToggle } from './PreferenceToggle';
import styles from './PreferenceItem.module.scss';

interface PreferenceItemProps {
  purpose: Purpose;
  isPreferenceConsented: (purposeId: string, prefId: string) => boolean;
  isAllUnsubscribed: (type: string) => boolean;
  onToggle: (purposeId: string, prefId: string) => void;
}

export function PreferenceItem({ purpose, isPreferenceConsented, isAllUnsubscribed, onToggle }: PreferenceItemProps) {
  return (
    <article className={styles.item} aria-labelledby={`purpose-${purpose.id}`}>
      <div className={styles.header}>
        <h3 id={`purpose-${purpose.id}`} className={styles.label}>{purpose.label}</h3>
        {purpose.description && <p className={styles.description}>{purpose.description}</p>}
      </div>
      {purpose.communicationPreferences.length > 0 && (
        <ul className={styles.prefList} role="list">
          {purpose.communicationPreferences.map((pref) => (
            <li key={pref.id} className={styles.prefRow} role="listitem">
              <PreferenceToggle
                id={`${purpose.id}-${pref.id}`}
                label={pref.name}
                enabled={isPreferenceConsented(purpose.id, pref.id)}
                disabled={isAllUnsubscribed(pref.type)}
                onChange={() => onToggle(purpose.id, pref.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
