export interface UnsubscribePayload {
  token: string;
  consentId: string;
  email: string;
}

export type UnsubscribeStatus = 'idle' | 'loading' | 'success' | 'error';
