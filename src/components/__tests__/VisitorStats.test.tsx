import { render, screen } from '@testing-library/react'
import VisitorStats from '../VisitorStats'
import { useVisitorTracking } from '@/hooks/useVisitorTracking'

// Mock the custom hook
jest.mock('@/hooks/useVisitorTracking', () => ({
  useVisitorTracking: jest.fn(),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const mockedUseVisitorTracking = useVisitorTracking as jest.Mock

describe('VisitorStats', () => {
  it('renders the visitor counts correctly', () => {
    mockedUseVisitorTracking.mockReturnValue({
      dailyVisitors: 123,
      totalVisitors: 4567,
      loading: false,
    })

    render(<VisitorStats />)

    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('4567')).toBeInTheDocument()
    expect(screen.getByText('dailyVisitors')).toBeInTheDocument()
    expect(screen.getByText('totalVisitors')).toBeInTheDocument()
  })

  it('renders loading state correctly', () => {
    mockedUseVisitorTracking.mockReturnValue({
      dailyVisitors: 0,
      totalVisitors: 0,
      loading: true,
    })

    render(<VisitorStats />)

    expect(screen.getAllByText('-')).toHaveLength(2)
  })
})
