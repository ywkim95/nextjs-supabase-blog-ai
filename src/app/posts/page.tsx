import { getAllPosts } from "@/lib/services/post.service";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  calculateReadingTime,
  formatReadingTime,
  formatDate,
} from "@/lib/utils";
import { ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import type { PostWithAuthor } from "@/lib/supabase/database.types";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="mt-2 text-gray-600">Discover the latest blog posts</p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-2 *:flex-col-reverse">
            {posts.map((post) => {
              const postTags =
                (post as any).post_tags?.map((pt: any) => pt.tags.name) || [];
              const readingTime = post.content
                ? calculateReadingTime(post.content)
                : 1;

              return (
                <Link key={post.id} href={`/posts/${post.slug || post.id}`}>
                  <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors">
                        {post.title}
                      </h2>

                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {post.profiles?.username?.[0]?.toUpperCase() ||
                                "U"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
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

                      {post.content && (
                        <div className="text-gray-600 mb-4 leading-relaxed">
                          {/* Strip markdown and show plain text preview */}
                          {post.content
                            .replace(/[#*`_\[\]]/g, "")
                            .substring(0, 200)}
                          {post.content.length > 200 && "..."}
                        </div>
                      )}

                      {/* Tags */}
                      {postTags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center flex-wrap gap-2">
                            <TagIcon className="w-4 h-4 text-gray-400" />
                            {postTags
                              .slice(0, 3)
                              .map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            {postTags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{postTags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="inline-flex items-center text-orange-600 font-medium">
                        계속 읽기 →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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