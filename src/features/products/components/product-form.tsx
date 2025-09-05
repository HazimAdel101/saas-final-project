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
import { useRouter } from '@/i18n/navigation'
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
const createFormSchema = (t: any, uploadedImageUrl: string) => z.object({
  image: z
    .any()
    .optional()
    .superRefine((files, ctx) => {
      // If no uploaded image URL and no files, it's required
      if (!uploadedImageUrl && (!files || files.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('imageRequired')
        })
        return
      }
      
      // If files are present, validate them
      if (files && files.length > 0) {
        if (files.length !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('imageRequired')
          })
        }
        if (files[0]?.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('maxFileSize')
          })
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(files[0]?.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('acceptedFormats')
          })
        }
      }
    }),
  name_en: z.string().min(2, {
    message: t('productNameLength')
  }),
  name_ar: z.string().min(2, {
    message: t('productNameLength')
  }),
  category: z.string(),
  price_usd: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val)
    return val
  }, z.number().min(0, { message: t('priceMinimum') })),
  price_ksa: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val)
    return val
  }, z.number().min(0, { message: t('priceMinimum') })),
  description_en: z.string().min(10, {
    message: t('descriptionLength')
  }),
  description_ar: z.string().min(10, {
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const t = useTranslations('ProductForm')
  const defaultValues = {
    name_en: initialData?.name || '',
    name_ar: '',
    category: initialData?.category || '',
    price_usd: initialData?.price || 0,
    price_ksa: 0,
    description_en: initialData?.description || '',
    description_ar: ''
  }

  const formSchema = React.useMemo(() => createFormSchema(t, uploadedImageUrl), [t, uploadedImageUrl])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  })

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    setIsUploading(true)
    try {
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setUploadedImageUrl(result.url)
    } catch (error) {
      console.error('Upload error:', error)
      throw error // This will be caught by the toast in FileUploader
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Log submission payload for debugging
    // eslint-disable-next-line no-console
    console.log('Submitting product with values:', values)
    
    if (!uploadedImageUrl) {
      form.setError('image', { message: t('imageRequired') })
      return
    }

    const payload = {
      name_en: values.name_en,
      name_ar: values.name_ar,
      description_en: values.description_en,
      description_ar: values.description_ar,
      price_usd: values.price_usd,
      price_ksa: values.price_ksa,
      imageUrl: uploadedImageUrl,
      category: values.category
    }
    
    // Call API to create product
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      router.push('/dashboard/products')
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
                    <FormLabel>{t('productImage')}</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024}
                        accept={{
                          'image/*': ['.jpeg', '.jpg', '.png', '.webp']
                        }}
                        onUpload={handleFileUpload}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {uploadedImageUrl && (
                    <div className='space-y-2'>
                      <p className='text-sm text-green-600'>
                        ✅ Image uploaded successfully
                      </p>
                      <div className='flex items-center space-x-2'>
                        <img 
                          src={uploadedImageUrl} 
                          alt="Uploaded preview" 
                          className='h-20 w-20 object-cover rounded border'
                        />
                        <p className='text-sm text-muted-foreground'>
                          Image will be saved as: {uploadedImageUrl}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />

            {/* Product Names Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>{t('productInformation')}</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name_en'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('productNameEnglish')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enterProductNameEnglish')} {...field} />
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
                      <FormLabel>{t('productNameArabic')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('enterProductNameArabic')} 
                          dir="rtl"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Category and Pricing Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>{t('categoryAndPricing')}</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
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
                  name='price_usd'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('priceUSD')}</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          placeholder={t('enterPriceUSD')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='price_ksa'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('priceKSA')}</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          placeholder={t('enterPriceKSA')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Product Descriptions Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>{t('productDescriptions')}</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='description_en'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('descriptionEnglish')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('enterProductDescriptionEnglish')}
                          className='resize-none'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description_ar'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('descriptionArabic')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('enterProductDescriptionArabic')}
                          className='resize-none'
                          dir="rtl"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type='submit'>{t('addProduct')}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
