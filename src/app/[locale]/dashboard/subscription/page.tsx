import { Metadata } from 'next'
import SubscriptionForm from '@/features/subscription/components/subscription-form'

export const metadata: Metadata = {
  title: 'New Subscription',
  description: 'Create a new subscription for our services'
}

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to create a new subscription
          </p>
        </div>
        <SubscriptionForm />
      </div>
    </div>
  )
}
