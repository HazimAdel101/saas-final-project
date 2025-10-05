import { cn } from '@/lib/utils'

// Use system fonts instead of Google Fonts to avoid import issues
const fontSans = {
  variable: '--font-sans',
  className: 'font-sans'
}

const fontMono = {
  variable: '--font-mono',
  className: 'font-mono'
}

const fontInstrument = {
  variable: '--font-instrument',
  className: 'font-sans'
}

const fontNotoMono = {
  variable: '--font-noto-mono',
  className: 'font-mono'
}

const fontMullish = {
  variable: '--font-mullish',
  className: 'font-sans'
}

const fontInter = {
  variable: '--font-inter',
  className: 'font-sans'
}

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontInter.variable
)
