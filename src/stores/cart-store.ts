import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  description: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

interface CartActions {
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItem: (productId: number) => CartItem | undefined
  setIsOpen: (isOpen: boolean) => void
  toggleCart: () => void
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,

      // Actions
      addItem: (product) => {
        const existingItem = get().items.find(item => item.id === product.id)
        
        if (existingItem) {
          // If item exists, increment quantity
          set((state) => ({
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }))
        } else {
          // If new item, add with quantity 1
          set((state) => ({
            items: [...state.items, { ...product, quantity: 1 }]
          }))
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getItem: (productId) => {
        return get().items.find(item => item.id === productId)
      },

      setIsOpen: (isOpen) => {
        set({ isOpen })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      }
    }),
    {
      name: 'cart-store',
      skipHydration: true // Important for SSR
    }
  )
)
