import { getPostBySlug, getCommentsByPostId } from '@/lib/services/post.service'
import Navbar from '@/components/Navbar'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { calculateReadingTime, formatReadingTime, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { ClockIcon, TagIcon } from '@heroicons/react/24/outline'
import type { PostWithAuthor, CommentWithAuthor } from '@/lib/supabase/database.types'
import CommentsSection from '@/components/CommentsSection'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const comments = await getCommentsByPostId(post.id)

  // Extract tags and calculate reading time
  const postTags = (post as any).post_tags?.map((pt: any) => pt.tags.name) || []
  const readingTime = post.content ? calculateReadingTime(post.content) : 1

  const TagsSection = () => (
    <>
      {postTags.length > 0 && (
        <div className="py-4 border-y border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-wrap gap-2">
            <TagIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {postTags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-dark-primary dark:text-dark-background"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <Navbar />
      <main>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* Title First */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
              {post.title}
            </h1>

            {/* Author Info, Date, Reading Time */}
            <div className="flex items-center justify-end mb-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className="ml-4 text-right">
                  <p className="text-base font-medium text-gray-900 dark:text-gray-200">
                    {post.profiles?.username}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatReadingTime(readingTime)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="h-12 w-12 rounded-full bg-orange-500 dark:bg-dark-secondary flex items-center justify-center">
                    <span className="text-lg font-medium text-white dark:text-dark-background">
                      {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <TagsSection />

            {/* Content */}
            <div className="mt-6 prose dark:prose-invert max-w-none">
              {post.content && (
                <MarkdownRenderer 
                  content={post.content}
                />
              )}
            </div>

            <div className="mt-6">
              <TagsSection />
            </div>
          </div>
        </article>

        <CommentsSection postId={post.id} initialComments={comments} />
      </div>
      </main>
    </div>
  )
}