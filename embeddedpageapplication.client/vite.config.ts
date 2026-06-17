import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv reads .env, .env.local, .env.[mode], .env.[mode].local
  // Using '' prefix so non-VITE_ vars (like DEV_API_TARGET) are also loaded
  const env = loadEnv(mode, process.cwd(), '');

  // Proxy target: the ASP.NET Core server, configured via VITE_API_BASE_URL.
  // Defaults to the server's HTTP dev URL (see ../Properties/launchSettings.json).
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      // Pinned so the ASP.NET Core SpaProxy (UseProxyToSpaDevelopmentServer)
      // can reliably reach the Vite dev server.
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          // Allow self-signed certs on local https backends
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
  };
});