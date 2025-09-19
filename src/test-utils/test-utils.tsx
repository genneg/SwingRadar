import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/components/providers/AuthProvider'

// Mock session data
export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
    verified: true,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

// Mock unauthenticated session
export const mockUnauthenticatedSession = null

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
}

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Custom render function without authentication
const renderWithoutAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const UnauthenticatedProvider = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider session={mockUnauthenticatedSession}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
  
  return render(ui, { wrapper: UnauthenticatedProvider, ...options })
}

// Export everything
export * from '@testing-library/react'
export { customRender as render, renderWithoutAuth }

// Mock API responses
export const mockApiResponse = <T,>(data: T, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response)
}

// Mock API error
export const mockApiError = (status = 500, message = 'Server Error') => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
    text: () => Promise.resolve(JSON.stringify({ error: message })),
  } as Response)
}

// Mock event data
export const mockEvent = {
  id: 'test-event-1',
  name: 'Test Blues Festival',
  description: 'A great test festival',
  startDate: new Date('2024-06-15'),
  endDate: new Date('2024-06-17'),
  venue: {
    id: 'test-venue-1',
    name: 'Test Venue',
    address: '123 Test Street',
    city: 'Test City',
    country: 'Test Country',
    latitude: 40.7128,
    longitude: -74.0060,
  },
  teachers: [
    {
      id: 'test-teacher-1',
      name: 'Jane Smith',
      bio: 'Expert blues dancer and teacher',
      specialties: ['slow blues', 'shuffle'],
    },
  ],
  musicians: [
    {
      id: 'test-musician-1',
      name: 'John Blues',
      bio: 'Professional blues musician',
      genre: ['traditional blues'],
    },
  ],
  registrationDeadline: new Date('2024-06-01'),
  price: 150,
  website: 'https://testfestival.com',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock user data
export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
  },
}

// Mock teacher data
export const mockTeacher = {
  id: 'test-teacher-1',
  name: 'Jane Smith',
  bio: 'Expert blues dancer and teacher with 10 years of experience',
  specialties: ['slow blues', 'shuffle', 'balboa'],
  image: null,
  website: 'https://janesmith.com',
  socialMedia: {
    facebook: 'https://facebook.com/janesmith',
    instagram: 'https://instagram.com/janesmith',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock musician data
export const mockMusician = {
  id: 'test-musician-1',
  name: 'John Blues',
  bio: 'Professional blues musician and composer',
  genre: ['traditional blues'],
  image: null,
  website: 'https://johnblues.com',
  socialMedia: {
    facebook: 'https://facebook.com/johnblues',
    instagram: 'https://instagram.com/johnblues',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Helper to mock successful API calls
export const mockSuccessfulApiCall = (data: any) => {
  if (typeof jest !== 'undefined') {
    const mockFetch = jest.fn()
    mockFetch.mockResolvedValueOnce(mockApiResponse(data))
    global.fetch = mockFetch
    return mockFetch
  }
  return null
}

// Helper to mock failed API calls
export const mockFailedApiCall = (status = 500, message = 'Server Error') => {
  if (typeof jest !== 'undefined') {
    const mockFetch = jest.fn()
    mockFetch.mockResolvedValueOnce(mockApiError(status, message))
    global.fetch = mockFetch
    return mockFetch
  }
  return null
}