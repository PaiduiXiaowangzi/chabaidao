import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
const pathResolve = (dir) => resolve(__dirname, '.', dir);
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
	base:'/admin/',
	plugins: [vue(),commonjs()],
	resolve: {
		alias: [
		  { find: '@', replacement: pathResolve('src') },
		  { find: '*', replacement: pathResolve('./') }
		],
	},
})
