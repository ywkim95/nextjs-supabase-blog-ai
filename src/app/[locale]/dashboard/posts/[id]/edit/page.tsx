'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import PostForm from '@/components/PostForm'
import { toast } from 'react-hot-toast'
import type { Post } from '@/lib/supabase/database.types'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditPost({ params }: EditPostPageProps) {
  const [post, setPost] = useState<Post & { post_tags?: { tags: { name: string } }[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadPost = useCallback(async () => {
    const { id } = await params
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*, post_tags(tags(name))')
      .eq('id', parseInt(id))
      .eq('author_id', user.id)
      .single()

    if (error || !data) {
      toast.error('Post not found or permission denied')
      router.push('/dashboard')
      return
    }
    setPost(data)
    setLoading(false)
  }, [params, supabase, router])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  const handleSubmit = async (data: any) => {
    if (!post) return
    setSaving(true)
    try {
      const { title, content, slug, is_published, tags } = data
      await supabase.from('posts').update({ title, content, slug, is_published }).eq('id', post.id)
      await supabase.from('post_tags').delete().eq('post_id', post.id)

      if (tags.length > 0) {
        for (const tagName of tags) {
          await supabase.from('tags').insert({ name: tagName }).select().single()
        }
        const { data: tagData } = await supabase.from('tags').select('id, name').in('name', tags)
        if (tagData) {
          const postTagInserts = tagData.map(tag => ({ post_id: post.id, tag_id: tag.id }))
          await supabase.from('post_tags').insert(postTagInserts)
        }
      }
      toast.success('Post updated successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post || !confirm('Are you sure you want to delete this post?')) return
    setSaving(true)
    try {
      await supabase.from('posts').delete().eq('id', post.id)
      toast.success('Post deleted successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <main>
        <div className="text-center py-8">Loading...</div>
      </main>
    </div>
  )
  if (!post) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <main>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Post</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Update your blog post</p>
        </div>
        <PostForm initialData={post} onSubmit={handleSubmit} isEdit />
        <div className="mt-8 border-t pt-6">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {saving ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      </div>
      </main>
    </div>
  )
}
