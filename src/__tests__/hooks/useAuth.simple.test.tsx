import { renderHook } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'

// Mock next-auth/react
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('useAuth - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should exist and be callable', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should return loading state correctly', () => {
    mockUseSession.mockReturnValue({
      data: undefined,
      status: 'loading',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should return unauthenticated state correctly', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
})