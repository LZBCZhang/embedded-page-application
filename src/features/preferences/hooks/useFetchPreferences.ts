import { useQuery } from '@tanstack/react-query';
import { fetchUserPreferences } from '../api/preferences.api';
import type { FetchUserPreferencesRequest } from '../types/preferences.types';

export const useFetchPreferences = (request: FetchUserPreferencesRequest, enabled: boolean) => {
  return useQuery({
    queryKey: ['preferences', request.userId, request.collectionPointId],
    queryFn: () => fetchUserPreferences(request),
    enabled,
  });
};