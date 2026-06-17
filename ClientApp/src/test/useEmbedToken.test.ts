import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEmbedToken } from '../features/preferences/hooks/useEmbedToken';

vi.mock('../hooks/usePostMessageEmitter', () => ({
  usePostMessageEmitter: () => ({
    emitLoadingStart: vi.fn(),
    emitLoadingEnd: vi.fn(),
    emitError: vi.fn(),
    emitPreferencesSaved: vi.fn(),
  }),
}));

describe('useEmbedToken', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    import.meta.env.VITE_ALLOWED_PARENT_ORIGINS = 'http://localhost:3000';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('starts in waiting status', () => {
    const { result } = renderHook(() => useEmbedToken());
    expect(result.current.status).toBe('waiting');
    expect(result.current.token).toBeNull();
  });

  it('transitions to ready when valid token received', async () => {
    const { result } = renderHook(() => useEmbedToken());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'AUTH_TOKEN', token: 'valid-jwt-token' },
          origin: 'http://localhost:3000',
        })
      );
    });

    await waitFor(() => {
      expect(result.current.status).toBe('ready');
      expect(result.current.token).toBe('valid-jwt-token');
    });
  });

  it('transitions to error after 5s timeout with no token', async () => {
    const { result } = renderHook(() => useEmbedToken());

    act(() => {
      vi.advanceTimersByTime(5001);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.reason).toBe('no_token');
    });
  });

  it('ignores messages from disallowed origins', async () => {
    const { result } = renderHook(() => useEmbedToken());

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'AUTH_TOKEN', token: 'malicious-token' },
          origin: 'http://evil.com',
        })
      );
    });

    expect(result.current.status).toBe('waiting');
    expect(result.current.token).toBeNull();
  });
});
