'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Star,
  Check,
  ShoppingCart,
  CreditCard,
  Shield,
  Clock,
  Award,
  Users2
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  company: string;
  usedBy: string;
  category: string;
  isPremium: boolean;
  originalPrice: string;
  discountedPrice: string;
  savings: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  terms?: string;
  deliveryTime: string;
  rating: number;
  reviews: number;
}

interface ProductDetailsClientProps {
  service: Service;
}

export default function ProductDetailsClient({
  service
}: ProductDetailsClientProps) {

  const handlePurchase = () => {
    alert(`Redirecting to secure checkout for ${service.name}...`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Header */}
            <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm'>
              <div className='mb-6 flex items-start space-x-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-gray-50'>
                  {service.icon}
                </div>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center space-x-3'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                      {service.name}
                    </h1>
                    {service.isPremium && (
                      <Badge className='bg-blue-100 text-blue-800'>
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className='mb-2 text-gray-600'>by {service.company}</p>
                  <div className='flex items-center space-x-4 text-sm text-gray-500'>
                    <span className='flex items-center'>
                      <Users2 className='mr-1 h-4 w-4' />
                      {service.usedBy}
                    </span>
                    <span className='flex items-center'>
                      <Star className='mr-1 h-4 w-4 text-yellow-400' />
                      {service.rating} ({service.reviews} reviews)
                    </span>
                    <span className='flex items-center'>
                      <Clock className='mr-1 h-4 w-4' />
                      {service.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>

              <p className='text-lg leading-relaxed text-gray-700'>
                {service.longDescription}
              </p>
            </div>

            {/* Features */}
            <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                What&apos;s Included
              </h2>
              <div className='grid gap-4 md:grid-cols-2'>
                {service.features.map((feature, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                    <span className='text-gray-700'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                Key Benefits
              </h2>
              <div className='grid gap-4 md:grid-cols-2'>
                {service.benefits.map((benefit, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <Award className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500' />
                    <span className='text-gray-700'>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            {service.terms && (
              <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900'>
                  Terms & Conditions
                </h2>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <p className='text-gray-700'>{service.terms}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Card */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24'>
              <Card className='border-0 bg-white shadow-lg'>
                <CardContent className='p-8'>
                  {/* Pricing */}
                  <div className='mb-6 text-center'>
                    <div className='mb-2 flex items-center justify-center space-x-2'>
                      <span className='text-3xl font-bold text-gray-400 line-through'>
                        {service.originalPrice}
                      </span>
                      <Badge className='bg-red-100 text-red-800'>50% OFF</Badge>
                    </div>
                    <div className='mb-2 text-5xl font-bold text-green-600'>
                      {service.discountedPrice}
                    </div>
                    <p className='text-gray-600'>One-time payment</p>
                    <div className='mt-4 rounded-lg bg-green-50 p-3 text-green-700'>
                      <span className='font-semibold'>{service.savings}</span>
                    </div>
                  </div>

                  {/* Purchase Buttons */}
                  <div className='mb-6 space-y-3'>
                    <Button
                      onClick={handlePurchase}
                      className='w-full bg-blue-600 py-3 text-lg hover:bg-blue-700'
                      size='lg'
                    >
                      <ShoppingCart className='mr-2 h-5 w-5' />
                      Buy Now
                    </Button>
                    <Button
                      variant='outline'
                      className='w-full py-3 text-lg'
                      size='lg'
                    >
                      <CreditCard className='mr-2 h-5 w-5' />
                      Add to Cart
                    </Button>
                  </div>

                  {/* Security Features */}
                  <div className='space-y-3 text-sm text-gray-600'>
                    <div className='flex items-center space-x-2'>
                      <Shield className='h-4 w-4 text-green-500' />
                      <span>Secure payment processing</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Check className='h-4 w-4 text-green-500' />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Clock className='h-4 w-4 text-green-500' />
                      <span>Instant access after purchase</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className='mt-6 border-t border-gray-200 pt-6'>
                    <h3 className='mb-2 font-semibold text-gray-900'>
                      Delivery Information
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Project will be delivered within {service.deliveryTime}.
                      You&apos;ll receive regular updates on progress.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
