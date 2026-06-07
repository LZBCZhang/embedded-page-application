import { useMutation } from '@tanstack/react-query';
import { fetchUserPreferences } from '../api/preferences.api';
import type { FetchUserPreferencesRequest, UserPreferencesResponse } from '../types/preferences.types';

export const useFetchPreferences = () => {
  return useMutation<UserPreferencesResponse, unknown, FetchUserPreferencesRequest>({
    mutationFn: fetchUserPreferences,
  });
};