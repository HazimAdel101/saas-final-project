'use client'

import { useState } from 'react'

import { services } from '@/lib/servicesData'
import { Button } from '@/components/ui/button'
import { Grid3X3, List } from 'lucide-react'
import ProductCard from '@/components/product-card'
import Link from 'next/link'

const filterCategories = [
  { id: 'most-popular', label: 'Most popular' },
  { id: 'premium', label: 'Premium' },
  { id: 'free', label: 'Free' },
  { id: 'recently-added', label: 'Recently added' }
]

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('most-popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredServices = services.filter(
    (service) => service.category === selectedFilter
  )
  const totalResults = filteredServices.length

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='sticky top-16 z-40 border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
          {/* Filter Tabs */}
          <div className='flex items-center justify-between'>
            <div className='flex space-x-1'>
              {filterCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedFilter === category.id ? 'default' : 'ghost'}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selectedFilter === category.id
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSelectedFilter(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-500'>
                1 to {totalResults} of {services.length} results
              </span>
              <div className='flex items-center space-x-1'>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  className='p-2'
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  className='p-2'
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className='flex-1 overflow-y-auto'>
        <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredServices.map((service) => (
              <Link key={service.id} href={`/products/${service.id}`}>
                  <ProductCard
                    name={service.name}
                    image={'/products/canva.jpeg'}
                    isPremium={service.isPremium}
                    originalPrice={service.originalPrice}
                    discountedPrice={service.discountedPrice}
                    savings={service.savings}
                    description={service.description}
                  />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
