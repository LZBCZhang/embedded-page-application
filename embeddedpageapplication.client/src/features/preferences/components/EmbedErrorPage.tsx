import { useTranslation } from 'react-i18next';
import type { EmbedErrorReason } from '../../../types';
import styles from './EmbedErrorPage.module.scss';

interface EmbedErrorPageProps {
  reason?: EmbedErrorReason;
  correlationId?: string;
}

function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function EmbedErrorPage({ reason, correlationId }: EmbedErrorPageProps) {
  const { t } = useTranslation();
  const refId = correlationId ?? generateShortId();

  const handleRetry = () => window.location.reload();

  return (
    <main className={styles.errorPage} role="main" aria-labelledby="error-title">
      <div className={styles.icon} aria-hidden="true">⚠</div>

      <h1 id="error-title" className={styles.title}>
        {t('error.title')}
      </h1>

      <p className={styles.message}>
        {t('error.message')}
        {reason === 'no_token' && (
          <> {/* additional context for screen readers */}
            <span className="sr-only"> Reason: authentication token not received.</span>
          </>
        )}
      </p>

      <p className={styles.reference}>
        {t('error.reference')}: <span>{refId}</span>
      </p>

      <button
        className={styles.retryButton}
        onClick={handleRetry}
        type="button"
        aria-label={t('error.retry')}
      >
        {t('error.retry')}
      </button>
    </main>
  );
}
