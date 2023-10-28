/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ['./src/index.ts'],
  minify: false,
  treeshake: false,
  target: 'node18',
  splitting: false,
  format: ['cjs'],
  platform: 'node',
  esbuildOptions(options) {
    options.alias = {
      'lodash-es': 'lodash',
    };
    options.external = ['lodash', 'fs-extra'];
  },
  // eslint-disable-next-line jsdoc/require-jsdoc
  outExtension({ format }) {
    return {
      js: `.${format}`,
    };
  },
});
