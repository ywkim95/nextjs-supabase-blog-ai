import { render, screen } from '@testing-library/react'
import MarkdownRenderer from '../MarkdownRenderer'

// Mock react-markdown and its plugins
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children, className }: { children: React.ReactNode, className: string }) => <div data-testid="mock-renderer" className={className}>{children}</div>,
}))
jest.mock('remark-gfm', () => ({}))
jest.mock('rehype-raw', () => ({}))
jest.mock('rehype-highlight', () => ({}))

describe('MarkdownRenderer', () => {
  it('renders the mock renderer with the provided content', () => {
    const markdownContent = '# Hello World'
    render(<MarkdownRenderer content={markdownContent} />)

    const renderer = screen.getByTestId('mock-renderer')
    expect(renderer).toBeInTheDocument()
    expect(renderer).toHaveTextContent(markdownContent)
  })

  it('applies the correct CSS classes', () => {
    const { container } = render(<MarkdownRenderer content="" />)
    expect(container.firstChild).toHaveClass('prose prose-lg max-w-none')
  })
})
