// src/lib/services/comment.service.ts
import { createClient } from '@/lib/supabase/client'
import type { Comment } from '@/lib/supabase/database.types'

const supabase = createClient()

export async function addComment(postId: number, userId: string, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: userId, content })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateComment(commentId: number, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteComment(commentId: number) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}
