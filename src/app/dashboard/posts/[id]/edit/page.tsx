'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagInput from '@/components/TagInput'
import { createSlug } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import type { Post } from '@/lib/supabase/database.types'

interface EditPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditPost({ params }: EditPostPageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadPost() {
      const { id } = await params
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_tags (
            tags (
              name
            )
          )
        `)
        .eq('id', parseInt(id))
        .eq('author_id', user.id)
        .single()

      if (error || !post) {
        toast.error('Post not found or you do not have permission to edit it')
        router.push('/dashboard')
        return
      }

      setPost(post)
      setTitle(post.title)
      setContent(post.content || '')
      setSlug(post.slug || '')
      setIsPublished(post.is_published)
      
      // Extract tags from the joined data
      const postTags = (post as any).post_tags?.map((pt: any) => pt.tags.name) || []
      setTags(postTags)
      
      setLoading(false)
    }

    loadPost()
  }, [params, supabase, router])

  const generateSlug = (title: string) => {
    return createSlug(title)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug && post) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!post) return

      // Update the post
      const { error: postError } = await supabase
        .from('posts')
        .update({
          title,
          content,
          slug: slug || generateSlug(title),
          is_published: isPublished,
        })
        .eq('id', post.id)

      if (postError) {
        toast.error(postError.message)
        return
      }

      // Handle tags - first remove existing relationships
      await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', post.id)

      // Add new tags if any
      if (tags.length > 0) {
        // Insert new tags
        for (const tagName of tags) {
          const { error: insertError } = await supabase
            .from('tags')
            .insert({ name: tagName })

          if (insertError && insertError.code !== '23505') {
            throw insertError
          }
        }

        // Get tag IDs and create relationships
        const { data: tagData } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', tags)

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

      toast.success('Post updated successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post || !confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Post deleted successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="mt-2 text-gray-600">Update your blog post</p>
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
                  Published
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Deleting...' : 'Delete Post'}
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
