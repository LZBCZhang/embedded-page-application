import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePostMessageEmitter, emitToParent } from '../hooks/usePostMessageEmitter';

describe('emitToParent', () => {
  beforeEach(() => {
    vi.spyOn(window.parent, 'postMessage');
  });

  it('sends correct payload for CONSENT_ENGINE_ERROR', () => {
    emitToParent('CONSENT_ENGINE_ERROR', {
      code: 'NO_TOKEN',
      message: 'Access token was not received',
    });
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'CONSENT_ENGINE_ERROR', payload: { code: 'NO_TOKEN', message: 'Access token was not received' } },
      '*'
    );
  });

  it('sends correct payload for CONSENT_ENGINE_LOADING_START', () => {
    emitToParent('CONSENT_ENGINE_LOADING_START');
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      { type: 'CONSENT_ENGINE_LOADING_START', payload: undefined },
      '*'
    );
  });
});

describe('usePostMessageEmitter', () => {
  it('emitError sends correct code for no_token', () => {
    vi.spyOn(window.parent, 'postMessage');
    const { result } = renderHook(() => usePostMessageEmitter());
    result.current.emitError('no_token');
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CONSENT_ENGINE_ERROR' }),
      '*'
    );
  });
});
