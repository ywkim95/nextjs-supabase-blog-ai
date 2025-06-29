import { getRequestConfig } from 'next-intl/server'

export const locales = ['ko', 'en'] as const

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locale && locales.includes(locale as any) ? locale : 'ko'
  
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  }
})