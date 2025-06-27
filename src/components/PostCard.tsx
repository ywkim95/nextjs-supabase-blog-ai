// src/components/PostCard.tsx
import Link from 'next/link'
import { calculateReadingTime, formatReadingTime, formatDate } from '@/lib/utils'
import { ClockIcon } from '@heroicons/react/24/outline'
import type { PostWithAuthorAndTags } from '@/lib/supabase/database.types'

interface PostCardProps {
  post: PostWithAuthorAndTags
}

export default function PostCard({ post }: PostCardProps) {
  const postTags = post.post_tags?.map((pt) => pt.tags.name) || []
  const readingTime = post.content ? calculateReadingTime(post.content) : 1

  return (
    <Link href={`/posts/${post.slug || post.id}`}>
      <article className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-orange-600 transition-colors">
            {post.title}
          </h3>

          {post.content && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {post.content.replace(/[#*`_\[\]]/g, '').substring(0, 120)}
              {post.content.length > 120 && '...'}
            </p>
          )}

          {postTags.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center flex-wrap gap-2">
                {postTags.slice(0, 2).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    {tag}
                  </span>
                ))}
                {postTags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{postTags.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-white">
                  {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span>{post.profiles?.username}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span>{formatDate(post.created_at)}</span>
              <span className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formatReadingTime(readingTime)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
