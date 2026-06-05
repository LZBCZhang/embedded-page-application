import apiClient from '../../../lib/axiosClient';
import type { UnsubscribePayload } from '../types/unsubscribe.types';

export async function postUnsubscribe(payload: UnsubscribePayload): Promise<void> {
  await apiClient.post('/api/public/unsubscribe', payload);
}
