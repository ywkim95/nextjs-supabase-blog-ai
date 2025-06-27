import { getAllPosts } from "@/lib/services/post.service";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="mt-2 text-gray-600">Discover the latest blog posts</p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">Be the first to write a post!</p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
