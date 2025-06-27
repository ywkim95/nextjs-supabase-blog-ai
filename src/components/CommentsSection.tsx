// src/components/CommentsSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import { addComment, updateComment, deleteComment } from '@/lib/services/comment.service'
import type { CommentWithAuthor, Profile } from '@/lib/supabase/database.types'

interface CommentsSectionProps {
  postId: number
  initialComments: CommentWithAuthor[]
}

export default function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(userProfile)
      }
    }
    getSession()
  }, [supabase])

  const handleAddComment = async () => {
    if (!user || !profile) {
      toast.error('You must be logged in to comment.')
      return
    }
    if (!newComment.trim()) return

    try {
      const newCommentData = await addComment(postId, user.id, newComment.trim())
      
      // Optimistically update the UI
      const newCommentWithProfile: CommentWithAuthor = {
        ...newCommentData,
        profiles: profile
      }
      setComments([...comments, newCommentWithProfile])
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment.')
    }
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editingContent.trim()) return

    try {
      const updatedComment = await updateComment(commentId, editingContent.trim())
      
      // Optimistically update the UI
      setComments(comments.map(c => c.id === commentId ? { ...c, content: updatedComment.content } : c))
      setEditingCommentId(null)
      setEditingContent('')
      toast.success('Comment updated!')
    } catch (error) {
      toast.error('Failed to update comment.')
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await deleteComment(commentId)
      
      // Optimistically update the UI
      setComments(comments.filter(c => c.id !== commentId))
      toast.success('Comment deleted!')
    } catch (error) {
      toast.error('Failed to delete comment.')
    }
  }

  return (
    <div className="mt-8 bg-white shadow rounded-lg">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        {user && (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Post Comment
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {comment.profiles?.username}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {user?.id === comment.author_id && (
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }} className="text-xs text-gray-500 hover:text-gray-700">Edit</button>
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={2}
                      />
                      <div className="flex space-x-2 mt-1">
                        <button onClick={() => handleUpdateComment(comment.id)} className="text-xs px-2 py-1 bg-orange-600 text-white rounded-md">Save</button>
                        <button onClick={() => setEditingCommentId(null)} className="text-xs px-2 py-1 bg-gray-200 rounded-md">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-700">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}