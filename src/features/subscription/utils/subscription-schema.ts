import * as z from 'zod'

export const subscriptionSchema = z.object({
  // Required fields
  start_date: z
    .string()
    .min(1, { message: 'Start date is required' })
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Start date should be in the format YYYY-MM-DD'
    }),
  end_date: z
    .string()
    .min(1, { message: 'End date is required' })
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'End date should be in the format YYYY-MM-DD'
    }),
  subscription_email: z
    .string()
    .min(1, { message: 'Subscription email is required' })
    .email({ message: 'Please enter a valid email address' }),
  service_id: z
    .number()
    .min(1, { message: 'Service is required' }),

  // Optional fields
  customer_name: z
    .string()
    .optional(),
  subscription_price: z
    .string()
    .optional(),
  client_mail: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .optional()
    .or(z.literal('')),
  phone_number: z
    .string()
    .optional(),
  notes: z
    .string()
    .optional()
}).refine((data) => {
  // Validate that end_date is after start_date
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    return endDate > startDate
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['end_date']
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>
