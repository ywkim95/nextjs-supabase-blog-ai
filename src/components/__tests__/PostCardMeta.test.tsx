import { render, screen } from '@testing-library/react'
import PostCardMeta from '../PostCardMeta'
import { PostWithAuthorAndTags } from '@/lib/supabase/database.types'

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  calculateReadingTime: () => 5,
  formatReadingTime: (time: number) => `${time} min read`,
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}))

describe('PostCardMeta', () => {
  const mockPost: PostWithAuthorAndTags = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    author_id: 'user-1',
    created_at: '2023-10-27T10:00:00.000Z',
    is_published: true,
    slug: 'test-post',
    profiles: {
      id: 'user-1',
      username: 'testuser',
      avatar_url: null,
      updated_at: '',
    },
    post_tags: [],
  }

  it('renders the author name', () => {
    render(<PostCardMeta post={mockPost} />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('renders the formatted date', () => {
    render(<PostCardMeta post={mockPost} />)
    expect(screen.getByText('10/27/2023')).toBeInTheDocument()
  })

  it('renders the formatted reading time', () => {
    render(<PostCardMeta post={mockPost} />)
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('renders the first letter of the username as avatar fallback', () => {
    render(<PostCardMeta post={mockPost} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })
})
