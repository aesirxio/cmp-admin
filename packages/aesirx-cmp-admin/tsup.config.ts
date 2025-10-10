import { Options } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import inlineImage from 'esbuild-plugin-inline-image';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  clean: true,
  format: ['esm'],
  watch: env === 'development',
  outDir: 'dist',
  entry: ['src/integration/index.js'],
  target: 'es2020',
  platform: 'browser',
  esbuildPlugins: [inlineImage({ limit: -1 }), sassPlugin({ type: 'style' })],
  esbuildOptions(options) {
    options.drop = ['console'];
  },
  outExtension() {
    return {
      js: `.js`,
    };
  },
  loader: {
    '.js': 'jsx',
  },
};
