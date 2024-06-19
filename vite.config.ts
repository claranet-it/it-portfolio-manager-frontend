/// <reference types="vitest" />
import { qwikVite } from '@builder.io/qwik/optimizer';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		qwikVite({
			csr: true,
		}),
		tsconfigPaths(),
	],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		globals: true,
		coverage: {
			all: true,
			provider: 'v8',
			exclude: [],
			reporter: ['text-summary', 'text'],
		},
	},
});
