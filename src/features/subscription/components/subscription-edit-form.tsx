'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { subscriptionSchema } from '@/features/subscription/utils/subscription-schema'
import { updateSubscription } from '@/features/subscription/actions/subscription-actions'
import { getProducts } from '@/features/products/actions/product-actions'
import { Subscription } from '@prisma/client'
import { toast } from 'sonner'

interface SubscriptionWithService extends Subscription {
  service?: {
    ServiceDetails: Array<{
      name: string
      language: {
        code: string
      }
    }>
  } | null
}

interface SubscriptionEditFormProps {
  subscription: SubscriptionWithService
}

export default function SubscriptionEditForm({ subscription }: SubscriptionEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  // Load products on component mount
  useState(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    loadProducts()
  })

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      customer_name: subscription.customer_name || '',
      subscription_price: subscription.subscription_price?.toString() || '',
      client_mail: subscription.client_mail || '',
      phone_number: subscription.phone_number || '',
      notes: subscription.notes || '',
      start_date: format(new Date(subscription.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(subscription.end_date), 'yyyy-MM-dd'),
      subscription_email: subscription.subscription_email,
      service_id: subscription.service_id || undefined,
    },
  })

  const onSubmit = async (values: z.infer<typeof subscriptionSchema>) => {
    setIsLoading(true)
    try {
      await updateSubscription(subscription.id, {
        customer_name: values.customer_name,
        subscription_price: values.subscription_price ? parseFloat(values.subscription_price) : undefined,
        client_mail: values.client_mail,
        phone_number: values.phone_number,
        notes: values.notes,
        start_date: new Date(values.start_date),
        end_date: new Date(values.end_date),
        subscription_email: values.subscription_email,
        service_id: values.service_id,
      })
      
      toast.success('Subscription updated successfully')
      router.push('/en/dashboard/subscription')
      router.refresh()
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Failed to update subscription')
    } finally {
      setIsLoading(false)
    }
  }

  const getServiceName = (serviceId: number) => {
    const product = products.find(p => p.id === serviceId)
    if (!product?.ServiceDetails) return 'Unknown Service'
    
    const serviceDetail = product.ServiceDetails.find(
      detail => detail.language.code === 'en'
    )
    return serviceDetail?.name || product.ServiceDetails[0]?.name || 'Unknown Service'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscription_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subscription_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="subscription@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_mail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="client@example.com" 
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
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {getServiceName(product.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional notes about this subscription..." 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Subscription'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
