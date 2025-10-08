import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`
}

/**
 * Converts a hex color to 10% opacity for background use
 * @param hexColor - The hex color string (e.g., "#FF5733" or "FF5733")
 * @returns The hex color with 10% opacity (e.g., "#FF57331A")
 */
export function getColorWithOpacity(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Add 1A for 10% opacity (1A in hex = 26 in decimal, which is ~10% of 255)
  return `#${hex}1A`
}

/**
 * Gets the full color for text use
 * @param hexColor - The hex color string (e.g., "#FF5733" or "FF5733")
 * @returns The full hex color (e.g., "#FF5733")
 */
export function getFullColor(hexColor: string): string {
  // Ensure it starts with #
  return hexColor.startsWith('#') ? hexColor : `#${hexColor}`
}
