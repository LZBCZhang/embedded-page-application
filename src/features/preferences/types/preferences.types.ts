export interface ConsentPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  required: boolean;
}

export interface UpdatePreferencePayload {
  id: string;
  enabled: boolean;
}

export interface PreferencesResponse {
  preferences: ConsentPreference[];
}
