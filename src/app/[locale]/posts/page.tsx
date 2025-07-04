import { getAllPosts } from "@/lib/services/post.service";
import PostList from "@/components/PostList";
import NoPosts from "@/components/NoPosts";
import { getTranslations } from 'next-intl/server';
import { PencilIcon } from '@heroicons/react/24/solid';

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
            <PostList posts={posts} />
          ) : (
            <NoPosts
              icon={<PencilIcon className="h-12 w-12 text-gray-400" />}
              title={t('noPosts')}
              description={t('noPostsDescription')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
