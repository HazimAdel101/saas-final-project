import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: false,
      collections: {
        lucide: () => import('@iconify/json/json/lucide.json').then(i => i.default),
      },
    }),
  ],
  shortcuts: [
    ['font-title', 'text-2xl font-bold text-primary-text'],
    ['font-subtitle', 'text-lg font-bold text-primary-text/90'],
    ['font-body', 'text-base font-normal'],
    ['font-caption', 'text-sm font-normal'],
    ['font-overline', 'text-xs font-normal'],
    ['flex-center', 'flex items-center justify-center'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
  ],
  rules: [
  ],
  theme: {
    colors: {
      'primary': '#212831',
      'secondary': '#563678',
      'primary-text': '#232123'
    },
  },
  safelist: [
    'text-sm',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl',
  ],
  blocklist: [
    /text-sm.*\{.*\}/,
    /text-.*~=.*\{.*\}/,
    /text-.*maxFiles/,
    /text-.*\{.*\}/,
    /\[text-.*~=.*\]/,
  ],
  extractors: [
    {
      name: 'custom',
      extract: ({ code }: { code: string }): string[] => {
        return code
          .replace(/text-sm.*maxFiles/g, '')
          .replace(/text-.*\{.*\}/g, '')
          .replace(/\[text-.*~=.*\]/g, '')
          .split(/\s+/)
          .filter(Boolean)
      }
    }
  ],
})