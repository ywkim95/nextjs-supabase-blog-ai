import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/solid'
import { getRecentPosts, getPostsCount, getTagsCount } from '@/lib/services/post.service'
import PostCard from '@/components/PostCard'
import VisitorStats from '@/components/VisitorStats'
import PostList from '@/components/PostList'
import NoPosts from '@/components/NoPosts'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  
  try {
    const t = await getTranslations({ locale, namespace: 'home' })
    const recentPosts = await getRecentPosts(3)
    const postsCount = await getPostsCount()
    const tagsCount = await getTagsCount()
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-6">
                <PencilIcon className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                {t('subtitle')}
              </p>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">{postsCount}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalPosts')}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-dark-text">{tagsCount}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalTags')}</p>
                </div>
                <VisitorStats />
              </div>

              <Link
                href={`/${locale}/posts`}
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {t('viewAllPosts')}
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">{t('recentPosts')}</h2>
            <Link
              href={`/${locale}/posts`}
              className="text-orange-600 dark:text-dark-accent hover:text-orange-500 font-medium"
            >
              {t('viewAll')} →
            </Link>
          </div>

          {recentPosts && recentPosts.length > 0 ? (
            <PostList posts={recentPosts} />
          ) : (
            <NoPosts
              icon={<PencilIcon className="h-12 w-12 text-gray-400" />}
              title={t('noPosts')}
              description={t('noPostsDescription')}
            />
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in Home component:', error)
    console.error('Error details:', {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      stack: (error as Error)?.stack,
      locale: locale
    })
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Translation Error
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Failed to load translations
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Current locale: {locale}
            </p>
            <p className="mt-2 text-sm text-red-500">
              Error: {String(error)}
            </p>
          </div>
        </div>
      </div>
    )
  }
}