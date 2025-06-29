// src/lib/services/comment.service.ts
import { createClient } from '@/lib/supabase/client'
import type { Comment } from '@/lib/supabase/database.types'

export async function addComment(postId: number, userId: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: userId, content })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding comment:', error)
    return null
  }
  return data
}

export async function updateComment(commentId: number, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating comment:', error)
    return null
  }
  return data
}

export async function deleteComment(commentId: number) {
  const supabase = createClient()
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('Error deleting comment:', error)
    return null
  }
  return true
}
