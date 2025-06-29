import { render, screen, fireEvent } from '@testing-library/react'
import TagInput from '../TagInput'

describe('TagInput', () => {
  const onChangeMock = jest.fn()

  beforeEach(() => {
    onChangeMock.mockClear()
  })

  it('renders with initial tags', () => {
    render(<TagInput tags={['tag1', 'tag2']} onChange={onChangeMock} />)
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  it('adds a new tag on Enter key press', () => {
    render(<TagInput tags={[]} onChange={onChangeMock} placeholder="Enter tags and press Enter" />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new-tag' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(onChangeMock).toHaveBeenCalledWith(['new-tag'])
  })

  it('removes a tag when its remove button is clicked', () => {
    render(<TagInput tags={['tag1', 'tag2']} onChange={onChangeMock} />)
    const removeButton = screen.getAllByRole('button')[0] // First tag's remove button
    fireEvent.click(removeButton)
    expect(onChangeMock).toHaveBeenCalledWith(['tag2'])
  })

  it('does not add a tag if it already exists', () => {
    render(<TagInput tags={['tag1']} onChange={onChangeMock} placeholder="Enter tags and press Enter" />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'tag1' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it('does not add a tag if the maximum number of tags is reached', () => {
    const tags = Array.from({ length: 5 }, (_, i) => `tag${i + 1}`)
    render(<TagInput tags={tags} onChange={onChangeMock} maxTags={5} />)
    const input = screen.queryByRole('textbox')
    expect(input).not.toBeInTheDocument()
  })
})
