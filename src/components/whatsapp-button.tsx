import React from 'react'
import { useTranslations } from 'next-intl'

import { Icon } from '@iconify/react'
import Link from 'next/link'

const WHATSAPP_NUMBER = '967780065525'

export default function WhatsAppButton() {
  const t = useTranslations('WhatsApp')

  return (
    <Link
      href={`whatsapp://send?phone=${WHATSAPP_NUMBER}`}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={t('chatOnWhatsApp')}
      className='text-primary-foreground fixed end-6 bottom-6 z-50 flex size-16 items-center justify-center rounded-full bg-[#25D366] p-4 shadow-lg transition-colors duration-200 hover:bg-[#25D366]/90'
    >
      <Icon icon='prime:whatsapp' className='size-16 text-white' />
    </Link>
  )
}
