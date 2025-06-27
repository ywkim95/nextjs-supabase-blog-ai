// src/app/profile/page.tsx
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/services/auth.service'
import Layout from '@/components/Layout'
import ProfileForm from '@/components/ProfileForm'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)

  if (!profile) {
    // This case might happen if a user is created in auth but not in profiles table.
    // You might want to handle this by creating a profile entry or showing an error.
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Error</h1>
            <p>Could not load profile. Please contact support.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">프로필 설정</h1>
          <p className="mt-2 text-gray-600">닉네임과 프로필 정보를 관리하세요</p>
        </div>
        <ProfileForm user={user} profile={profile} />
      </div>
    </Layout>
  )
}