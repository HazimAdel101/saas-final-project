import KBar from '@/components/kbar'
import AppSidebar from '@/components/layout/app-sidebar'
import Header from '@/components/layout/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { auth, currentUser } from '@clerk/nextjs/server'
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
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return redirect('/auth/sign-in')
    }

    // Check if user has admin role
    const userRole = (user.publicMetadata as any)?.role || (user.unsafeMetadata as any)?.role


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
