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
import { Tag } from './tag-form'
import { getColorWithOpacity, getFullColor } from '@/lib/utils'

interface TagListingProps {
  tags: Tag[]
}

export default function TagListing({ tags }: TagListingProps) {
  const t = useTranslations('TagListing')

  const handleDelete = async (id: number) => {
    if (confirm(t('confirmDelete'))) {
      try {
        const res = await fetch(`/api/tags/${id}`, {
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
          <CardTitle>{t('tags')}</CardTitle>
          <Link href='/dashboard/tags/new'>
            <Button size='sm'>
              <IconPlus className='mr-2 h-4 w-4' />
              {t('addTag')}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>{t('noTags')}</p>
            <Link href='/dashboard/tags/new'>
              <Button className='mt-4'>
                <IconPlus className='mr-2 h-4 w-4' />
                {t('addFirstTag')}
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('language')}</TableHead>
                <TableHead>{t('color')}</TableHead>
                <TableHead>{t('createdAt')}</TableHead>
                <TableHead className='text-right'>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => {
                // Get the English translation (or first available translation)
                const englishTranslation = tag.translations.find(t => t.language.code === 'en') || tag.translations[0]
                const arabicTranslation = tag.translations.find(t => t.language.code === 'ar')
                
                return (
                  <TableRow key={tag.id}>
                    <TableCell className='font-medium'>
                      <div className='space-y-1'>
                        <div>{englishTranslation?.name || 'N/A'}</div>
                        {arabicTranslation && (
                          <div className='text-sm text-muted-foreground' dir='rtl'>
                            {arabicTranslation.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        {tag.translations.map((translation) => (
                          <Badge key={translation.id} variant='outline' className='mr-1'>
                            {translation.language.name} ({translation.language.code})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <div
                          className='h-4 w-4 rounded-full border'
                          style={{ backgroundColor: tag.color }}
                        />
                        <Badge 
                          variant='secondary'
                          style={{ 
                            backgroundColor: getColorWithOpacity(tag.color),
                            color: getFullColor(tag.color)
                          }}
                        >
                          {tag.color}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(tag.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end space-x-2'>
                        <Link href={`/dashboard/tags/${tag.id}/edit`}>
                          <Button variant='outline' size='sm'>
                            <IconEdit className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDelete(tag.id)}
                          className='text-red-600 hover:text-red-700'
                        >
                          <IconTrash className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
