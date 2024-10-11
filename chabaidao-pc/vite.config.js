import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import commonjs from 'vite-plugin-commonjs';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import { imagetools } from 'vite-imagetools';

// 路径解析函数
const pathResolve = (dir) => resolve(__dirname, '.', dir);

// 配置文件
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/admin/' : '/', // 动态设置base路径
  plugins: [
    vue(),
    commonjs(),
    viteCompression({ algorithm: 'gzip' }), // gzip 压缩
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'My Admin App'
        },
      },
    }),
    imagetools(), // 图片优化
  ],
  resolve: {
    alias: [
      { find: '@', replacement: pathResolve('src') }
    ],
  },
  optimizeDeps: {
    include: ['vue'], // 明确指定需要预构建的依赖
    exclude: ['some-unnecessary-lib'], // 排除不需要预构建的依赖
  },
  server: {
    host: '0.0.0.0', // 支持局域网 IP 访问
    port: 3000,
    open: true, // 启动后自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 配置代理解决跨域问题
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    sourcemap: false, // 生产环境禁用 sourcemap
    minify: 'terser', // 使用 terser 进行压缩
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // 自定义输出文件名和路径
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'), // 全局常量
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
});