import { CartItem } from '@/stores/cart-store'

export interface OrderSummary {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  paymentMethod: 'USDT' | 'PayPal'
}

export function generateWhatsAppMessage(orderSummary: OrderSummary): string {
  const { items, totalItems, totalPrice, paymentMethod } = orderSummary
  
  let message = `🛒 *New Order Request*\n\n`
  message += `📋 *Order Details:*\n`
  message += `• Total Items: ${totalItems}\n`
  message += `• Payment Method: ${paymentMethod}\n`
  message += `• Total Amount: $${totalPrice.toFixed(2)}\n\n`
  
  message += `📦 *Items in Order:*\n`
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`
    message += `   Price: $${item.price.toFixed(2)}\n`
    message += `   Quantity: ${item.quantity}\n`
    message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`
  })
  
  message += `💰 *Payment Information:*\n`
  message += `• Selected Method: ${paymentMethod}\n`
  message += `• Total Amount: $${totalPrice.toFixed(2)}\n\n`
  
  message += `Please contact the customer to complete the payment process.`
  
  return message
}

export function generateWhatsAppURL(message: string, phoneNumber: string = '+967780065525'): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`
}

export function openWhatsApp(orderSummary: OrderSummary, phoneNumber: string = '+967780065525'): void {
  const message = generateWhatsAppMessage(orderSummary)
  const url = generateWhatsAppURL(message, phoneNumber)
  window.open(url, '_blank')
}
