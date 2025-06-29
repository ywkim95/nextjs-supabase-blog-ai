import { render, screen, fireEvent } from '@testing-library/react'
import ThemeSwitcher from '../ThemeSwitcher'
import { useTheme } from 'next-themes'

// Mock the useTheme hook from next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

const mockedUseTheme = useTheme as jest.Mock

describe('ThemeSwitcher', () => {
  const setTheme = jest.fn()

  beforeEach(() => {
    setTheme.mockClear()
  })

  it('renders the dropdown button', () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme })
    render(<ThemeSwitcher />)
    expect(screen.getByTestId('theme-switcher-button')).toBeInTheDocument()
  })

  it('opens the dropdown menu on button click', () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme })
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByTestId('theme-switcher-button'))
    expect(screen.getByTestId('theme-light')).toBeInTheDocument()
    expect(screen.getByTestId('theme-dark')).toBeInTheDocument()
    expect(screen.getByTestId('theme-system')).toBeInTheDocument()
  })

  it('calls setTheme with "light" when light button is clicked', () => {
    mockedUseTheme.mockReturnValue({ theme: 'dark', setTheme })
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByTestId('theme-switcher-button'))
    fireEvent.click(screen.getByTestId('theme-light'))
    expect(setTheme).toHaveBeenCalledWith('light')
  })

  it('calls setTheme with "dark" when dark button is clicked', () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme })
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByTestId('theme-switcher-button'))
    fireEvent.click(screen.getByTestId('theme-dark'))
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with "system" when system button is clicked', () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme })
    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByTestId('theme-switcher-button'))
    fireEvent.click(screen.getByTestId('theme-system'))
    expect(setTheme).toHaveBeenCalledWith('system')
  })
})
