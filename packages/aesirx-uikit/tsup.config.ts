import { Options } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import { ScssModulesPlugin } from 'esbuild-scss-modules-plugin';
import inlineImage from 'esbuild-plugin-inline-image';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  clean: env !== 'development',
  format: ['esm'],
  watch: env === 'development',
  outDir: 'dist',
  entry: ['src/index.{ts,tsx}', 'src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.d.ts'],
  target: 'es2020',
  platform: 'browser',
  esbuildPlugins: [
    inlineImage({ limit: -1 }),
    ScssModulesPlugin({ localsConvention: 'dashes' }),
    sassPlugin({ type: 'style' }),
  ],
  esbuildOptions(options) {
    env === 'production' ? (options.drop = ['console']) : '';
  },
  outExtension() {
    return {
      js: `.js`,
    };
  },
  publicDir: 'src/scss',
};
