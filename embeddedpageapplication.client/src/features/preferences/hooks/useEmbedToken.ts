import { useEffect, useRef, useState } from 'react';
import type { EmbedErrorReason, EmbedTokenStatus } from '../../../types';
import { usePostMessageEmitter } from '../../../hooks/usePostMessageEmitter';

const TOKEN_TIMEOUT_MS = 5000;

const getAllowedOrigins = (): string[] => {
  const raw = import.meta.env.VITE_ALLOWED_PARENT_ORIGINS ?? '';
  return raw.split(',').map((o: string) => o.trim()).filter(Boolean);
};

// Dev-only: read token/userId/etc. from URL search params so DevHostPage can
// inject them directly into the iframe src — bypasses postMessage timing issues.
const readUrlParams = () => {
  if (!import.meta.env.DEV) return null;
  const p = new URLSearchParams(window.location.search);
  const token = p.get('token');
  const userId = p.get('userId');
  if (!token || !userId) return null;
  return {
    token,
    userId,
    userEmail: p.get('userEmail'),
    userPhone: p.get('userPhone'),
    companyId: p.get('companyId'),
  };
};

interface EmbedTokenMessage {
  type?: string;
  token?: string;
  userId?: string;
  userEmail?: string;
  userPhone?: string;
  companyId?: string;
}

interface UseEmbedTokenResult {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  userPhone: string | null;
  companyId: string | null;
  status: EmbedTokenStatus;
  reason: EmbedErrorReason | null;
}

export function useEmbedToken(): UseEmbedTokenResult {
  // Captured once at mount; stable for the component's lifetime.
  const urlData = useRef(readUrlParams()).current;

  const [token, setToken] = useState<string | null>(urlData?.token ?? null);
  const [userId, setUserId] = useState<string | null>(urlData?.userId ?? null);
  const [userEmail, setUserEmail] = useState<string | null>(urlData?.userEmail ?? null);
  const [userPhone, setUserPhone] = useState<string | null>(urlData?.userPhone ?? null);
  const [companyId, setCompanyId] = useState<string | null>(urlData?.companyId ?? null);
  const [status, setStatus] = useState<EmbedTokenStatus>(urlData ? 'ready' : 'waiting');
  const [reason, setReason] = useState<EmbedErrorReason | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { emitLoadingStart, emitError } = usePostMessageEmitter();

  useEffect(() => {

    // URL-param path: token already available, skip the postMessage handshake.
    if (urlData) return;

    emitLoadingStart();
    const pingInterval = setInterval(emitLoadingStart, 300);

    const allowedOrigins = getAllowedOrigins();

    const handleMessage = (event: MessageEvent) => {
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(event.origin)) return;

      const data = event.data as EmbedTokenMessage;
      if (data?.type === 'AUTH_TOKEN' && typeof data.token === 'string' && typeof data.userId === 'string') {
        clearInterval(pingInterval);
        if (timerRef.current) clearTimeout(timerRef.current);
        setToken(data.token);
        setUserId(data.userId);
        setUserEmail(data.userEmail ?? null);
        setUserPhone(data.userPhone ?? null);
        setCompanyId(data.companyId ?? null);
        setStatus('ready');
      }
    };

    window.addEventListener('message', handleMessage);

    timerRef.current = setTimeout(() => {
      clearInterval(pingInterval);
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
      clearInterval(pingInterval);
      window.removeEventListener('message', handleMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [emitLoadingStart, emitError, urlData]);

  return { token, userId, userEmail, userPhone, companyId, status, reason };
}