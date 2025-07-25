import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {
  description: React.ReactNode
}

export function ProductTabs({ description }: Props) {
  const t = useTranslations('ProductTabs')

  return (
    <div className='flex w-full max-w-sm flex-col gap-6'>
      <Tabs
        className={
          typeof document !== 'undefined' && document.dir === 'rtl'
            ? 'rtl:direction-ltr'
            : ''
        }
        style={
          typeof document !== 'undefined' && document.dir === 'rtl'
            ? { direction: 'rtl' }
            : undefined
        }
        defaultValue='description'
      >
        <TabsList
          className={
            typeof document !== 'undefined' && document.dir === 'rtl'
              ? 'rtl:flex-row-reverse'
              : ''
          }
        >
          <TabsTrigger value='description'>{t('description')}</TabsTrigger>
          <TabsTrigger value='reviews'>{t('reviews')}</TabsTrigger>
        </TabsList>
        <TabsContent className='min-h-20' value='description'>
          {description}
        </TabsContent>
        <TabsContent className='min-h-20' value='reviews'>
          here stays the chats of users
        </TabsContent>
      </Tabs>
    </div>
  )
}
