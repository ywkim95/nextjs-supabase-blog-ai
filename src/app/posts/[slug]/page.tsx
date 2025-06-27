import { getPostBySlug, getCommentsByPostId } from '@/lib/services/post.service'
import Layout from '@/components/Layout'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { calculateReadingTime, formatReadingTime, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { ClockIcon, TagIcon } from '@heroicons/react/24/outline'
import type { PostWithAuthor, CommentWithAuthor } from '@/lib/supabase/database.types'

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <article className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* Title First */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Author Info, Date, Reading Time */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    {post.profiles?.username}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatReadingTime(readingTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {postTags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center flex-wrap gap-2">
                  <TagIcon className="w-4 h-4 text-gray-500" />
                  {postTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {post.content && (
              <MarkdownRenderer 
                content={post.content}
                className="text-gray-700"
              />
            )}
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({comments?.length || 0})
            </h2>

            {comments && comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {comment.profiles?.username}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
