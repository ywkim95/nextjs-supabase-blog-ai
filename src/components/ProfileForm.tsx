// src/components/ProfileForm.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/database.types'

interface ProfileFormProps {
  user: User
  profile: Profile
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [username, setUsername] = useState(profile.username)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('이미 사용 중인 닉네임입니다')
        } else {
          toast.error('프로필 업데이트에 실패했습니다')
        }
      } else {
        toast.success('프로필이 업데이트되었습니다!')
        // Refresh the page to show the new username in the navbar
        router.refresh()
      }
    } catch (error) {
      toast.error('예상치 못한 오류가 발생했습니다')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          {/* Current Avatar */}
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-medium text-white">
                {username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-6">
              <h2 className="text-lg font-medium text-gray-900">프로필 아바타</h2>
              <p className="text-sm text-gray-500">닉네임의 첫 글자가 아바타로 표시됩니다</p>
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이메일 주소
            </label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">이메일 주소는 변경할 수 없습니다</p>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              닉네임 *
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={20}
              pattern="[a-zA-Z0-9가-힣_-]+"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="닉네임을 입력하세요"
            />
            <p className="mt-1 text-xs text-gray-500">
              2-20자, 한글/영문/숫자/언더스코어/하이픈만 사용 가능
            </p>
          </div>

          {/* Account Info */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">계정 정보</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <p>가입일: {new Date(user.created_at || '').toLocaleDateString('ko-KR')}</p>
              <p>마지막 업데이트: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('ko-KR') : '없음'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={saving || !username.trim() || username === profile.username}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
