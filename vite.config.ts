import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name][extname]',
            },
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: './test/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            enabled: true,
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/test/**',
                '**/domain/**',
            ],
        },
    },
})