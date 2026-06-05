import { useQuery } from '@tanstack/react-query';
import { fetchPreferences } from '../api/preferences.api';
import type { PreferencesResponse } from '../types/preferences.types';

export function usePreferences(enabled: boolean) {
  return useQuery<PreferencesResponse>({
    queryKey: ['preferences'],
    queryFn: fetchPreferences,
    enabled,
  });
}
