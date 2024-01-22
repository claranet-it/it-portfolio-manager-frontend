import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		qwikVite({
			csr: true,
		}),
		VitePWA({
			registerType: 'autoUpdate',
		}),
	],
});
