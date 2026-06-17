import apiClient from '../../../lib/axiosClient';
import type {
  CommunicationType,
  Purpose,
  UpdateUserPreferencesRequest,
  FetchUserPreferencesRequest,
  UserPreferencesResponse,
} from '../types/preferences.types';


export const fetchUserPreferences = async (userPreferenceRequest: FetchUserPreferencesRequest): Promise<UserPreferencesResponse> => {
  const { data } = await apiClient.post<UserPreferencesResponse>('/api/consent/user-consents', userPreferenceRequest);
  return normalizePurposesResponse(data);
};

export const updateUserPreferences = async (updatePreferencePayload : UpdateUserPreferencesRequest):
    Promise<void> => await apiClient.post('/api/consent/update-user-consents', updatePreferencePayload);

function normalizePurposesResponse(response: unknown): UserPreferencesResponse {
  const parsed = typeof response === 'string' ? JSON.parse(response) as unknown : response;

  if (Array.isArray(parsed)) {
    return {
      meta: { correlationId: '' },
      data: parsed.map((p) => normalizePurpose(p as Purpose)),
    };
  }

  const raw = parsed as { data?: unknown; meta?: { correlationId?: string } } | null;
  const rawList = Array.isArray(raw?.data) ? (raw.data as Purpose[]) : [];

  return {
    meta: { correlationId: raw?.meta?.correlationId ?? '' },
    data: rawList.map((p) => normalizePurpose(p as Purpose)),
  };
}

function normalizePurpose(purpose: Purpose): Purpose {
  return {
    ...purpose,
    communicationPreferences: Array.isArray(purpose.communicationPreferences)
      ? [...purpose.communicationPreferences]
          .map((pref) => ({ ...pref, options: Array.isArray(pref.options) ? pref.options : [] }))
          .sort((left, right) => left.name.localeCompare(right.name))
      : [],
    otherPreferences: Array.isArray(purpose.otherPreferences)
      ? purpose.otherPreferences.map((pref) => ({ ...pref, options: Array.isArray(pref.options) ? pref.options : [] }))
      : [],
  };
}

export const buildCommunicationTypes = (purposes: Purpose[]): CommunicationType[] => {
  const seen = new Map<string, string>();

  for (const purpose of purposes) {
    for (const preference of purpose.communicationPreferences) {
      if (preference.type && !seen.has(preference.type)) {
        seen.set(preference.type, preference.name);
      }
    }
  }

  return Array.from(seen.entries())
    .map(([type, name]) => ({ type, name }))
    .sort((left, right) => left.name.localeCompare(right.name));
};
