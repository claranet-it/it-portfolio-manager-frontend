/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		qwikVite({
			csr: true
		}),
		VitePWA({
			registerType: 'autoUpdate',
		}),
		tsconfigPaths()
	],
	test:{
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		globals: true,
		coverage: {
			all: true,
			provider: 'v8',
			exclude: [],
			reporter: ['text-summary', 'text']
		},
	}
});

