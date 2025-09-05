import React from 'react'

const WHATSAPP_NUMBER = '967780065525'
import { Icon } from "@iconify/react"
import Link from 'next/link'

export default function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Chat on WhatsApp'
      className='fixed end-6 bottom-6 z-50 flex size-16 items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-colors duration-200 hover:bg-primary/90'
    >
      <Icon icon='prime:whatsapp' className='size-16' />
    </Link>
  )
}
