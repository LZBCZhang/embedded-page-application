import axios from 'axios';

const apiClient = axios.create({
  // In dev, use relative URLs so the Vite proxy forwards /api → VITE_API_BASE_URL.
  // In production, point directly at the configured API origin.
  baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL ?? ''),
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('embed_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const correlationId = error.response?.headers?.['x-correlation-id'];
    return Promise.reject({ status, correlationId, original: error });
  }
);

export default apiClient;
