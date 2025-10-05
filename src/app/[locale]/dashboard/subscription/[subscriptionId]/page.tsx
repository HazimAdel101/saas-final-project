import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSubscriptionById } from '@/features/subscription/actions/subscription-actions'
import PageContainer from '@/components/layout/page-container'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { IconEdit, IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

interface SubscriptionPageProps {
  params: Promise<{ subscriptionId: string }>
}

export async function generateMetadata({ params }: SubscriptionPageProps): Promise<Metadata> {
  const { subscriptionId } = await params
  const subscription = await getSubscriptionById(parseInt(subscriptionId))
  
  return {
    title: subscription ? `Subscription #${subscription.id}` : 'Subscription Not Found',
    description: subscription ? `View details for subscription #${subscription.id}` : 'Subscription not found'
  }
}

export default async function SubscriptionPage({ params }: SubscriptionPageProps) {
  const { subscriptionId } = await params
  const subscription = await getSubscriptionById(parseInt(subscriptionId))

  if (!subscription) {
    notFound()
  }

  const getServiceName = (locale: string = 'en') => {
    if (!subscription.service?.ServiceDetails) return 'No Service'
    
    const serviceDetail = subscription.service.ServiceDetails.find(
      detail => detail.language.code === locale
    )
    return serviceDetail?.name || subscription.service.ServiceDetails[0]?.name || 'No Service'
  }

  const getStatusBadge = () => {
    const now = new Date()
    const startDate = new Date(subscription.start_date)
    const endDate = new Date(subscription.end_date)

    if (now < startDate) {
      return <Badge variant="secondary">Pending</Badge>
    } else if (now >= startDate && now <= endDate) {
      return <Badge variant="default">Active</Badge>
    } else {
      return <Badge variant="destructive">Expired</Badge>
    }
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <div className="flex items-center gap-4">
            <Link href="/en/dashboard/subscription">
              <Button variant="ghost" size="sm">
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back to Subscriptions
              </Button>
            </Link>
            <div>
              <Heading
                title={`Subscription #${subscription.id}`}
                description="View subscription details and information"
              />
            </div>
          </div>
          <Link href={`/en/dashboard/subscription/${subscription.id}/edit`}>
            <Button>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Subscription
            </Button>
          </Link>
        </div>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge()}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span>{getServiceName()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span>{subscription.subscription_price ? `$${subscription.subscription_price.toFixed(2)}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{format(new Date(subscription.start_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{format(new Date(subscription.end_date), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Name:</span>
                  <span>{subscription.customer_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-mono text-sm">{subscription.subscription_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client Email:</span>
                  <span className="font-mono text-sm">{subscription.client_mail || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{subscription.phone_number || 'N/A'}</span>
                </div>
              </div>
            </div>

            {subscription.notes && (
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Notes</h3>
                <p className="text-muted-foreground">{subscription.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
