import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUnsubscribe } from './hooks/useUnsubscribe';
import { UnsubscribeForm } from './components/UnsubscribeForm';
import { UnsubscribeSuccess } from './components/UnsubscribeSuccess';
import { UnsubscribeError } from './components/UnsubscribeError';
import styles from './components/Unsubscribe.module.scss';

export function UnsubscribePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { mutate, isPending, isSuccess, isError, reset } = useUnsubscribe();

  const token = searchParams.get('token') ?? '';
  const consentId = searchParams.get('consentId') ?? '';
  const email = searchParams.get('email') ?? '';
  const isInvalidLink = !token || !consentId || !email;

  useEffect(() => {
    if (!isInvalidLink) {
      mutate({ token, consentId, email });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = () => mutate({ token, consentId, email });

  return (
    <main className={styles.page} aria-labelledby="unsubscribe-title">
      <h1 id="unsubscribe-title" className={styles.title}>
        {t('unsubscribe.title')}
      </h1>

      {isSuccess && <UnsubscribeSuccess />}

      {isError && <UnsubscribeError onRetry={() => { reset(); handleConfirm(); }} />}

      {!isSuccess && !isError && (
        <UnsubscribeForm
          email={email}
          isPending={isPending}
          isInvalidLink={isInvalidLink}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  );
}
