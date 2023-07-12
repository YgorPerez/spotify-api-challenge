import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'iazx18',
  e2e: {
    baseUrl: 'http://music-api-challenge.vercel.app',
  },
});
