import { defineConfig } from 'vite'
import { resolve } from 'path'
// import path from 'path'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // reactRefresh(),
    react({
      babel: {
        plugins: ['@babel/plugin-transform-react-jsx'],
      },
    }),
    // viteMockServe({
    //   mockPath: 'mock',
    //   localEnabled: true,
    //   logger: true,
    //   injectCode: `
    //       import { setupProdMockServer } from './mockProdServer';
    //       setupProdMockServer();
    //     `,
    //   injectFile: path.resolve(process.cwd(), 'src/main.jsx')
    // })
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8400',
        changeOrigin: true,
        rewrite: (path) => path.replace('', '')
      }
    }
  }
})
