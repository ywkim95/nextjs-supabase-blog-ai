// src/components/ProfileForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/database.types'

const ProfileSchema = z.object({
  username: z.string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(20, '닉네임은 20자를 초과할 수 없습니다.')
    .regex(/^[a-zA-Z0-9가-힣_-]+$/, '닉네임은 한글, 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용할 수 있습니다.'),
})

type ProfileFormData = z.infer<typeof ProfileSchema>

interface ProfileFormProps {
  user: User
  profile: Profile | null
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: profile?.username || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: data.username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        if (error.code === '23505') {
          toast.error('이미 사용 중인 닉네임입니다')
        } else {
          toast.error('프로필 업데이트에 실패했습니다')
        }
      } else {
        toast.success('프로필이 업데이트되었습니다!')
        router.refresh()
      }
    } catch (error) {
      toast.error('예상치 못한 오류가 발생했습니다')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              닉네임 *
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="닉네임을 입력하세요"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
