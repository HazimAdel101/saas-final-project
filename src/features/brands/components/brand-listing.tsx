'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Brand } from './brand-form'

interface BrandListingProps {
  brands: Brand[]
}

export default function BrandListing({ brands }: BrandListingProps) {
  const t = useTranslations('BrandListing')

  const handleDelete = async (id: number) => {
    if (confirm(t('confirmDelete'))) {
      try {
        const res = await fetch(`/api/brands/${id}`, {
          method: 'DELETE'
        })
        
        if (res.ok) {
          window.location.reload()
        } else {
          alert(t('deleteError'))
        }
      } catch (error) {
        alert(t('deleteError'))
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{t('brands')}</CardTitle>
          <Link href='/dashboard/brands/new'>
            <Button size='sm'>
              <IconPlus className='mr-2 h-4 w-4' />
              {t('addBrand')}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {brands.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>{t('noBrands')}</p>
            <Link href='/dashboard/brands/new'>
              <Button className='mt-4'>
                <IconPlus className='mr-2 h-4 w-4' />
                {t('addFirstBrand')}
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('color')}</TableHead>
                <TableHead>{t('createdAt')}</TableHead>
                <TableHead className='text-right'>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className='font-medium'>{brand.name}</TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <div
                        className='h-4 w-4 rounded-full border'
                        style={{ backgroundColor: brand.color }}
                      />
                      <Badge variant='secondary'>{brand.color}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(brand.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end space-x-2'>
                      <Link href={`/dashboard/brands/${brand.id}/edit`}>
                        <Button variant='outline' size='sm'>
                          <IconEdit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDelete(brand.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <IconTrash className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
