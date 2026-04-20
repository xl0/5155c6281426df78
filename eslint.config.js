import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));
const srcFiles = [
	'src/**/*.js',
	'src/**/*.cjs',
	'src/**/*.mjs',
	'src/**/*.ts',
	'src/**/*.cts',
	'src/**/*.mts',
	'src/**/*.svelte',
	'src/**/*.svelte.ts',
	'src/**/*.svelte.js'
];

const onlySrc = (config) => ({
	...config,
	files: config.files ? config.files.map((pattern) => `src/${pattern}`) : srcFiles
});

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['src/lib/components/ui/**']
	},
	onlySrc(js.configs.recommended),
	...ts.configs.recommended.map(onlySrc),
	...svelte.configs.recommended.map(onlySrc),
	onlySrc(prettier),
	...svelte.configs.prettier.map(onlySrc),
	{
		files: srcFiles,
		languageOptions: { globals: { ...globals.browser, ...globals.node } },

		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['src/**/*.svelte', 'src/**/*.svelte.ts', 'src/**/*.svelte.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
