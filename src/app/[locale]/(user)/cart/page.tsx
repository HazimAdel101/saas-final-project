'use client'

import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
  const t = useTranslations('Cart')
  const params = useParams()
  const locale = params.locale as string || 'en'

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  return (
    <PageContainer>
      <div className="space-y-6 w-full mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('continueShopping')}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{t('shoppingCart')}</h1>
              <p className="text-muted-foreground">
                {totalItems} {totalItems === 1 ? t('item') : t('items')} {t('inCart')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/${locale}/dashboard/products`}>
              <Button variant="outline" size="sm">
                {t('browseProducts')}
              </Button>
            </Link>
          </div>
        </div>

        <Separator />

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <ShoppingCart className="h-24 w-24 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{t('emptyCart')}</h2>
              <p className="text-muted-foreground max-w-md">
                {t('emptyCartDescription')}
              </p>
            </div>
            <div className="flex gap-4">
              <Link href={`/${locale}`}>
                <Button>
                  {t('continueShopping')}
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard/products`}>
                <Button variant="outline">
                  {t('browseProducts')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image_url || '/logo.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDecrement(item.id, item.quantity)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleIncrement(item.id, item.quantity)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>{t('subtotal')} ({totalItems} {totalItems === 1 ? t('item') : t('items')})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('shipping')}</span>
                    <span className="text-muted-foreground">{t('calculatedAtCheckout')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('tax')}</span>
                    <span className="text-muted-foreground">{t('calculatedAtCheckout')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t('total')}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
                {t('proceedToCheckout')}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
{t('clearCart')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
