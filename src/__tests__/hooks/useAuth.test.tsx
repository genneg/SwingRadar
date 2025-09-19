import { renderHook, act } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'
import { mockSession, mockUnauthenticatedSession } from '../test-utils/test-utils'

// Mock next-auth/react
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns authenticated user when session exists', () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockSession.user)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('returns null user when session does not exist', () => {
    mockUseSession.mockReturnValue({
      data: mockUnauthenticatedSession,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('returns loading state when session is loading', () => {
    mockUseSession.mockReturnValue({
      data: undefined,
      status: 'loading',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })

  it('updates session when update is called', async () => {
    const mockUpdate = jest.fn()
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: mockUpdate,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.updateSession()
    })

    expect(mockUpdate).toHaveBeenCalled()
  })

  it('handles session update errors gracefully', async () => {
    const mockUpdate = jest.fn().mockRejectedValue(new Error('Update failed'))
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: mockUpdate,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.updateSession()
    })

    expect(mockUpdate).toHaveBeenCalled()
    // Should not throw error, should handle gracefully
  })

  it('provides correct authentication helper methods', () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.updateSession).toBe('function')
  })

  it('handles session status changes', () => {
    // Start with loading
    mockUseSession.mockReturnValue({
      data: undefined,
      status: 'loading',
      update: jest.fn(),
    })

    const { result, rerender } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)

    // Change to authenticated
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    })

    rerender()

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockSession.user)
  })
})