import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './i18n';
import queryClient from './lib/queryClient';
import { UnsubscribePage } from './features/unsubscribe/UnsubscribePage';
import { PreferencesPage } from './features/preferences/PreferencesPage';
import { EmbedErrorPage } from './features/preferences/components/EmbedErrorPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="*" element={<EmbedErrorPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
