import { render, screen, fireEvent } from '@testing-library/react'
import { EventCard } from '@/components/features/EventCard'
import { mockEvent } from '../../../test-utils/test-utils'

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />)
    
    expect(screen.getByText('Test Blues Festival')).toBeInTheDocument()
    expect(screen.getByText(/a great test festival/i)).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
    expect(screen.getByText('$150')).toBeInTheDocument()
  })

  it('displays event dates correctly', () => {
    render(<EventCard event={mockEvent} />)
    
    // Check for date display (format may vary)
    expect(screen.getByText(/jun 15/i)).toBeInTheDocument()
    expect(screen.getByText(/jun 17/i)).toBeInTheDocument()
  })

  it('displays teachers information', () => {
    render(<EventCard event={mockEvent} />)
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText(/slow blues/i)).toBeInTheDocument()
    expect(screen.getByText(/shuffle/i)).toBeInTheDocument()
  })

  it('displays musicians information', () => {
    render(<EventCard event={mockEvent} />)
    
    expect(screen.getByText('John Blues')).toBeInTheDocument()
    expect(screen.getByText(/traditional blues/i)).toBeInTheDocument()
  })

  it('handles click event', () => {
    const mockOnClick = jest.fn()
    render(<EventCard event={mockEvent} onClick={mockOnClick} />)
    
    const card = screen.getByRole('article')
    fireEvent.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockEvent)
  })

  it('displays registration deadline warning when approaching', () => {
    const eventWithSoonDeadline = {
      ...mockEvent,
      registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }
    
    render(<EventCard event={eventWithSoonDeadline} />)
    
    expect(screen.getByText(/registration deadline/i)).toBeInTheDocument()
  })

  it('shows event as past when end date has passed', () => {
    const pastEvent = {
      ...mockEvent,
      startDate: new Date('2023-06-15'),
      endDate: new Date('2023-06-17'),
    }
    
    render(<EventCard event={pastEvent} />)
    
    expect(screen.getByText(/past event/i)).toBeInTheDocument()
  })

  it('renders compact view when specified', () => {
    render(<EventCard event={mockEvent} compact />)
    
    // In compact view, description should be truncated or hidden
    expect(screen.getByText('Test Blues Festival')).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
    
    // Full description might be hidden in compact view
    const description = screen.queryByText(/a great test festival/i)
    if (description) {
      expect(description).toHaveClass('truncate')
    }
  })

  it('shows follow buttons for teachers and musicians', () => {
    render(<EventCard event={mockEvent} />)
    
    // Should show follow buttons for teachers and musicians
    const followButtons = screen.getAllByText(/follow/i)
    expect(followButtons.length).toBeGreaterThan(0)
  })

  it('handles missing optional data gracefully', () => {
    const minimalEvent = {
      ...mockEvent,
      teachers: [],
      musicians: [],
      description: null,
      website: null,
    }
    
    render(<EventCard event={minimalEvent} />)
    
    expect(screen.getByText('Test Blues Festival')).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
    expect(screen.getByText('$150')).toBeInTheDocument()
  })
})