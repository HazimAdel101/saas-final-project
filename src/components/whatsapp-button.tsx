// src/components/whatsapp-button.tsx
// Floating WhatsApp button for dashboard
import React from 'react'

const WHATSAPP_NUMBER = '967780065525' // Replace with your WhatsApp number

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Chat on WhatsApp'
      className='fixed right-6 bottom-6 z-50 flex size-16 items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-colors duration-200 hover:bg-primary/90'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 32 32'
        fill='currentColor'
        className='h-6 w-6'
      >
        <path d='M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.09L4 29l7.18-2.31A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.5c-2.13 0-4.19-.62-5.93-1.8l-.42-.27-4.25 1.37 1.39-4.13-.28-.43A9.97 9.97 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.66 1.12 2.85c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z' />
      </svg>
    </a>
  )
}
