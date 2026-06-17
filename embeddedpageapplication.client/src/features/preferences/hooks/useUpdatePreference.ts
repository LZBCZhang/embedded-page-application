import { useMutation } from '@tanstack/react-query';
import { updateUserPreferences } from '../api/preferences.api';
import type { UpdateUserPreferencesRequest } from '../types/preferences.types';

export function useUpdatePreference() {
  return useMutation<void, unknown, UpdateUserPreferencesRequest>({
    mutationFn: updateUserPreferences,
  });
}
