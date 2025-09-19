import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/components/auth/AuthForm'
import { mockSuccessfulApiCall, mockFailedApiCall } from '../../../test-utils/test-utils'

// Mock the useRouter hook
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('AuthForm', () => {
  const mockOnSubmit = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnSubmit.mockClear()
  })

  it('renders login form by default', () => {
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders registration form when mode is signup', () => {
    render(<AuthForm mode="signup" onSubmit={mockOnSubmit} />)
    
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email format', async () => {
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('submits login form with valid data', async () => {
    const mockFetch = mockSuccessfulApiCall({ user: { id: '1', email: 'test@example.com' } })
    
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    })
  })

  it('submits registration form with valid data', async () => {
    const mockFetch = mockSuccessfulApiCall({ user: { id: '1', email: 'test@example.com' } })
    
    render(<AuthForm mode="signup" onSubmit={mockOnSubmit} />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    })
  })

  it('displays error message on failed authentication', async () => {
    const mockFetch = mockFailedApiCall(401, 'Invalid credentials')
    
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('shows loading state while submitting', async () => {
    const mockFetch = mockSuccessfulApiCall({ user: { id: '1', email: 'test@example.com' } })
    
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    // Check for loading state
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('toggles between login and registration modes', () => {
    render(<AuthForm mode="signin" onSubmit={mockOnSubmit} />)
    
    // Start in login mode
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    
    // Click register link
    const registerLink = screen.getByText(/create account/i)
    fireEvent.click(registerLink)
    
    // Should switch to registration mode
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    
    // Click login link
    const loginLink = screen.getByText(/sign in/i)
    fireEvent.click(loginLink)
    
    // Should switch back to login mode
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument()
  })
})