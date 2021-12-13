import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return { plugins: [react()] };
});
