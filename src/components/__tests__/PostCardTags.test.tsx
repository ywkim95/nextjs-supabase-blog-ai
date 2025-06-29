import { render, screen } from '@testing-library/react'
import PostCardTags from '../PostCardTags'

describe('PostCardTags', () => {
  it('renders nothing if tags array is empty or not provided', () => {
    const { container: container1 } = render(<PostCardTags tags={[]} />)
    expect(container1.firstChild).toBeNull()

    const { container: container2 } = render(<PostCardTags tags={undefined as any} />)
    expect(container2.firstChild).toBeNull()
  })

  it('renders up to 2 tags', () => {
    render(<PostCardTags tags={['tag1', 'tag2']} />)
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  it('renders 2 tags and a +n indicator if more than 2 tags are provided', () => {
    render(<PostCardTags tags={['tag1', 'tag2', 'tag3', 'tag4']} />)
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })
})
