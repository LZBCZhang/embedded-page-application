import { useTranslation } from 'react-i18next';
import styles from './PreferenceToggle.module.scss';

interface PreferenceToggleProps {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean;
  onChange: (enabled: boolean) => void;
}

export function PreferenceToggle({
  id,
  label,
  enabled,
  required,
  onChange,
}: PreferenceToggleProps) {
  const { t } = useTranslation();
  const inputId = `toggle-${id}`;

  return (
    <div className={styles.toggle}>
      <label className={styles.switch}>
        <input
          id={inputId}
          type="checkbox"
          checked={enabled}
          disabled={required}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
        />
        <span className={styles.slider} aria-hidden="true" />
      </label>
      <span className={styles.label} id={`${inputId}-label`}>
        {label}
        {required && (
          <span className={styles.required} aria-label="required">
            ({t('preferences.enabled')})
          </span>
        )}
      </span>
    </div>
  );
}
