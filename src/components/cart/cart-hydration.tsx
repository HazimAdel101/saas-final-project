'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/cart-store'

export function CartHydration() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Force hydration of the store
    useCartStore.persist.rehydrate()
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return null
}
