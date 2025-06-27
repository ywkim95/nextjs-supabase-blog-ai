import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// A list of all supported locales.
const locales = ['en', 'ko'];

export default getRequestConfig(async ({locale}) => {
  // This function is called for every request that requires translations.
  // We validate that the incoming `locale` parameter is valid.
  // If the locale is not in our list of supported locales, we show a 404 page.
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // If the locale is valid, we import and return the corresponding messages.
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
