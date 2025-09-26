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
    ['font-subtitle', 'text-lg font-bold text-primary-text/75'],
    ['font-body', 'text-base font-normal'],
    ['font-caption', 'text-sm font-normal'],
    ['font-overline', 'text-xs font-normal'],
    ['flex-center', 'flex items-center justify-center'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    ['bg-primary-bg', 'bg-primary-background dark:bg-primary-background-dark'],
  ],
  rules: [
  ],
  theme: {
    colors: {
      'primary': '#212831',
      'secondary': '#563678',
      'primary-text': '#232123',
      'primary-background': '#f5f5f5',
      'primary-background-dark': '#222111',
      'primary-foreground': '#f5f5f5',
      'primary-foreground-dark': '#222111',
      'secondary-text': '#563678',
      'secondary-text-dark': '#563678',
      'secondary-foreground': '#ff00ff'
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