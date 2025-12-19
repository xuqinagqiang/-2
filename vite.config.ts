
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Import the cwd function directly from node:process to resolve type definition issues with the global process object
import { cwd } from 'node:process';

export default defineConfig(({ mode }) => {
  // Use the imported cwd() function to determine the environment directory for loading .env files
  const env = loadEnv(mode, cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
