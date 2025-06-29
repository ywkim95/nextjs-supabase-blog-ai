// src/components/PostCardMeta.tsx
'use client'

import { formatDate, formatReadingTime, calculateReadingTime } from '@/lib/utils'
import { ClockIcon } from '@heroicons/react/24/outline'
import type { PostWithAuthorAndTags } from '@/lib/supabase/database.types'

interface PostCardMetaProps {
  post: PostWithAuthorAndTags
}

export default function PostCardMeta({ post }: PostCardMetaProps) {
  const readingTime = post.content ? calculateReadingTime(post.content) : 1

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-orange-500 dark:bg-dark-secondary flex items-center justify-center mr-2">
          <span className="text-xs font-medium text-white dark:text-dark-background">
            {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="dark:text-gray-300">{post.profiles?.username}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span>{formatDate(post.created_at)}</span>
        <span className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          {formatReadingTime(readingTime)}
        </span>
      </div>
    </div>
  )
}
