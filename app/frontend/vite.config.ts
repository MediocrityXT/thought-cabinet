import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const configDir = path.dirname(fileURLToPath(import.meta.url));
  const apiTarget = process.env.THOUGHTCABINET_API_URL ?? 'http://127.0.0.1:8000';
  const frontendPort = Number(process.env.THOUGHTCABINET_FRONTEND_PORT ?? '5173');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(configDir, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: frontendPort,
      strictPort: true,
      proxy: {
        '/api': apiTarget,
      },
    },
  };
});
