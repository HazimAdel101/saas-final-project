import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const { userId } = await auth()

  if (!userId) {
    return redirect('/auth/sign-in')
  } else {
    redirect(`/${locale}/dashboard/overview`)
  }
}
