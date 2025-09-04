'use client'

import { FileUploader } from '@/components/file-uploader'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Product } from '@/constants/mock-api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as z from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

// Create form schema function to use translations
const createFormSchema = (t: any) => z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, t('imageRequired'))
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      t('maxFileSize')
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      t('acceptedFormats')
    ),
  name: z.string().min(2, {
    message: t('productNameLength')
  }),
  category: z.string(),
  language: z.string().nonempty({ message: t('languageRequired') }),
  price: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val)
    return val
  }, z.number()),
  description: z.string().min(10, {
    message: t('descriptionLength')
  })
})

interface Language {
  id: number
  name: string
  code: string
}
export default function ProductForm({
  initialData,
  pageTitle,
  languages
}: {
  initialData: Product | null
  pageTitle: string
  languages: Language[]
}) {
  const [selectedLang, setSelectedLang] = useState<string>(
    languages[0]?.code || 'en'
  )
  const router = useRouter()
  const t = useTranslations('ProductForm')
  const defaultValues = {
    name: initialData?.name || '',
    category: initialData?.category || '',
    language: selectedLang,
    price: initialData?.price || 0,
    description: initialData?.description || ''
  }

  const formSchema = createFormSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Log submission payload for debugging
    // eslint-disable-next-line no-console
    console.log('Submitting product with values:', values)
    const langObj = languages.find((l) => l.code === selectedLang)
    const payload = {
      name: values.name,
      description: values.description,
      languageId: langObj?.id ?? languages[0].id,
      price: values.price,
      imageUrl: '', // TODO: replace with actual uploaded image URL
      company: null
    }
    // Call API to create product
    const res = await fetch('/api/productss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      router.push('/dashboard/productss')
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('language')}</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val)
                        setSelectedLang(val)
                      }}
                      value={selectedLang}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectLanguage')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('productName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enterProductName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value[field.value.length - 1]}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectCategory')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='beauty'>Beauty Products</SelectItem>
                        <SelectItem value='electronics'>Electronics</SelectItem>
                        <SelectItem value='clothing'>Clothing</SelectItem>
                        <SelectItem value='home'>Home & Garden</SelectItem>
                        <SelectItem value='sports'>
                          Sports & Outdoors
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('price')} ({selectedLang === 'en' ? 'USD' : 'KSA'})
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder={t('enterPrice')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('enterProductDescription')}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>{t('addProduct')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
