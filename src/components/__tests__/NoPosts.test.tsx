import { render, screen } from '@testing-library/react'
import NoPosts from '../NoPosts'
import { PencilIcon } from '@heroicons/react/24/solid'

describe('NoPosts', () => {
  const defaultProps = {
    icon: <PencilIcon data-testid="icon" />,
    title: 'No Posts Yet',
    description: 'There are no posts to display.',
  }

  it('renders the icon, title, and description', () => {
    render(<NoPosts {...defaultProps} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('No Posts Yet')).toBeInTheDocument()
    expect(screen.getByText('There are no posts to display.')).toBeInTheDocument()
  })

  it('does not render a link when not provided', () => {
    render(<NoPosts {...defaultProps} />)
    const link = screen.queryByRole('link')
    expect(link).not.toBeInTheDocument()
  })

  it('renders a link when provided', () => {
    const linkProps = {
      href: '/new',
      text: 'Create One',
    }
    render(<NoPosts {...defaultProps} link={linkProps} />)
    const link = screen.getByRole('link', { name: 'Create One' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/new')
  })
})
