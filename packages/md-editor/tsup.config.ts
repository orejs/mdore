import { defineConfig } from 'tsup';

export default defineConfig({
  loader: {
    '.tsx': 'tsx',
  },
});
