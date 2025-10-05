import { Metadata } from 'next'
import SubscriptionForm from '@/features/subscription/components/subscription-form'
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'New Subscription',
  description: 'Create a new subscription for our services'
}

export default function NewSubscriptionPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create New Subscription'
            description='Fill out the form below to create a new subscription'
          />
        </div>
        <Separator />
        <SubscriptionForm />
      </div>
    </PageContainer>
  )
}
