'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export interface NewSubscriptionInput {
  customer_name?: string
  subscription_price?: number
  client_mail?: string
  phone_number?: string
  notes?: string
  start_date: Date
  end_date: Date
  subscription_email: string
  service_id?: number
}

export interface UpdateSubscriptionInput {
  customer_name?: string
  subscription_price?: number
  client_mail?: string
  phone_number?: string
  notes?: string
  start_date: Date
  end_date: Date
  subscription_email: string
  service_id?: number
}

export async function addSubscription(input: NewSubscriptionInput) {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        customer_name: input.customer_name,
        subscription_price: input.subscription_price,
        client_mail: input.client_mail,
        phone_number: input.phone_number,
        notes: input.notes,
        start_date: input.start_date,
        end_date: input.end_date,
        subscription_email: input.subscription_email,
        service_id: input.service_id
      },
      include: {
        service: {
          include: {
            ServiceDetails: {
              include: {
                language: true
              }
            }
          }
        }
      }
    })

    revalidatePath('/dashboard/subscription')
    return subscription
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updateSubscription(id: number, input: UpdateSubscriptionInput) {
  try {
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        customer_name: input.customer_name,
        subscription_price: input.subscription_price,
        client_mail: input.client_mail,
        phone_number: input.phone_number,
        notes: input.notes,
        start_date: input.start_date,
        end_date: input.end_date,
        subscription_email: input.subscription_email,
        service_id: input.service_id
      },
      include: {
        service: {
          include: {
            ServiceDetails: {
              include: {
                language: true
              }
            }
          }
        }
      }
    })

    revalidatePath('/dashboard/subscription')
    return subscription
  } catch (error) {
    throw new Error(`Failed to update subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteSubscription(id: number) {
  try {
    await prisma.subscription.delete({
      where: { id }
    })

    revalidatePath('/dashboard/subscription')
    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getSubscriptions() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        service: {
          include: {
            ServiceDetails: {
              include: {
                language: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    return subscriptions
  } catch (error) {
    throw new Error(`Failed to fetch subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getSubscriptionById(id: number) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            ServiceDetails: {
              include: {
                language: true
              }
            }
          }
        }
      }
    })
    return subscription
  } catch (error) {
    throw new Error(`Failed to fetch subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getActiveSubscriptions() {
  try {
    const now = new Date()
    const subscriptions = await prisma.subscription.findMany({
      where: {
        start_date: { lte: now },
        end_date: { gte: now }
      },
      include: {
        service: {
          include: {
            ServiceDetails: {
              include: {
                language: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    return subscriptions
  } catch (error) {
    throw new Error(`Failed to fetch active subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getExpiredSubscriptions() {
  try {
    const now = new Date()
    const subscriptions = await prisma.subscription.findMany({
      where: {
        end_date: { lt: now }
      },
      include: {
        service: {
          include: {
            ServiceDetails: {
              include: {
                language: true
              }
            }
          }
        }
      },
      orderBy: { end_date: 'desc' }
    })
    return subscriptions
  } catch (error) {
    throw new Error(`Failed to fetch expired subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
