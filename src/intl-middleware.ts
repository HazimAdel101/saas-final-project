import middleware from 'next-intl/middleware';

export default middleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});
