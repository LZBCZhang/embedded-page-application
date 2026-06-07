import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildCommunicationTypes } from '../api/preferences.api';
import { useUpdatePreference } from './useUpdatePreference';
import { useFetchPreferences } from './useFetchPreferences';
import { useEmbedToken } from './useEmbedToken';
import { usePostMessageEmitter } from '../../../hooks/usePostMessageEmitter';
import type {
  AdditionalInfo,
  CommunicationType,
  Purpose,
  PurposeUpdate,
  UpdateUserPreferencesRequest,
} from '../types/preferences.types';

const COLLECTION_POINT_ID = import.meta.env.VITE_COLLECTION_POINT_ID ?? '';

const cloneToggleState = (purposes: Purpose[]): Record<string, Record<string, boolean>> => {
  const state: Record<string, Record<string, boolean>> = {};
  for (const purpose of purposes) {
    state[purpose.id] = {};
    for (const pref of [...purpose.communicationPreferences, ...purpose.otherPreferences]) {
      for (const option of pref.options) {
        state[purpose.id][option.id] = option.consented;
      }
    }
  }
  return state;
};

export const usePreferences = () => {
  const { t } = useTranslation();
  const { status, reason, userId, userEmail, userPhone, companyId } = useEmbedToken();
  const { emitLoadingEnd, emitError, emitPreferencesSaved } = usePostMessageEmitter();

  const [toggleState, setToggleState] = useState<Record<string, Record<string, boolean>>>({});
  const [initialState, setInitialState] = useState<Record<string, Record<string, boolean>>>({});
  const [dirtyPurposeIds, setDirtyPurposeIds] = useState<Set<string>>(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    mutate: fetchPreferences,
    data: fetchData,
    isPending: fetchPending,
    isError: loadError,
    isSuccess: fetchSuccess,
  } = useFetchPreferences();
  const updateMutation = useUpdatePreference();

  const purposes = fetchData?.data ?? [];
  const allCommPrefTypes = useMemo<CommunicationType[]>(() => buildCommunicationTypes(purposes), [purposes]);
  const loading = fetchPending;
  const saving = updateMutation.isPending;
  const saveError = updateMutation.isError;

  useEffect(() => {
    if (status === 'ready' && userId) {
      fetchPreferences({ userId, collectionPointId: COLLECTION_POINT_ID });
    }
  }, [status, userId, fetchPreferences]);

  useEffect(() => {
    const nextState = cloneToggleState(purposes);
    setToggleState(nextState);
    setInitialState(nextState);
    setDirtyPurposeIds(new Set());
  }, [purposes]);

  useEffect(() => {
    if (fetchSuccess) emitLoadingEnd();
  }, [fetchSuccess, emitLoadingEnd]);

  useEffect(() => {
    if (loadError) emitError('api_failure');
  }, [loadError, emitError]);

  useEffect(() => {
    if (!saveSuccess) return;
    const timeout = window.setTimeout(() => setSaveSuccess(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [saveSuccess]);

  const isPreferenceConsented = useCallback((purposeId: string, preferenceId: string): boolean => {
    const purpose = purposes.find((p) => p.id === purposeId);
    if (!purpose) return false;

    const pref = [...purpose.communicationPreferences, ...purpose.otherPreferences]
      .find((p) => p.id === preferenceId);
    if (!pref) return false;

    return pref.options.some((opt) => toggleState[purposeId]?.[opt.id] ?? false);
  }, [purposes, toggleState]);

  const markDirty = useCallback((purposeId: string, current: Record<string, boolean>, original: Record<string, boolean>) => {
    const changed = Object.keys(current).some((optId) => current[optId] !== original[optId]);
    setDirtyPurposeIds((prev) => {
      const next = new Set(prev);
      if (changed) next.add(purposeId);
      else next.delete(purposeId);
      return next;
    });
  }, []);

  const isAllUnsubscribed = useCallback((type: string): boolean => {
    if (purposes.length === 0) return false;
    return purposes.every((purpose) => {
      const pref = purpose.communicationPreferences.find((p) => p.type === type);
      return !pref || !isPreferenceConsented(purpose.id, pref.id);
    });
  }, [isPreferenceConsented, purposes]);

  const togglePreference = useCallback((purposeId: string, preferenceId: string) => {
    const purpose = purposes.find((p) => p.id === purposeId);
    const currentPurposeState = toggleState[purposeId];
    if (!purpose || !currentPurposeState) return;

    const pref = [...purpose.communicationPreferences, ...purpose.otherPreferences]
      .find((p) => p.id === preferenceId);
    if (!pref) return;

    const wasConsented = isPreferenceConsented(purposeId, preferenceId);
    const nextState = { ...currentPurposeState };
    for (const option of pref.options) {
      nextState[option.id] = !wasConsented;
    }

    setToggleState((prev) => ({ ...prev, [purposeId]: nextState }));
    markDirty(purposeId, nextState, initialState[purposeId] ?? {});
  }, [initialState, isPreferenceConsented, markDirty, purposes, toggleState]);

  const toggleUnsubscribeAll = useCallback((type: string) => {
    const willConsent = isAllUnsubscribed(type);

    setToggleState((prev) => {
      const next = { ...prev };
      for (const purpose of purposes) {
        const pref = purpose.communicationPreferences.find((p) => p.type === type);
        if (!pref) continue;

        const purposeState = { ...(next[purpose.id] ?? {}) };
        for (const option of pref.options) {
          purposeState[option.id] = willConsent;
        }
        next[purpose.id] = purposeState;
        markDirty(purpose.id, purposeState, initialState[purpose.id] ?? {});
      }
      return next;
    });
  }, [initialState, isAllUnsubscribed, markDirty, purposes]);

  const buildPurposesUpdates = useCallback((): PurposeUpdate[] => {
    return purposes
      .filter((purpose) => dirtyPurposeIds.has(purpose.id))
      .map((purpose) => {
        const state = toggleState[purpose.id] ?? {};
        const communicationPreferences = purpose.communicationPreferences
          .filter((pref) => pref.options.some((opt) => state[opt.id]))
          .map((pref) => pref.type)
          .filter((type, idx, arr) => arr.indexOf(type) === idx);

        return {
          purposeId: purpose.id,
          status: communicationPreferences.length > 0 ? 'CONFIRMED' : 'WITHDRAWN',
          communicationPreferences,
        } satisfies PurposeUpdate;
      });
  }, [dirtyPurposeIds, purposes, toggleState]);

  const buildPreferencePayload = useCallback((): UpdateUserPreferencesRequest => {
    const hasAdditionalInfo = !!(userEmail || userPhone || companyId);
    const additionalInfo: AdditionalInfo | undefined = hasAdditionalInfo
      ? { email: userEmail ?? '', mobile: userPhone ?? '', company: companyId ?? '' }
      : undefined;

    return {
      userId: userId ?? '',
      collectionPointId: COLLECTION_POINT_ID,
      source: 'web',
      purposes: buildPurposesUpdates(),
      ...(additionalInfo && { additionalInfo }),
    };
  }, [buildPurposesUpdates, userId, userEmail, userPhone, companyId]);

  const savePreferences = useCallback(() => {
    setSaveSuccess(false);
    updateMutation.mutate(buildPreferencePayload(), {
      onSuccess: () => {
        setSaveSuccess(true);
        emitPreferencesSaved();
      },
    });
  }, [buildPreferencePayload, emitPreferencesSaved, updateMutation]);

  return {
    purposes,
    allCommPrefTypes,
    loading,
    saving,
    loadError,
    saveError,
    saveSuccess,
    savePreferences,
    isPreferenceConsented,
    isAllUnsubscribed,
    togglePreference,
    toggleUnsubscribeAll,
    embedStatus: status,
    embedReason: reason,
    loadErrorMessage: t('preferences.error.load'),
    saveErrorMessage: t('preferences.error.save'),
    successMessage: t('preferences.success.save'),
  };
};