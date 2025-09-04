import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  
  // Parse the Accept-Language header to detect preferred language
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())
  
  // Check if Arabic is preferred
  const preferredLocale = languages.some(lang => 
    lang.startsWith('ar') || lang.includes('ar')
  ) ? 'ar' : 'en'

  // Redirect to the detected locale
  redirect(`/${preferredLocale}`)
}
