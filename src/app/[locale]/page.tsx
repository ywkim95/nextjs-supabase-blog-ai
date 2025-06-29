import { createClient } from '@/lib/supabase/server'
import { getRecentPosts, getPostsCount, getTagsCount } from '@/lib/services/post.service'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { PencilIcon } from '@heroicons/react/24/outline'
import VisitorStats from '@/components/VisitorStats'
import PostCard from '@/components/PostCard'
import { getTranslations } from 'next-intl/server'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')
  const supabase = await createClient()

  const posts = await getRecentPosts(3)
  const totalPosts = await getPostsCount()
  const totalTags = await getTagsCount()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-gray-800 mb-4">
              <PencilIcon className="w-10 h-10 text-orange-600 dark:text-dark-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-dark-primary">{totalPosts || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('postsCount')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-dark-primary">{totalTags || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('tagsCount')}</div>
            </div>
            <VisitorStats />
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              href={`/${locale}/posts`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              {t('viewAllPosts')}
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        {posts && posts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">{t('recentPosts')}</h2>
              <Link
                href={`/${locale}/posts`}
                className="text-orange-600 dark:text-dark-accent hover:text-orange-800 font-medium"
              >
{tCommon('viewAll')} →
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <PencilIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">{t('noPostsTitle')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('noPostsDescription')}</p>
            {user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <Link
                href={`/${locale}/dashboard/posts/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                {t('createPost')}
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
