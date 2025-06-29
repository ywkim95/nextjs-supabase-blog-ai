import PostCard from '@/components/PostCard'
import { type PostWithAuthorAndTags } from '@/lib/supabase/database.types'

interface PostListProps {
  posts: PostWithAuthorAndTags[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
