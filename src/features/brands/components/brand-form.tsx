'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import * as z from 'zod'

const createFormSchema = (t: any) =>
  z.object({
    name: z.string().min(2, {
      message: t('brandNameLength')
    }),
    color: z.string().min(1, {
      message: t('colorRequired')
    })
  })

export interface Brand {
  id: number
  name: string
  color: string
  created_at: Date
  updated_at: Date
}

export default function BrandForm({
  initialData,
  pageTitle
}: {
  initialData: Brand | null
  pageTitle: string
}) {
  const router = useRouter()
  const t = useTranslations('BrandForm')
  
  const defaultValues = {
    name: initialData?.name || '',
    color: initialData?.color || '#3B82F6'
  }

  const formSchema = React.useMemo(
    () => createFormSchema(t),
    [t]
  )
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        name: values.name,
        color: values.color
      }

      const url = initialData ? `/api/brands/${initialData.id}` : '/api/brands'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        router.push('/dashboard/brands')
      } else {
        const error = await res.json()
        form.setError('root', { message: error.message || 'An error occurred' })
      }
    } catch (error) {
      form.setError('root', { message: 'An error occurred while saving the brand' })
    }
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('brandName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enterBrandName')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('brandColor')}</FormLabel>
                  <FormControl>
                    <div className='flex items-center space-x-2'>
                      <Input
                        type='color'
                        className='h-10 w-20'
                        {...field}
                      />
                      <Input
                        placeholder='#3B82F6'
                        {...field}
                        className='flex-1'
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className='text-sm text-red-600'>
                {form.formState.errors.root.message}
              </div>
            )}

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/brands')}
              >
                {t('cancel')}
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('saving') : (initialData ? t('updateBrand') : t('addBrand'))}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
