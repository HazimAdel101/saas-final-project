'use client'

import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { openWhatsApp } from '@/lib/whatsapp-utils'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCartStore()

  const [isClient, setIsClient] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'USDT' | 'PayPal' | null>(null)
  const t = useTranslations('Cart')
  const params = useParams()
  const locale = (params.locale as string) || 'en'

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <PageContainer>
        <div className='flex-center size-full'>
          <div className='border-primary size-8 animate-spin rounded-full border-b-2'></div>
        </div>
      </PageContainer>
    )
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleIncrement = (id: number, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1)
  }

  const handleDecrement = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1)
    } else {
      removeItem(id)
    }
  }

  const handleProceedToPayment = () => {
    if (!selectedPaymentMethod) {
      alert(t('selectPaymentMethod'))
      return
    }

    const orderSummary = {
      items,
      totalItems,
      totalPrice,
      paymentMethod: selectedPaymentMethod
    }

    // Replace with your actual WhatsApp number
    const whatsappNumber = '+967780065525' // Update this with your actual WhatsApp number
    openWhatsApp(orderSummary, whatsappNumber)
  }

  return (
    <PageContainer>
      <div className='mt-12 w-full space-y-6'>
        <div className='mt-2 mb-0 flex items-center justify-start rtl:flex-row-reverse'>
          <Link href={`/${locale}`}>
            <Icon
              icon='prime:angle-left'
              className='hover:bg-primary/10 size-12 rtl:rotate-180 rounded-full'
            />
          </Link>
          <div>
            <h1 className='font-title'>{t('shoppingCart')}</h1>
          </div>
        </div>

        <Separator />

        {items.length === 0 ? (
          <div className='flex-col-center space-y-4 py-16'>
            <ShoppingCart className='text-muted-foreground size-24' />
            <div className='space-y-2 text-center'>
              <h2 className='font-subtitle'>{t('emptyCart')}</h2>
              <p className='text-muted-foreground max-w-md'>
                {t('emptyCartDescription')}
              </p>
            </div>
            <div className='flex gap-4 rtl:flex-row-reverse'>
              <Link href={`/${locale}`}>
                <Button>{t('continueShopping')}</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 rtl:lg:grid-flow-col-dense'>
            {/* Cart Items */}
            <div className='space-y-4 lg:col-span-2 rtl:lg:col-start-2'>
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className='p-6'>
                    <div className='flex gap-4 rtl:flex-row-reverse'>
                      <div className='relative size-24 flex-shrink-0 overflow-hidden rounded-md'>
                        <Image
                          src={item.image_url || '/logo.svg'}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='flex-1 space-y-2'>
                        <h3 className='text-lg font-semibold'>{item.name}</h3>
                        <p className='text-muted-foreground line-clamp-2 text-sm'>
                          {item.description}
                        </p>
                        <div className='flex items-center justify-between rtl:flex-row-reverse'>
                          <span className='text-lg font-bold'>
                            ${item.price.toFixed(2)}
                          </span>
                          <div className='flex items-center gap-3 rtl:flex-row-reverse'>
                            <div className='flex items-center gap-1 rtl:flex-row-reverse'>
                              <Button
                                variant='outline'
                                size='icon'
                                className='size-8'
                                onClick={() =>
                                  handleIncrement(item.id, item.quantity)
                                }
                              >
                                <Plus className='size-4' />
                              </Button>
                              <span className='w-8 text-center font-caption'>
                                {item.quantity}
                              </span>
                              <Button
                                variant='outline'
                                size='icon'
                                className='size-8'
                                onClick={() =>
                                  handleDecrement(item.id, item.quantity)
                                }
                              >
                                <Minus className='size-4' />
                              </Button>
                            </div>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive hover:text-destructive size-8'
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className='space-y-4 rtl:lg:col-start-1'>
              <Card>
                <CardHeader>
                  <CardTitle>{t('orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Product Breakdown */}
                  <div className='space-y-3'>
                    <h4 className='text-sm font-medium text-muted-foreground'>{t('items')}</h4>
                    {items.map((item) => (
                      <div key={item.id} className='flex justify-between items-start text-sm rtl:flex-row-reverse'>
                        <div className='flex-1 rtl:pl-2 rtl:pr-0'>
                          <div className='font-medium'>{item.name}</div>
                          <div className='text-muted-foreground text-xs'>
                            ${item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div className='font-medium'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className='flex justify-between text-sm rtl:flex-row-reverse'>
                    <span>
                      {t('subtotal')} ({totalItems}{' '}
                      {totalItems === 1 ? t('item') : t('items')})
                    </span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm rtl:flex-row-reverse'>
                    <span>{t('shipping')}</span>
                    <span className='text-muted-foreground'>
                      {t('calculatedAtCheckout')}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm rtl:flex-row-reverse'>
                    <span>{t('tax')}</span>
                    <span className='text-muted-foreground'>
                      {t('calculatedAtCheckout')}
                    </span>
                  </div>
                  <Separator />
                  <div className='flex justify-between text-lg font-semibold rtl:flex-row-reverse'>
                    <span>{t('total')}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('paymentMethods')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedPaymentMethod || ''}
                    onValueChange={(value) => setSelectedPaymentMethod(value as 'USDT' | 'PayPal')}
                    className='space-y-3'
                  >
                    <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                      <RadioGroupItem value='USDT' id='usdt' />
                      <Label htmlFor='usdt' className='flex items-center gap-2 cursor-pointer'>
                        <Icon icon='cryptocurrency:usdt' className='size-5' />
                        {t('usdt')}
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                      <RadioGroupItem value='PayPal' id='paypal' />
                      <Label htmlFor='paypal' className='flex items-center gap-2 cursor-pointer'>
                        <Icon icon='logos:paypal' className='size-5' />
                        {t('paypal')}
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button 
                className='w-full' 
                size='lg' 
                onClick={handleProceedToPayment}
                disabled={!selectedPaymentMethod}
              >
                {t('whatsappMessage')}
              </Button>

              <Button variant='outline' className='w-full' onClick={clearCart}>
                {t('clearCart')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
