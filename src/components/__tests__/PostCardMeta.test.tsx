import { render, screen } from '@testing-library/react'
import PostCardMeta from '../PostCardMeta'
import { PostWithAuthorAndTags } from '@/lib/supabase/database.types'
import * as utils from '@/lib/utils'

// Mock utility functions
jest.mock('@/lib/utils', () => ({
  calculateReadingTime: jest.fn(),
  formatReadingTime: (time: number) => `${time} min read`,
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}))

const mockedUtils = utils as jest.Mocked<typeof utils>

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

  beforeEach(() => {
    mockedUtils.calculateReadingTime.mockReturnValue(5)
  })

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

  it('renders "U" as fallback when username is null', () => {
    const postWithoutUsername = {
      ...mockPost,
      profiles: { ...mockPost.profiles, username: null },
    }
    render(<PostCardMeta post={postWithoutUsername as any} />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('renders "U" as fallback when username is an empty string', () => {
    const postWithEmptyUsername = {
      ...mockPost,
      profiles: { ...mockPost.profiles, username: '' },
    }
    render(<PostCardMeta post={postWithEmptyUsername as any} />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('renders "U" as fallback when profiles is null', () => {
    const postWithoutProfile = { ...mockPost, profiles: null }
    render(<PostCardMeta post={postWithoutProfile as any} />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('defaults to 1 min read when content is null', () => {
    const postWithoutContent = { ...mockPost, content: null }
    render(<PostCardMeta post={postWithoutContent as any} />)
    // We are not mocking calculateReadingTime here, so the component's internal logic will be used.
    // The formatReadingTime mock will receive 1.
    expect(screen.getByText('1 min read')).toBeInTheDocument()
  })
})
