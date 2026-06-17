import { useCallback } from 'react';
import type { EmbedErrorReason } from '../types';

type EventType =
  | 'CONSENT_ENGINE_LOADING_START'
  | 'CONSENT_ENGINE_LOADING_END'
  | 'CONSENT_ENGINE_ERROR'
  | 'CONSENT_ENGINE_PREFERENCES_SAVED';

interface ErrorPayload {
  code: 'NO_TOKEN' | 'TOKEN_INVALID' | 'API_FAILURE';
  message: string;
  status?: number;
}

// TODO: restrict targetOrigin to known origins before production
const TARGET_ORIGIN = '*';

export function emitToParent(type: EventType, payload?: ErrorPayload): void {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type, payload }, TARGET_ORIGIN);
  }
}

export function usePostMessageEmitter() {
  const emitLoadingStart = useCallback(() => {
    emitToParent('CONSENT_ENGINE_LOADING_START');
  }, []);

  const emitLoadingEnd = useCallback(() => {
    emitToParent('CONSENT_ENGINE_LOADING_END');
  }, []);

  const emitError = useCallback((reason: EmbedErrorReason, status?: number) => {
    const messages: Record<EmbedErrorReason, string> = {
      no_token: 'Access token was not received',
      token_invalid: 'Access token is invalid or expired',
      api_failure: 'Failed to load preferences',
    };
    const codes: Record<EmbedErrorReason, ErrorPayload['code']> = {
      no_token: 'NO_TOKEN',
      token_invalid: 'TOKEN_INVALID',
      api_failure: 'API_FAILURE',
    };
    emitToParent('CONSENT_ENGINE_ERROR', {
      code: codes[reason],
      message: messages[reason],
      ...(status !== undefined && { status }),
    });
  }, []);

  const emitPreferencesSaved = useCallback(() => {
    emitToParent('CONSENT_ENGINE_PREFERENCES_SAVED');
  }, []);

  return { emitLoadingStart, emitLoadingEnd, emitError, emitPreferencesSaved };
}
