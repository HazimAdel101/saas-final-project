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
// Remove Select imports since we no longer need language selection
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import * as z from 'zod'

const createFormSchema = (t: any) =>
  z.object({
    name_en: z.string().min(2, {
      message: t('tagNameLength')
    }),
    name_ar: z.string().min(2, {
      message: t('tagNameLength')
    }),
    color: z.string().min(1, {
      message: t('colorRequired')
    })
    // Separate fields for Arabic and English names
  })

export interface Tag {
  id: number
  color: string
  created_at: Date
  updated_at: Date
  translations: {
    id: number
    name: string
    language_id: number
    language: {
      id: number
      name: string
      code: string
    }
  }[]
}

// Remove Language interface since we no longer need language selection

interface TagFormProps {
  initialData: Tag | null
  pageTitle: string
  // Remove languages prop since we no longer need language selection
}

export default function TagForm({
  initialData,
  pageTitle
}: TagFormProps) {
  const router = useRouter()
  const t = useTranslations('TagForm')
  
  const defaultValues = {
    name_en: initialData?.translations?.find(t => t.language.code === 'en')?.name || '',
    name_ar: initialData?.translations?.find(t => t.language.code === 'ar')?.name || '',
    color: initialData?.color || '#3B82F6'
    // Separate fields for Arabic and English names
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
        name_en: values.name_en,
        name_ar: values.name_ar,
        color: values.color
        // Separate names for Arabic and English
      }

      const url = initialData ? `/api/tags/${initialData.id}` : '/api/tags'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        router.push('/dashboard/tags')
      } else {
        const error = await res.json()
        form.setError('root', { message: error.message || 'An error occurred' })
      }
    } catch (error) {
      form.setError('root', { message: 'An error occurred while saving the tag' })
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
              name='name_en'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tag name in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name_ar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم العلامة بالعربية"
                      {...field}
                      dir="rtl"
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
                  <FormLabel>{t('tagColor')}</FormLabel>
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
                onClick={() => router.push('/dashboard/tags')}
              >
                {t('cancel')}
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('saving') : (initialData ? t('updateTag') : t('addTag'))}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
