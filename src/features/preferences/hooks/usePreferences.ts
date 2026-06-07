import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildCommunicationTypes } from '../api/preferences.api';
import { useUpdatePreference } from './useUpdatePreference';
import { useFetchPreferences } from './useFetchPreferences';

import type {CommunicationType, Purpose, PurposeUpdate, UpdateUserPreferencesRequest} from '../types/preferences.types';
import {useEmbedToken} from "./useEmbedToken.ts";
import {usePostMessageEmitter} from "../../../hooks/usePostMessageEmitter.ts";

const cloneToggleState = (purposes: Purpose[]) => {
  const state: Record<string, Record<string, boolean>> = {};

  for (const purpose of purposes) {
    state[purpose.id] = {};
    for (const preference of [...purpose.communicationPreferences, ...purpose.otherPreferences]) {
      for (const option of preference.options) {
        state[purpose.id][option.id] = option.consented;
      }
    }
  }

  return state;
};

export const usePreferences = () => {
  const { t } = useTranslation();
  const { status, reason } = useEmbedToken();
  const { emitLoadingEnd, emitError, emitPreferencesSaved } = usePostMessageEmitter();

  const [toggleState, setToggleState] = useState<Record<string, Record<string, boolean>>>({});
  const [initialState, setInitialState] = useState<Record<string, Record<string, boolean>>>({});
  const [dirtyPurposeIds, setDirtyPurposeIds] = useState<Set<string>>(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchUserPreference = useFetchPreferences();
  const updateMutation = useUpdatePreference();

  const purposes = fetchUserPreference.data?.data ?? [];
  const allCommPrefTypes = useMemo<CommunicationType[]>(() => buildCommunicationTypes(purposes), [purposes]);
  const loadError = fetchUserPreference.isError;
  const saveError = updateMutation.isError;
  const loading = fetchUserPreference.isPending;
  const saving = updateMutation.isPending;

  useEffect(() => {
    if (!purposes) {
      return;
    }

    const nextState = cloneToggleState(purposes);
    setToggleState(nextState);
    setInitialState(nextState);
    setDirtyPurposeIds(new Set());
    emitLoadingEnd();
  }, [purposes]);

  useEffect(() => {
    if (!saveSuccess) {
      return;
    }

    const timeout = window.setTimeout(() => setSaveSuccess(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [saveSuccess]);

  const isPreferenceConsented = useCallback((purposeId: string, preferenceId: string) => {
    const purpose = purposes.find((item) => item.id === purposeId);
    if (!purpose) {
      return false;
    }

    const preference = [...purpose.communicationPreferences, ...purpose.otherPreferences].find((item) => item.id === preferenceId);
    if (!preference) {
      return false;
    }

    return preference.options.some((option) => toggleState[purposeId]?.[option.id] ?? false);
  }, [purposes, toggleState]);

  const markDirty = useCallback((purposeId: string, currentState: Record<string, boolean>, originalState: Record<string, boolean>) => {
    const changed = Object.keys(currentState).some((optionId) => currentState[optionId] !== originalState[optionId]);
    setDirtyPurposeIds((previous) => {
      const next = new Set(previous);
      if (changed) {
        next.add(purposeId);
      } else {
        next.delete(purposeId);
      }
      return next;
    });
  }, []);

  const togglePreference = useCallback((purposeId: string, preferenceId: string) => {
    const purpose = purposes.find((item) => item.id === purposeId);
    const currentPurposeState = toggleState[purposeId];
    if (!purpose || !currentPurposeState) {
      return;
    }

    const preference = [...purpose.communicationPreferences, ...purpose.otherPreferences].find((item) => item.id === preferenceId);
    if (!preference) {
      return;
    }

    const currentlyConsented = isPreferenceConsented(purposeId, preferenceId);
    const nextState = { ...currentPurposeState };
    for (const option of preference.options) {
      nextState[option.id] = !currentlyConsented;
    }

    setToggleState((previous) => ({ ...previous, [purposeId]: nextState }));
    markDirty(purposeId, nextState, initialState[purposeId] ?? {});
  }, [initialState, isPreferenceConsented, markDirty, purposes, toggleState]);

  const isAllUnsubscribed = useCallback((type: string) => {
    if (purposes.length === 0) {
      return false;
    }

    return purposes.every((purpose) => {
      const preference = purpose.communicationPreferences.find((item) => item.type === type);
      return !preference || !isPreferenceConsented(purpose.id, preference.id);
    });
  }, [isPreferenceConsented, purposes]);

  const toggleUnsubscribeAll = useCallback((type: string) => {
    const willConsent = isAllUnsubscribed(type);

    setToggleState((previous) => {
      const next = { ...previous };
      for (const purpose of purposes) {
        const preference = purpose.communicationPreferences.find((item) => item.type === type);
        if (!preference) {
          continue;
        }

        const purposeState = { ...(next[purpose.id] ?? {}) };
        for (const option of preference.options) {
          purposeState[option.id] = willConsent;
        }

        next[purpose.id] = purposeState;
        markDirty(purpose.id, purposeState, initialState[purpose.id] ?? {});
      }
      return next;
    });
  }, [initialState, isAllUnsubscribed, markDirty, purposes]);

  const buildPreferencePayload = useCallback((): UpdateUserPreferencesRequest => {
    return {
        userId: '', // This should be populated with actual user ID
        collectionPointId: '', // This should be populated with actual collection point ID
        source: 'web', // This can be adjusted based on the actual source
        purposes: buildPurposesUpdates(),
        additionalInfo: {}
    }
  }, []);

  const buildPurposesUpdates = useCallback((): PurposeUpdate[] => {
    return purposes
      .filter((purpose) => dirtyPurposeIds.has(purpose.id))
      .map((purpose) => {
        const state = toggleState[purpose.id] ?? {};
        const communicationPreferences = purpose.communicationPreferences
          .filter((preference) => preference.options.some((option) => state[option.id]))
          .map((preference) => preference.type)
          .filter((value, index, array) => array.indexOf(value) === index);

        return {
          purposeId: purpose.id,
          status: communicationPreferences.length > 0 ? 'CONFIRMED' : 'WITHDRAWN',
          communicationPreferences,
        } satisfies PurposeUpdate;
      });
  }, [dirtyPurposeIds, purposes, toggleState]);

  const savePreferences = useCallback(() => {
    setSaveSuccess(false);
    updateMutation.mutate(buildPreferencePayload(), {
      onSuccess: () => {
        setSaveSuccess(true);
      },
    });
  }, [buildPreferencePayload, updateMutation]);

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
    loadErrorMessage: t('preferences.error.load'),
    saveErrorMessage: t('preferences.error.save'),
    successMessage: t('preferences.success.save'),
  };
};
