'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { openWhatsApp } from '@/lib/whatsapp-utils'
import { Icon } from '@iconify/react'

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCartStore()
  
  const [isClient, setIsClient] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'USDT' | 'PayPal' | null>(null)
  const t = useTranslations('Cart')

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
{t('shoppingCart')} ({totalItems} {totalItems === 1 ? t('item') : t('items')})
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-semibold">{t('emptyCart')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('emptyCartDescription')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg border p-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.image_url || '/logo.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium leading-none">{item.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDecrement(item.id, item.quantity)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleIncrement(item.id, item.quantity)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('subtotal')} ({totalItems} {totalItems === 1 ? t('item') : t('items')})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>{t('total')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t('paymentMethods')}</h4>
                <RadioGroup
                  value={selectedPaymentMethod || ''}
                  onValueChange={(value) => setSelectedPaymentMethod(value as 'USDT' | 'PayPal')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="USDT" id="usdt-drawer" />
                    <Label htmlFor="usdt-drawer" className="flex items-center gap-2 cursor-pointer text-sm">
                      <Icon icon="cryptocurrency:usdt" className="size-4" />
                      {t('usdt')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="PayPal" id="paypal-drawer" />
                    <Label htmlFor="paypal-drawer" className="flex items-center gap-2 cursor-pointer text-sm">
                      <Icon icon="logos:paypal" className="size-4" />
                      {t('paypal')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={!selectedPaymentMethod}
                >
                  {t('whatsappMessage')}
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
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
