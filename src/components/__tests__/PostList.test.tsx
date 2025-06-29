import { render, screen } from '@testing-library/react'
import PostList from '../PostList'
import { PostWithAuthor } from '@/lib/services/post.service'

// Mock PostCard to isolate PostList tests
jest.mock('../PostCard', () => ({
  __esModule: true,
  default: ({ post }: { post: PostWithAuthor }) => <div data-testid="postcard">{post.title}</div>,
}))

describe('PostList', () => {
  const mockPosts: PostWithAuthor[] = [
    { id: 1, title: 'Post 1', content: 'Content 1', author_id: '1', created_at: '', is_published: true, slug: 'post-1', profiles: { id: '1', username: 'user1', avatar_url: null, updated_at: '' } },
    { id: 2, title: 'Post 2', content: 'Content 2', author_id: '2', created_at: '', is_published: true, slug: 'post-2', profiles: { id: '2', username: 'user2', avatar_url: null, updated_at: '' } },
  ]

  it('renders the correct number of posts', () => {
    render(<PostList posts={mockPosts} />)
    const postCards = screen.getAllByTestId('postcard')
    expect(postCards).toHaveLength(2)
  })

  it('renders the post titles', () => {
    render(<PostList posts={mockPosts} />)
    expect(screen.getByText('Post 1')).toBeInTheDocument()
    expect(screen.getByText('Post 2')).toBeInTheDocument()
  })

  it('renders nothing when no posts are provided', () => {
    const { container } = render(<PostList posts={[]} />)
    expect(container.firstChild).toBeEmptyDOMElement()
  })
})
