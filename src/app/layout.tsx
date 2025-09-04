import type { Metadata } from 'next'
import LocaleRedirect from '@/components/locale-redirect'

export const metadata: Metadata = {
  title: 'Services E-commerce',
  description: 'E-commerce platform for services'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <LocaleRedirect />
      {children}
    </div>
  )
}
