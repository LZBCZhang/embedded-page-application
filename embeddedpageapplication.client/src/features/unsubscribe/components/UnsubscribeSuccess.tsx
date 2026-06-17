import { useTranslation } from 'react-i18next';
import styles from './Unsubscribe.module.scss';

export function UnsubscribeSuccess() {
  const { t } = useTranslation();
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">✓</div>
      <h2 className={styles.stateTitle}>{t('unsubscribe.success')}</h2>
      <p className={styles.stateMsg}>{t('unsubscribe.successDescription')}</p>
    </div>
  );
}
