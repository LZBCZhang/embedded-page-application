
export interface ApiError {
  status: number;
  correlationId?: string;
  original: unknown;
}

export type EmbedTokenStatus = 'waiting' | 'ready' | 'error';

export type EmbedErrorReason = 'no_token' | 'token_invalid' | 'api_failure';

export interface PostMessageEvent<T = undefined> {
  type: string;
  payload?: T;
}

export interface EmbedConfig {
  token: string;
  userId: string;
  userEmail?: string;
  userPhone?: string;
  companyId?: string;
}
