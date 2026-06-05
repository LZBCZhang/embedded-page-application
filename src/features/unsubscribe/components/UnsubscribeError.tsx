import { useTranslation } from 'react-i18next';
import styles from './Unsubscribe.module.scss';

interface UnsubscribeErrorProps {
  onRetry: () => void;
}

export function UnsubscribeError({ onRetry }: UnsubscribeErrorProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.state} role="alert">
      <div className={`${styles.icon} ${styles.iconError}`} aria-hidden="true">✕</div>
      <h2 className={styles.stateTitle}>{t('unsubscribe.errorTitle')}</h2>
      <p className={styles.stateMsg}>{t('unsubscribe.errorDescription')}</p>
      <button className={styles.retryBtn} onClick={onRetry} type="button">
        {t('error.retry')}
      </button>
    </div>
  );
}
