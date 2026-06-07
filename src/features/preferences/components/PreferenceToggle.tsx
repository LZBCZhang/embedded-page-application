import styles from './PreferenceToggle.module.scss';

interface PreferenceToggleProps {
  id: string;
  label: string;
  enabled: boolean;
  disabled?: boolean;
  onChange: () => void;
}

export function PreferenceToggle({ id, label, enabled, disabled = false, onChange }: PreferenceToggleProps) {
  return (
    <div className={styles.toggle}>
      <label className={styles.switch}>
        <input
          id={id}
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={() => onChange()}
          aria-label={label}
        />
        <span className={styles.slider} aria-hidden="true" />
      </label>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
