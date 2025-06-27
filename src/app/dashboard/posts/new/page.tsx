'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagInput from '@/components/TagInput'
import { createSlug } from '@/lib/utils'
import { toast } from 'react-hot-toast'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (title: string) => {
    return createSlug(title)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('You must be logged in to create a post')
        router.push('/login')
        return
      }

      // Create the post first
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          slug: slug || generateSlug(title),
          is_published: isPublished,
          author_id: user.id,
        })
        .select()
        .single()

      if (postError) {
        toast.error(postError.message)
        return
      }

      // Handle tags if any are provided
      if (tags.length > 0) {
        // First, insert any new tags that don't exist
        for (const tagName of tags) {
          const { error: insertError } = await supabase
            .from('tags')
            .insert({ name: tagName })

          if (insertError && insertError.code !== '23505') {
            throw insertError
          }
        }

        // Get all tag IDs
        const { data: tagData } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', tags)

        // Create post-tag relationships
        if (tagData) {
          const postTagInserts = tagData.map(tag => ({
            post_id: post.id,
            tag_id: tag.id
          }))

          await supabase
            .from('post_tags')
            .insert(postTagInserts)
        }
      }

      toast.success('Post created successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="mt-2 text-gray-600">Write and publish your blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 border"
                  placeholder="Enter your post title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 border"
                  placeholder="post-url-slug"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to auto-generate from title
                </p>
              </div>

              <div>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content in Markdown..."
                  height={400}
                />
              </div>

              <div>
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  maxTags={10}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="is_published"
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
