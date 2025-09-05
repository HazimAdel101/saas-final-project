'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')
  return (
    <footer className='border-t border-border'>
      <div className='mx-auto w-full px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='flex items-center space-x-6 text-sm'>
            <a href='#privacy' className='transition-colors'>
              {t('privacy')}
            </a>
            <a href='#terms' className='transition-colors'>
              {t('terms')}
            </a>
            <a href='#support' className='transition-colors'>
              {t('support')}
            </a>
          </div>
          <div className='text-sm'>
            {new Date().getFullYear()} {t('copyright')}
          </div>
        </div>
      </div>
    </footer>
  )
}
