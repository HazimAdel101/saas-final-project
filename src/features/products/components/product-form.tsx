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
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/constants/mock-api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React, { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { getColorWithOpacity, getFullColor } from '@/lib/utils'
import Image from 'next/image'
import * as z from 'zod'
import { addProduct, getBrandsForSelect, getCategoriesForSelect, getTagsForSelect } from '@/features/products/actions/product-actions'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

// Create form schema function to use translations
const createFormSchema = (t: any, uploadedImageUrl: string) =>
  z.object({
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
    description_en: z.string().min(10, {
      message: t('descriptionLength')
    }),
    description_ar: z.string().min(10, {
      message: t('descriptionLength')
    }),
    price_usd: z.preprocess(
      (val) => {
        if (typeof val === 'string') return parseFloat(val)
        return val
      },
      z.number().min(0, { message: t('priceMinimum') })
    ),
    price_ksa: z.preprocess(
      (val) => {
        if (typeof val === 'string') return parseFloat(val)
        return val
      },
      z.number().min(0, { message: t('priceMinimum') })
    ),
    discount_usd: z.preprocess(
      (val) => {
        if (typeof val === 'string') return parseFloat(val)
        return val
      },
      z.number().min(0).optional()
    ),
    discount_ksa: z.preprocess(
      (val) => {
        if (typeof val === 'string') return parseFloat(val)
        return val
      },
      z.number().min(0).optional()
    ),
    brand_id: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          if (val === 'none') return undefined
          return parseInt(val)
        }
        return val
      },
      z.number().optional()
    ),
    category_ids: z.array(z.number()).min(1, {
      message: 'Please select at least one category'
    }),
    tag_ids: z.array(z.number()).optional()
  })

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null
  pageTitle: string
}) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const t = useTranslations('ProductForm')
  
  const defaultValues = {
    name_en: initialData?.name || '',
    name_ar: '',
    description_en: initialData?.description || '',
    description_ar: '',
    price_usd: initialData?.price || 0,
    price_ksa: 0,
    discount_usd: 0,
    discount_ksa: 0,
    brand_id: undefined,
    category_ids: [],
    tag_ids: []
  }

  // Load relations data
  useEffect(() => {
    const loadRelationsData = async () => {
      try {
        const [brandsData, categoriesData, tagsData] = await Promise.all([
          getBrandsForSelect(),
          getCategoriesForSelect(),
          getTagsForSelect()
        ])
        setBrands(brandsData)
        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error('Failed to load relations data:', error)
        toast.error('Failed to load form data')
      } finally {
        setIsLoading(false)
      }
    }
    loadRelationsData()
  }, [])

  const formSchema = React.useMemo(
    () => createFormSchema(t, uploadedImageUrl),
    [t, uploadedImageUrl]
  )
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
      throw error // This will be caught by the toast in FileUploader
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!uploadedImageUrl) {
      form.setError('image', { message: t('imageRequired') })
      return
    }

    try {
      const payload = {
        name_en: values.name_en,
        name_ar: values.name_ar,
        description_en: values.description_en,
        description_ar: values.description_ar,
        price_usd: values.price_usd,
        price_ksa: values.price_ksa,
        discount_usd: values.discount_usd,
        discount_ksa: values.discount_ksa,
        imageUrl: uploadedImageUrl,
        brand_id: values.brand_id,
        category_ids: values.category_ids,
        tag_ids: values.tag_ids || []
      }

      await addProduct(payload)
      toast.success('Product created successfully!')
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    }
  }

  if (isLoading) {
    return (
      <Card className='mx-auto w-full'>
        <CardHeader>
          <CardTitle className='text-left text-2xl font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading form data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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
                        <Image
                          src={uploadedImageUrl}
                          alt='Uploaded preview'
                          width={80}
                          height={80}
                          className='h-20 w-20 rounded border object-cover'
                        />
                        <p className='text-muted-foreground text-sm'>
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
              <h3 className='text-lg font-semibold'>
                {t('productInformation')}
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name_en'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('productNameEnglish')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('enterProductNameEnglish')}
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
                      <FormLabel>{t('productNameArabic')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('enterProductNameArabic')}
                          dir='rtl'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Brand Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Brand & Relations</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='brand_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Brand</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: brand.color }}
                                />
                                {brand.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Categories Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Categories</h3>
              <FormField
                control={form.control}
                name='category_ids'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Categories *</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map((category) => {
                        const englishTranslation = category.translations?.find((t: any) => t.language.code === 'en')
                        const arabicTranslation = category.translations?.find((t: any) => t.language.code === 'ar')
                        const categoryName = englishTranslation?.name || 'Unnamed Category'
                        
                        return (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), category.id])
                                } else {
                                  field.onChange(field.value?.filter(id => id !== category.id) || [])
                                }
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <Badge
                                variant="outline"
                                style={{ 
                                  backgroundColor: getColorWithOpacity(category.color),
                                  color: getFullColor(category.color),
                                  borderColor: getFullColor(category.color)
                                }}
                              >
                                {categoryName}
                              </Badge>
                              {arabicTranslation && (
                                <span className="text-muted-foreground text-xs">
                                  ({arabicTranslation.name})
                                </span>
                              )}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Tags</h3>
              <FormField
                control={form.control}
                name='tag_ids'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Tags (Optional)</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tags.map((tag) => {
                        const englishTranslation = tag.translations?.find((t: any) => t.language.code === 'en')
                        const arabicTranslation = tag.translations?.find((t: any) => t.language.code === 'ar')
                        const tagName = englishTranslation?.name || 'Unnamed Tag'
                        
                        return (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag.id}`}
                              checked={field.value?.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), tag.id])
                                } else {
                                  field.onChange(field.value?.filter(id => id !== tag.id) || [])
                                }
                              }}
                            />
                            <label
                              htmlFor={`tag-${tag.id}`}
                              className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: tag.color }}
                              />
                              <Badge
                                variant="outline"
                                style={{ 
                                  backgroundColor: getColorWithOpacity(tag.color),
                                  color: getFullColor(tag.color),
                                  borderColor: getFullColor(tag.color)
                                }}
                              >
                                {tagName}
                              </Badge>
                              {arabicTranslation && (
                                <span className="text-muted-foreground text-xs">
                                  ({arabicTranslation.name})
                                </span>
                              )}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>
                {t('categoryAndPricing')}
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
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
                <FormField
                  control={form.control}
                  name='discount_usd'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount USD</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='discount_ksa'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount KSA</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          placeholder="0.00"
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
              <h3 className='text-lg font-semibold'>
                {t('productDescriptions')}
              </h3>
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
                          dir='rtl'
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
