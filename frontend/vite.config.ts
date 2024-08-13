import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dns from 'dns';

// dns.setDefaultResultOrder('verbatim');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
  },
});
