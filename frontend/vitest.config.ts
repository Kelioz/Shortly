/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '~/': new URL('./', import.meta.url).pathname,
      '@/': new URL('./src/', import.meta.url).pathname,
    },
    reporters: [
      'default',
      [
        'junit',
        {
          outputFile: 'junit.xml',
        },
      ],
    ],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/index.ts',
        '**/types.ts',
        'src/app/*',
        'src/App.tsx',
        'src/main.tsx',
        'src/pages/*',
      ],
      reporter: ['html', 'text', 'text-summary', 'cobertura'],
    },
  },
  plugins: [react()],
})
