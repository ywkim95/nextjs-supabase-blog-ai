import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MarkdownEditor from '../MarkdownEditor'

// Mock the external editor component
jest.mock('@uiw/react-md-editor', () => ({
  __esModule: true,
  default: (props: any) => (
    <textarea
      data-testid="mock-editor"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.textareaProps.placeholder}
    />
  ),
}))

describe('MarkdownEditor', () => {
  it('renders the mock editor with correct initial props', async () => {
    const handleChange = jest.fn()
    render(
      <MarkdownEditor
        value="initial value"
        onChange={handleChange}
        placeholder="test placeholder"
        height={300}
      />
    )

    await waitFor(() => {
      const editor = screen.getByTestId('mock-editor')
      expect(editor).toBeInTheDocument()
      expect(editor).toHaveValue('initial value')
      expect(editor).toHaveAttribute('placeholder', 'test placeholder')
    })
  })

  it('calls onChange prop when the value changes', async () => {
    const handleChange = jest.fn()
    render(<MarkdownEditor value="" onChange={handleChange} />)

    await waitFor(() => {
      const editor = screen.getByTestId('mock-editor')
      fireEvent.change(editor, { target: { value: 'new value' } })
      expect(handleChange).toHaveBeenCalledWith('new value')
    })
  })
})
