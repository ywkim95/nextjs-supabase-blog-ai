// src/components/PostForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownEditor from '@/components/MarkdownEditor'
import TagInput from '@/components/TagInput'
import { createSlug } from '@/lib/utils'
import type { Post } from '@/lib/supabase/database.types'

interface PostFormProps {
  initialData?: Post & { post_tags?: { tags: { name: string } }[] }
  onSubmit: (data: any) => Promise<void>
  isEdit?: boolean
}

export default function PostForm({ initialData, onSubmit, isEdit = false }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setContent(initialData.content || '')
      setSlug(initialData.slug || '')
      setIsPublished(initialData.is_published)
      const postTags = initialData.post_tags?.map((pt) => pt.tags.name) || []
      setTags(postTags)
    }
  }, [initialData])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug && !isEdit) {
      setSlug(createSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSubmit({ title, content, slug: slug || createSlug(title), is_published: isPublished, tags })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your post title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug (URL)
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="post-url-slug"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
              placeholder="Enter tags and press Enter"
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
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {isEdit ? 'Published' : 'Publish immediately'}
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
          disabled={saving || !title.trim()}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Post')}
        </button>
      </div>
    </form>
  )
}
