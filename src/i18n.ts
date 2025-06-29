import { getRequestConfig } from 'next-intl/server'

export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Assumes that the middleware validates the locale
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  }
})