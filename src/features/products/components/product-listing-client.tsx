'use client'
import { Product } from '@/constants/data'
import { ProductTable } from './products-tables'
import { useProductColumns } from './products-tables/columns'

type ProductListingClientProps = {
  products: Product[]
  totalProducts: number
}

export function ProductListingClient({
  products,
  totalProducts
}: ProductListingClientProps) {
  const columns = useProductColumns()
  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  )
}
