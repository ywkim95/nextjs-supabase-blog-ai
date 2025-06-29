// src/components/PostCard.tsx
'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { PostWithAuthorAndTags } from '@/lib/supabase/database.types'
import PostCardMeta from './PostCardMeta'
import PostCardTags from './PostCardTags'

interface PostCardProps {
  post: PostWithAuthorAndTags
}

export default function PostCard({ post }: PostCardProps) {
  const locale = useLocale()
  const postTags = post.post_tags?.map((pt) => pt.tags.name) || []

  return (
    <Link href={`/${locale}/posts/${post.slug || post.id}`}>
      <article className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-3 hover:text-orange-600 dark:hover:text-dark-accent transition-colors">
            {post.title}
          </h3>

          {post.content && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {post.content.replace(/[#*`_\[\]]/g, '').substring(0, 120)}
              {post.content.length > 120 && '...'}
            </p>
          )}

          <PostCardTags tags={postTags} />
          <PostCardMeta post={post} />
        </div>
      </article>
    </Link>
  )
}
