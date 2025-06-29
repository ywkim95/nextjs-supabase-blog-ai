'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PostForm from '@/components/PostForm'
import { toast } from 'react-hot-toast'

export default function NewPost() {
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in to create a post')
        router.push('/login')
        return
      }

      const { title, content, slug, is_published, tags } = data

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({ title, content, slug, is_published, author_id: user.id })
        .select()
        .single()

      if (postError) throw postError

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

      toast.success('Post created successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <Navbar />
      <main>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Write and publish your blog post</p>
        </div>
        <PostForm onSubmit={handleSubmit} />
      </div>
      </main>
    </div>
  )
}
