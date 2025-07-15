import Navbar from '@/components/layout/user-navbar'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  )
}
