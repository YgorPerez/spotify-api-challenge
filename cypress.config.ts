import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'iazx18',
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    testIsolation: false,
  },
  defaultCommandTimeout: 8000,
    chromeWebSecurity: false,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
