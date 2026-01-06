import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
    plugins: [angular()],
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src/app'),
            '@shared': path.resolve(__dirname, './src/app/shared'),
            '@entities': path.resolve(__dirname, './src/app/entities'),
            '@features': path.resolve(__dirname, './src/app/features'),
            '@pages': path.resolve(__dirname, './src/app/pages'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.spec.ts'],
        reporters: ['default'],
    },
});
