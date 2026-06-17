import { useTranslation } from 'react-i18next';
import styles from './Unsubscribe.module.scss';

interface UnsubscribeFormProps {
  email: string;
  isPending: boolean;
  isInvalidLink: boolean;
  onConfirm: () => void;
}

export function UnsubscribeForm({
  email,
  isPending,
  isInvalidLink,
  onConfirm,
}: UnsubscribeFormProps) {
  const { t } = useTranslation();

  if (isInvalidLink) {
    return (
      <div className={styles.state} role="alert">
        <p className={styles.stateMsg}>{t('unsubscribe.invalidLink')}</p>
      </div>
    );
  }

  return (
    <div className={styles.form}>
      <p className={styles.description}>
        {t('unsubscribe.description')} <strong>{email}</strong>
      </p>
      <button
        className={styles.confirmBtn}
        onClick={onConfirm}
        disabled={isPending}
        aria-busy={isPending}
        type="button"
      >
        {isPending ? t('unsubscribe.loading') : t('unsubscribe.confirm')}
      </button>
    </div>
  );
}
