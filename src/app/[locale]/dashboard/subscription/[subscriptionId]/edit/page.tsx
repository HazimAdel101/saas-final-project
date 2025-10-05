import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSubscriptionById } from '@/features/subscription/actions/subscription-actions'
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import SubscriptionEditForm from '@/features/subscription/components/subscription-edit-form'

interface EditSubscriptionPageProps {
  params: Promise<{ subscriptionId: string }>
}

export async function generateMetadata({ params }: EditSubscriptionPageProps): Promise<Metadata> {
  const { subscriptionId } = await params
  const subscription = await getSubscriptionById(parseInt(subscriptionId))
  
  return {
    title: subscription ? `Edit Subscription #${subscription.id}` : 'Subscription Not Found',
    description: subscription ? `Edit details for subscription #${subscription.id}` : 'Subscription not found'
  }
}

export default async function EditSubscriptionPage({ params }: EditSubscriptionPageProps) {
  const { subscriptionId } = await params
  const subscription = await getSubscriptionById(parseInt(subscriptionId))

  if (!subscription) {
    notFound()
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Edit Subscription #${subscription.id}`}
            description="Update subscription details and information"
          />
        </div>
        <Separator />
        <SubscriptionEditForm subscription={subscription} />
      </div>
    </PageContainer>
  )
}
