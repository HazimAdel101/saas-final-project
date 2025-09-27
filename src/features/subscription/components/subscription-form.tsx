'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { subscriptionSchema, type SubscriptionFormValues } from '../utils/subscription-schema'
import { Loader2 } from 'lucide-react'

// This will be populated from the database
const serviceTypes = [
  { value: 1, label: 'Basic Plan' },
  { value: 2, label: 'Premium Plan' },
  { value: 3, label: 'Enterprise Plan' },
  { value: 4, label: 'Custom Plan' }
]

export default function SubscriptionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      start_date: '',
      end_date: '',
      subscription_email: '',
      service_id: 0,
      customer_name: '',
      subscription_price: '',
      client_mail: '',
      phone_number: '',
      notes: ''
    }
  })

  const onSubmit = async (values: SubscriptionFormValues) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setSubmitStatus('success')
        form.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting subscription:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>New Subscription</CardTitle>
          <CardDescription>
            Fill out the form below to create a new subscription. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               {/* Required Fields Section */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold">Required Information</h3>
                 
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
                   name="subscription_email"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Subscription Email *</FormLabel>
                       <FormControl>
                         <Input type="email" placeholder="subscription@example.com" {...field} />
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
                       <FormLabel>Service *</FormLabel>
                       <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder="Select service" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {serviceTypes.map((type) => (
                             <SelectItem key={type.value} value={type.value.toString()}>
                               {type.label}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

               {/* Optional Fields Section */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold">Optional Information</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="customer_name"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Customer Name</FormLabel>
                         <FormControl>
                           <Input placeholder="John Doe" {...field} />
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
                         <FormLabel>Subscription Price</FormLabel>
                         <FormControl>
                           <Input placeholder="100.00" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="client_mail"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Client Email</FormLabel>
                         <FormControl>
                           <Input type="email" placeholder="client@example.com" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   <FormField
                     control={form.control}
                     name="phone_number"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Phone Number</FormLabel>
                         <FormControl>
                           <Input placeholder="+967780065525" {...field} />
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
                           placeholder="Additional notes or comments..." 
                           className="min-h-[100px]"
                           {...field} 
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

              {/* Submit Button and Status */}
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Subscription...
                    </>
                  ) : (
                    'Create Subscription'
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">
                      Subscription created successfully!
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">
                      Failed to create subscription. Please try again.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
