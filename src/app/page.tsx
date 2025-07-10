'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { services, Service } from '@/lib/servicesData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Grid3X3, List } from 'lucide-react';

const filterCategories = [
  { id: 'most-popular', label: 'Most popular' },
  { id: 'premium', label: 'Premium' },
  { id: 'free', label: 'Free' },
  { id: 'recently-added', label: 'Recently added' }
];

export default function Home() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('most-popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredServices = services.filter(
    (service) => service.category === selectedFilter
  );
  const totalResults = filteredServices.length;

  const handleServiceClick = (service: Service) => {
    router.push(`/product/${service.id}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 bg-white/80 shadow-sm backdrop-blur-md'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <div className='flex items-center space-x-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600'>
                  <Star className='h-5 w-5 text-white' />
                </div>
                <span className='text-xl font-bold text-gray-900'>
                  ExclusiveServices
                </span>
              </div>
            </div>
            <div className='hidden items-center space-x-8 md:flex'>
              <a
                href='#services'
                className='text-gray-700 transition-colors hover:text-blue-600'
              >
                Services
              </a>
              <a
                href='#about'
                className='text-gray-700 transition-colors hover:text-blue-600'
              >
                About
              </a>
              <a
                href='#contact'
                className='text-gray-700 transition-colors hover:text-blue-600'
              >
                Contact
              </a>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className='sticky top-16 z-40 border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          {/* Filter Tabs */}
          <div className='mb-6 flex items-center justify-between'>
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
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className='group cursor-pointer border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg'
                onClick={() => handleServiceClick(service)}
              >
                <CardContent className='p-6'>
                  <div className='flex items-start space-x-4'>
                    <div className='flex-shrink-0'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100'>
                        {service.icon}
                      </div>
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-center space-x-2'>
                        <h3 className='text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600'>
                          {service.name}
                        </h3>
                        {service.isPremium && (
                          <Badge
                            variant='secondary'
                            className='bg-blue-100 text-xs text-blue-800'
                          >
                            Premium
                          </Badge>
                        )}
                      </div>

                      <p className='mb-2 text-sm text-gray-500'>
                        {service.usedBy}
                      </p>

                      <p className='mb-4 line-clamp-2 text-sm text-gray-600'>
                        {service.description}
                      </p>

                      <div className='space-y-1'>
                        <div className='text-lg font-bold text-green-600'>
                          {service.discountedPrice} in credits for 1 year
                        </div>
                        <div className='text-sm text-gray-500'>
                          {service.savings}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='mt-16 border-t border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
            <div className='flex items-center space-x-2'>
              <div className='flex h-6 w-6 items-center justify-center rounded-md bg-blue-600'>
                <Star className='h-4 w-4 text-white' />
              </div>
              <span className='text-lg font-semibold text-gray-900'>
                ExclusiveServices
              </span>
            </div>

            <div className='flex items-center space-x-6 text-sm text-gray-600'>
              <a
                href='#privacy'
                className='transition-colors hover:text-gray-900'
              >
                Privacy Policy
              </a>
              <a
                href='#terms'
                className='transition-colors hover:text-gray-900'
              >
                Terms of Service
              </a>
              <a
                href='#support'
                className='transition-colors hover:text-gray-900'
              >
                Support
              </a>
            </div>

            <div className='text-sm text-gray-500'>
              © 2024 ExclusiveServices. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
