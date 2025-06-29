import { getAllPosts } from "@/lib/services/post.service";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

interface PostsPageProps {
  params: Promise<{ locale: string }>
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params
  const posts = await getAllPosts();
  const t = await getTranslations({ locale, namespace: 'posts' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <main>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">{t('title')}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
                {t('noPosts')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{t('noPostsDescription')}</p>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                {t('getStarted')}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
