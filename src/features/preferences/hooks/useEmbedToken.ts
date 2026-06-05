import { useEffect, useRef, useState } from 'react';
import type { EmbedErrorReason, EmbedTokenStatus } from '../../../types';
import { usePostMessageEmitter } from '../../../hooks/usePostMessageEmitter';

const TOKEN_TIMEOUT_MS = 5000;

const getAllowedOrigins = (): string[] => {
  const raw = import.meta.env.VITE_ALLOWED_PARENT_ORIGINS ?? '';
  return raw
    .split(',')
    .map((o: string) => o.trim())
    .filter(Boolean);
};

interface UseEmbedTokenResult {
  token: string | null;
  status: EmbedTokenStatus;
  reason: EmbedErrorReason | null;
}

export function useEmbedToken(): UseEmbedTokenResult {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<EmbedTokenStatus>('waiting');
  const [reason, setReason] = useState<EmbedErrorReason | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { emitLoadingStart, emitError } = usePostMessageEmitter();

  useEffect(() => {
    emitLoadingStart();

    const allowedOrigins = getAllowedOrigins();

    const handleMessage = (event: MessageEvent) => {
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(event.origin)) {
        return; // silently ignore unknown origins
      }

      const data = event.data as { type?: string; token?: string };
      if (data?.type === 'AUTH_TOKEN' && typeof data.token === 'string') {
        if (timerRef.current) clearTimeout(timerRef.current);
        setToken(data.token);
        setStatus('ready');
      }
    };

    window.addEventListener('message', handleMessage);

    timerRef.current = setTimeout(() => {
      setStatus((prev) => {
        if (prev === 'waiting') {
          setReason('no_token');
          emitError('no_token');
          return 'error';
        }
        return prev;
      });
    }, TOKEN_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [emitLoadingStart, emitError]);

  return { token, status, reason };
}
