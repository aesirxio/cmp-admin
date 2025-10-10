import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import inlineImage from 'esbuild-plugin-inline-image';
const env = process.env.NODE_ENV;

const tsupConfig = defineConfig([
  {
    format: ['esm'],
    outDir: 'build/lib',
    entry: ['src/index.{ts,tsx}'],
    bundle: true,
    target: 'es2020',
    clean: true,
    dts: true,
    loader: {
      '.js': 'jsx',
    },
    outExtension() {
      return {
        js: `.js`,
      };
    },
    esbuildPlugins: [inlineImage({ limit: -1 }), sassPlugin({ type: 'style' })],
    esbuildOptions(options) {
      env === 'production' ? (options.drop = ['console']) : '';
    },
    publicDir: 'src/SSOButton/styles',
  },
  {
    format: ['iife'],
    outDir: 'build',
    entry: ['src/sso.{ts,tsx}'],
    bundle: true,
    minify: true,
    target: 'es2020',
    clean: false,
    dts: false,
    loader: {
      '.js': 'jsx',
    },

    outExtension() {
      return {
        js: `.js`,
      };
    },
    esbuildPlugins: [inlineImage({ limit: -1 }), sassPlugin({ type: 'style' })],
    esbuildOptions(options) {
      env === 'production' ? (options.drop = ['console']) : '';
    },
  },
]);

export default tsupConfig;
