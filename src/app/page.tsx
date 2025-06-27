import { createClient } from '@/lib/supabase/server'
import { getRecentPosts, getPostsCount, getTagsCount } from '@/lib/services/post.service'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { calculateReadingTime, formatReadingTime, formatDate } from '@/lib/utils'
import { ClockIcon, TagIcon, PencilIcon } from '@heroicons/react/24/outline'
import VisitorStats from '@/components/VisitorStats'

export default async function Home() {
  const supabase = await createClient()

  const posts = await getRecentPosts(3)
  const totalPosts = await getPostsCount()
  const totalTags = await getTagsCount()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-4">
              <PencilIcon className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            개발자의 블로그
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            기술, 개발, 그리고 일상의 이야기를 나누는 공간입니다. 
            마크다운으로 작성된 포스트들을 통해 지식과 경험을 공유합니다.
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalPosts || 0}</div>
              <div className="text-sm text-gray-500">포스트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalTags || 0}</div>
              <div className="text-sm text-gray-500">태그</div>
            </div>
            <VisitorStats />
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              href="/posts"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              모든 포스트 보기
            </Link>
            {!user && (
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        {posts && posts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">최근 포스트</h2>
              <Link
                href="/posts"
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                전체 보기 →
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const postTags = (post as any).post_tags?.map((pt: any) => pt.tags.name) || []
                const readingTime = post.content ? calculateReadingTime(post.content) : 1
                
                return (
                  <Link key={post.id} href={`/posts/${post.slug || post.id}`}>
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

                        {/* Tags */}
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

                        {/* Meta info */}
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
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <PencilIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 포스트가 없습니다</h3>
            <p className="text-gray-500 mb-6">첫 번째 포스트를 작성해보세요!</p>
            {!user ? (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                시작하기
              </Link>
            ) : (
              <Link
                href="/dashboard/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                포스트 작성하기
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
