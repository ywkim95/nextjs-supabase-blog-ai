// src/components/CommentsSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import { addComment, updateComment, deleteComment } from '@/lib/services/comment.service'
import { formatDate } from '@/lib/utils'
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

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.href,
      },
    })
  }

  const handleAddComment = async () => {
    if (!user || !profile) {
      toast.error('You must be logged in to comment.')
      return
    }
    if (!newComment.trim()) return

    try {
      const newCommentData = await addComment(postId, user.id, newComment.trim())
      
      const newCommentWithProfile: CommentWithAuthor = {
        ...newCommentData,
        profiles: profile
      } as CommentWithAuthor
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
      
      setComments(comments.map(c => c.id === commentId ? { ...c, content: updatedComment?.content || c.content } : c))
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
      
      setComments(comments.filter(c => c.id !== commentId))
      toast.success('Comment deleted!')
    } catch (error) {
      toast.error('Failed to delete comment.')
    }
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
          Comments ({comments.length})
        </h2>

        {user ? (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-orange-500 focus:border-orange-500"
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
        ) : (
          <div className="mb-6 text-center p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="mb-3 text-gray-600 dark:text-gray-400">Log in to leave a comment.</p>
            <button
              onClick={handleGitHubLogin}
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .267.18.577.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {comment.profiles?.username}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {user?.id === comment.author_id && (
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Edit</button>
                        <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        rows={2}
                      />
                      <div className="flex space-x-2 mt-1">
                        <button onClick={() => handleUpdateComment(comment.id)} className="text-xs px-2 py-1 bg-orange-600 text-white rounded-md">Save</button>
                        <button onClick={() => setEditingCommentId(null)} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}
