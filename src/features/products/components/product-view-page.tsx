import { fakeProducts, Product } from '@/constants/mock-api'
import { notFound } from 'next/navigation'
import ProductForm from './products-form'

type TProductViewPageProps = {
  productId: string
}

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null
  let pageTitle = 'Create New Product'

  if (productId !== 'new') {
    const data = await fakeProducts.getProductById(Number(productId))
    product = data.product as Product
    if (!product) {
      notFound()
    }
    pageTitle = `Edit Product`
  }

  // Define available languages (in real app, fetch from DB or API)
  const languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Arabic', code: 'ar' }
  ]
  return (
    <ProductForm
      initialData={product}
      pageTitle={pageTitle}
      languages={languages}
    />
  )
}
