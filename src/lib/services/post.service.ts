// src/lib/services/post.service.ts
import { createClient } from '@/lib/supabase/server'

export async function getRecentPosts(limit = 3) {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      ),
      post_tags (
        tags (
          name
        )
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }

  return posts
}

export async function getAllPosts() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        username,
        avatar_url
      ),
      post_tags (
        tags (
          name
        )
      )
    `
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }

  return posts
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()
  let { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      ),
      post_tags (
        tags (
          name
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  // If not found by slug, try by id
  if (!post) {
    const { data: postById } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        ),
        post_tags (
          tags (
            name
          )
        )
      `)
      .eq('id', parseInt(slug))
      .eq('is_published', true)
      .single()

    post = postById
  }

  return post
}

export async function getCommentsByPostId(postId: number) {
  const supabase = await createClient()
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return comments
}

export async function getPostsCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  if (error) {
    console.error('Error fetching posts count:', error)
    return 0
  }

  return count
}

export async function getTagsCount() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('tags')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching tags count:', error)
    return 0
  }

  return count
}
