import { useTranslations } from 'next-intl'

export function useCategoryOptions() {
  const t = useTranslations('CategoryOptions')
  return [
    { value: 'Electronics', label: t('electronics') },
    { value: 'Furniture', label: t('furniture') },
    { value: 'Clothing', label: t('clothing') },
    { value: 'Toys', label: t('toys') },
    { value: 'Groceries', label: t('groceries') },
    { value: 'Books', label: t('books') },
    { value: 'Jewelry', label: t('jewelry') },
    { value: 'Beauty Products', label: t('beautyProducts') }
  ]
}
