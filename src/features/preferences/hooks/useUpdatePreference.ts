import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePreference } from '../api/preferences.api';
import type { UpdatePreferencePayload } from '../types/preferences.types';

export function useUpdatePreference() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdatePreferencePayload>({
    mutationFn: updatePreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
