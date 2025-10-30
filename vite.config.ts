// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: 'localhost', // hoặc '0.0.0.0' nếu muốn truy cập từ máy khác
    port: 3000,        // đổi port tại đây
    
    // Thêm dòng này để cho phép ngrok host truy cập
    allowedHosts: [
      'odorless-unsolved-ariah.ngrok-free.dev'
    ]
    
  },
  // assetsInclude: ['**/*.xlsx'], // Handle problem file xlxs
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations :['mixed-decls', 'color-functions', 'global-builtin', 'import']
      }
    }
  }
});