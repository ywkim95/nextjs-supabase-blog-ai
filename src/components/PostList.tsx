import PostCard from '@/components/PostCard'
import { type PostWithAuthor } from '@/lib/services/post.service'

interface PostListProps {
  posts: PostWithAuthor[]
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
