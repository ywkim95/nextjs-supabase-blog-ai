import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
export const locales = ['ko', 'en'] as const

export default getRequestConfig(async ({ locale }) => {
  // Validate and provide fallback for locale
  if (!locale || !locales.includes(locale as any)) {
    return {
      locale: 'ko',
      messages: (await import(`../messages/ko.json`)).default
    }
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})