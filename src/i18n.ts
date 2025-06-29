import { getRequestConfig } from 'next-intl/server'

export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]

function isValidLocale(locale: any): locale is Locale {
  return locales.includes(locale)
}

export default getRequestConfig(async ({ locale }) => {
  const baseLocale = isValidLocale(locale) ? locale : 'ko'
  
  return {
    locale: baseLocale,
    messages: (await import(`../messages/${baseLocale}.json`)).default
  }
})