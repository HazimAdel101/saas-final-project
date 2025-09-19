import KBar from '@/components/kbar'
import AppSidebar from '@/components/layout/app-sidebar'
import Header from '@/components/layout/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard'
}

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  try {
    // Check authentication and admin role
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return redirect('/auth/sign-in')
    }

    // Check if user has admin role
    const userRole =
      (sessionClaims?.metadata as any)?.role ||
      (sessionClaims?.publicMetadata as any)?.role

    if (userRole !== 'admin') {
      return redirect('/')
    }

    // Persisting the sidebar state in the cookie.
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'
    return (
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    )
  } catch (error) {
    return redirect('/')
  }
}
