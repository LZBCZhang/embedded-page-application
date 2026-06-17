import { useMutation } from '@tanstack/react-query';
import { postUnsubscribe } from '../api/unsubscribe.api';
import type { UnsubscribePayload } from '../types/unsubscribe.types';

export function useUnsubscribe() {
  return useMutation<void, unknown, UnsubscribePayload>({
    mutationFn: postUnsubscribe,
  });
}
