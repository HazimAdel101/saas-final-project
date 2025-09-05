import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return redirect(`/${locale}/auth/sign-in`)
  }

  // Check if user has admin role - backup check to middleware
  const userRole = (sessionClaims?.metadata as any)?.role || (sessionClaims?.publicMetadata as any)?.role
  
  if (userRole !== 'admin') {
    return redirect(`/${locale}`)
  }

  // Redirect to overview if user is authenticated and has admin role
  redirect(`/${locale}/dashboard/overview`)
}
