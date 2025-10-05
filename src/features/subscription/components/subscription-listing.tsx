'use client'

import { useState } from 'react'
import { DataTable } from '@/components/ui/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react'
import { format } from 'date-fns'
import { Subscription } from '@prisma/client'

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

interface SubscriptionListingProps {
  subscriptions: SubscriptionWithService[]
}

export default function SubscriptionListing({ subscriptions }: SubscriptionListingProps) {
  const [data, setData] = useState(subscriptions)

  const getServiceName = (subscription: SubscriptionWithService, locale: string = 'en') => {
    if (!subscription.service?.ServiceDetails) return 'No Service'
    
    const serviceDetail = subscription.service.ServiceDetails.find(
      detail => detail.language.code === locale
    )
    return serviceDetail?.name || subscription.service.ServiceDetails[0]?.name || 'No Service'
  }

  const getStatusBadge = (subscription: SubscriptionWithService) => {
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

  const columns: ColumnDef<SubscriptionWithService>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>
    },
    {
      accessorKey: 'customer_name',
      header: 'Customer',
      cell: ({ row }) => {
        const name = row.getValue('customer_name') as string
        return <div>{name || 'N/A'}</div>
      }
    },
    {
      accessorKey: 'subscription_email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('subscription_email') as string
        return <div className="font-mono text-sm">{email}</div>
      }
    },
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const subscription = row.original
        return <div>{getServiceName(subscription)}</div>
      }
    },
    {
      accessorKey: 'subscription_price',
      header: 'Price',
      cell: ({ row }) => {
        const price = row.getValue('subscription_price') as number
        return <div>{price ? `$${price.toFixed(2)}` : 'N/A'}</div>
      }
    },
    {
      accessorKey: 'start_date',
      header: 'Start Date',
      cell: ({ row }) => {
        const date = row.getValue('start_date') as Date
        return <div>{format(new Date(date), 'MMM dd, yyyy')}</div>
      }
    },
    {
      accessorKey: 'end_date',
      header: 'End Date',
      cell: ({ row }) => {
        const date = row.getValue('end_date') as Date
        return <div>{format(new Date(date), 'MMM dd, yyyy')}</div>
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const subscription = row.original
        return getStatusBadge(subscription)
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const subscription = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Navigate to view subscription
                window.location.href = `/en/dashboard/subscription/${subscription.id}`
              }}
            >
              <IconEye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Navigate to edit subscription
                window.location.href = `/en/dashboard/subscription/${subscription.id}/edit`
              }}
            >
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Handle delete
                if (confirm('Are you sure you want to delete this subscription?')) {
                  // Call delete action
                  console.log('Delete subscription:', subscription.id)
                }
              }}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        searchKey="subscription_email"
        searchPlaceholder="Search by email..."
      />
    </div>
  )
}
