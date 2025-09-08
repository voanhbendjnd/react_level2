import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // hoặc '0.0.0.0' nếu muốn truy cập từ máy khác
    port: 3000         // đổi port tại đây
  }
});
