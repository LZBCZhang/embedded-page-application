import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { EmbedErrorPage } from '../features/preferences/components/EmbedErrorPage';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('EmbedErrorPage', () => {
  it('renders the error title', () => {
    render(<EmbedErrorPage />, { wrapper: Wrapper });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong');
  });

  it('renders the error message', () => {
    render(<EmbedErrorPage />, { wrapper: Wrapper });
    expect(screen.getByText(/could not be loaded/i)).toBeInTheDocument();
  });

  it('renders a reference ID', () => {
    render(<EmbedErrorPage correlationId="TEST-123" />, { wrapper: Wrapper });
    expect(screen.getByText('TEST-123')).toBeInTheDocument();
  });

  it('renders retry button and reloads on click', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
    render(<EmbedErrorPage />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reloadMock).toHaveBeenCalled();
  });

  it('accepts reason prop without crashing', () => {
    render(<EmbedErrorPage reason="no_token" />, { wrapper: Wrapper });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
