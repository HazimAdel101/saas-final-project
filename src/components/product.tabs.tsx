'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

type Props = {
  description: React.ReactNode
}

export function ProductTabs({ description }: Props) {
  const t = useTranslations('ProductTabs')
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setDir(document.documentElement.dir as 'ltr' | 'rtl')
    }
  }, [])

  return (
    <div className='flex w-full! flex-col'>
      <Tabs dir={dir} defaultValue='description'>
        <TabsList className='mx-auto flex gap-2 bg-transparent'>
          <TabsTrigger value='description'>{t('description')}</TabsTrigger>
          <TabsTrigger value='reviews'>{t('reviews')}</TabsTrigger>
        </TabsList>
        <TabsContent className='min-h-20' value='description'>
          <div dangerouslySetInnerHTML={{ __html: description as string }} />
        </TabsContent>
        <TabsContent className='min-h-20' value='reviews'>
          here stays the chats of users
        </TabsContent>
      </Tabs>
    </div>
  )
}
