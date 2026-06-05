import apiClient from '../../../lib/axiosClient';
import type {
  PreferencesResponse,
  UpdatePreferencePayload,
} from '../types/preferences.types';

export async function fetchPreferences(): Promise<PreferencesResponse> {
  const { data } = await apiClient.get<PreferencesResponse>('/api/preferences');
  return data;
}

export async function updatePreference(
  payload: UpdatePreferencePayload
): Promise<void> {
  await apiClient.patch(`/api/preferences/${payload.id}`, {
    enabled: payload.enabled,
  });
}
