import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

import { authOptions } from '@/lib/auth/config'
import { 
  apiResponse, 
  apiError, 
  handleApiError,
  validateMethod
} from '@/lib/api/utils'

/**
 * GET /api/users/me/dashboard/insights - Get user's personalized insights
 */
export async function GET(request: NextRequest) {
  try {
    validateMethod(request, ['GET'])
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    const userId = session.user.id
    
    // Generate personalized insights
    const insights = await generateUserInsights(userId)
    
    return apiResponse(insights, true, 'User insights generated successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper function to generate user insights
async function generateUserInsights(userId: string) {
  // TODO: Replace with actual database queries and analytics
  
  // Mock user data for insight generation
  const mockUserData = {
    totalEvents: 25,
    eventsThisMonth: 4,
    eventsLastMonth: 2,
    favoriteGenres: [
      { name: 'Traditional Blues', count: 10, percentage: 40 },
      { name: 'Swing', count: 8, percentage: 32 },
      { name: 'Jazz', count: 7, percentage: 28 }
    ],
    favoriteLocations: [
      { name: 'Portland, OR', count: 8, percentage: 32 },
      { name: 'Seattle, WA', count: 6, percentage: 24 },
      { name: 'San Francisco, CA', count: 5, percentage: 20 }
    ],
    topTeachers: [
      { name: 'Sarah Johnson', eventsAttended: 5 },
      { name: 'Mike Anderson', eventsAttended: 4 },
      { name: 'Lisa Chen', eventsAttended: 3 }
    ],
    topMusicians: [
      { name: 'Charlie Blues Band', eventsAttended: 4 },
      { name: 'Seattle Blues Society', eventsAttended: 3 }
    ],
    averageEventPrice: 75,
    totalSpent: 1875,
    upcomingEvents: 8,
    followingCount: 24,
    streakDays: 12,
    achievements: 7,
    registrationSpeed: 'fast', // how quickly user registers for events
    pricePreference: 'moderate',
    activityLevel: 'high',
    discoveryMethod: 'following' // how user discovers events
  }
  
  const insights = []
  
  // Activity trend insight
  if (mockUserData.eventsThisMonth > mockUserData.eventsLastMonth) {
    const increase = ((mockUserData.eventsThisMonth - mockUserData.eventsLastMonth) / mockUserData.eventsLastMonth) * 100
    insights.push({
      id: 'activity-trend',
      type: 'trend',
      title: 'Activity Increasing',
      description: `You've been ${increase.toFixed(0)}% more active this month`,
      value: `+${increase.toFixed(0)}%`,
      change: increase,
      changeType: 'positive',
      category: 'activity'
    })
  }
  
  // Genre preference insight
  if (mockUserData.favoriteGenres.length > 0) {
    const topGenre = mockUserData.favoriteGenres[0]
    insights.push({
      id: 'genre-preference',
      type: 'trend',
      title: 'Favorite Genre',
      description: `${topGenre.name} is your most attended genre`,
      value: `${topGenre.percentage}%`,
      category: 'preferences'
    })
  }
  
  // Location preference insight
  if (mockUserData.favoriteLocations.length > 0) {
    const topLocation = mockUserData.favoriteLocations[0]
    insights.push({
      id: 'location-preference',
      type: 'trend',
      title: 'Favorite Location',
      description: `You love events in ${topLocation.name}`,
      value: `${topLocation.count} events`,
      category: 'preferences'
    })
  }
  
  // Achievement insight
  if (mockUserData.totalEvents >= 25) {
    insights.push({
      id: 'milestone-events',
      type: 'achievement',
      title: 'Dance Enthusiast',
      description: `You've attended ${mockUserData.totalEvents} blues dance events!`,
      value: `${mockUserData.totalEvents} events`,
      category: 'achievements',
      isNew: true
    })
  }
  
  // Streak insight
  if (mockUserData.streakDays > 7) {
    insights.push({
      id: 'streak-achievement',
      type: 'milestone',
      title: 'Streak Master',
      description: `You've been active for ${mockUserData.streakDays} days in a row!`,
      value: `${mockUserData.streakDays} days`,
      category: 'achievements'
    })
  }
  
  // Following insight
  if (mockUserData.followingCount > 20) {
    insights.push({
      id: 'social-achievement',
      type: 'achievement',
      title: 'Social Butterfly',
      description: `You're following ${mockUserData.followingCount} teachers and musicians`,
      value: `${mockUserData.followingCount} following`,
      category: 'social'
    })
  }
  
  // Budget insight
  if (mockUserData.averageEventPrice <= 100) {
    insights.push({
      id: 'budget-insight',
      type: 'recommendation',
      title: 'Budget Friendly',
      description: `Your average event cost is $${mockUserData.averageEventPrice}. Great value!`,
      value: `$${mockUserData.averageEventPrice} avg`,
      category: 'financial'
    })
  }
  
  // Teacher recommendation
  if (mockUserData.topTeachers.length > 0) {
    const topTeacher = mockUserData.topTeachers[0]
    insights.push({
      id: 'teacher-recommendation',
      type: 'recommendation',
      title: 'Favorite Teacher',
      description: `You've attended ${topTeacher.eventsAttended} events with ${topTeacher.name}`,
      value: `${topTeacher.eventsAttended} events`,
      category: 'social',
      actionText: 'See upcoming events',
      actionUrl: `/teachers/${topTeacher.name.toLowerCase().replace(/\s+/g, '-')}`
    })
  }
  
  // Discovery pattern insight
  if (mockUserData.discoveryMethod === 'following') {
    insights.push({
      id: 'discovery-pattern',
      type: 'recommendation',
      title: 'Discovery Method',
      description: 'You discover most events through people you follow',
      category: 'patterns',
      actionText: 'Explore more',
      actionUrl: '/profile/following'
    })
  }
  
  // Upcoming events insight
  if (mockUserData.upcomingEvents > 5) {
    insights.push({
      id: 'upcoming-events',
      type: 'milestone',
      title: 'Event Planner',
      description: `You have ${mockUserData.upcomingEvents} events coming up`,
      value: `${mockUserData.upcomingEvents} events`,
      category: 'planning'
    })
  }
  
  // Personalized recommendations based on data
  const recommendations = generateRecommendations(mockUserData)
  insights.push(...recommendations)
  
  return {
    insights,
    stats: {
      totalEvents: mockUserData.totalEvents,
      eventsThisMonth: mockUserData.eventsThisMonth,
      favoriteGenres: mockUserData.favoriteGenres.map(g => g.name),
      favoriteLocations: mockUserData.favoriteLocations.map(l => l.name),
      topTeachers: mockUserData.topTeachers.map(t => t.name),
      topMusicians: mockUserData.topMusicians.map(m => m.name),
      averageEventPrice: mockUserData.averageEventPrice,
      totalSpent: mockUserData.totalSpent,
      upcomingEvents: mockUserData.upcomingEvents,
      followingCount: mockUserData.followingCount,
      streakDays: mockUserData.streakDays,
      achievements: mockUserData.achievements
    }
  }
}

// Helper function to generate personalized recommendations
function generateRecommendations(userData: any) {
  const recommendations = []
  
  // Genre-based recommendations
  if (userData.favoriteGenres[0]?.name === 'Traditional Blues') {
    recommendations.push({
      id: 'genre-recommendation',
      type: 'recommendation',
      title: 'Perfect Match',
      description: 'Based on your love for Traditional Blues, you might enjoy Slow Blues workshops',
      category: 'recommendations',
      actionText: 'Explore',
      actionUrl: '/events?genre=slow-blues'
    })
  }
  
  // Location-based recommendations
  if (userData.favoriteLocations[0]?.name === 'Portland, OR') {
    recommendations.push({
      id: 'location-recommendation',
      type: 'recommendation',
      title: 'Local Events',
      description: 'There are 3 new events happening in Portland this month',
      category: 'recommendations',
      actionText: 'View events',
      actionUrl: '/events?location=portland'
    })
  }
  
  // Price-based recommendations
  if (userData.averageEventPrice <= 75) {
    recommendations.push({
      id: 'price-recommendation',
      type: 'recommendation',
      title: 'Budget Options',
      description: 'We found 5 events under $75 that match your interests',
      category: 'recommendations',
      actionText: 'View deals',
      actionUrl: '/events?maxPrice=75'
    })
  }
  
  // Activity-based recommendations
  if (userData.activityLevel === 'high') {
    recommendations.push({
      id: 'activity-recommendation',
      type: 'recommendation',
      title: 'Weekend Workshop',
      description: 'As an active dancer, you might enjoy intensive weekend workshops',
      category: 'recommendations',
      actionText: 'Find workshops',
      actionUrl: '/events?type=workshop&duration=weekend'
    })
  }
  
  return recommendations
}

// Helper function to calculate user patterns
function calculateUserPatterns(userId: string) {
  // TODO: Implement pattern analysis
  return {
    preferredDays: ['Friday', 'Saturday'],
    preferredTimes: ['evening'],
    registrationTiming: 'early', // early, medium, late
    priceRange: { min: 50, max: 100 },
    travelDistance: 50, // miles
    eventTypes: ['workshop', 'social', 'festival']
  }
}

// Helper function to generate achievements
function generateAchievements(userData: any) {
  const achievements = []
  
  // Event attendance achievements
  if (userData.totalEvents >= 10) achievements.push('First Steps')
  if (userData.totalEvents >= 25) achievements.push('Dance Enthusiast')
  if (userData.totalEvents >= 50) achievements.push('Blues Devotee')
  if (userData.totalEvents >= 100) achievements.push('Dance Master')
  
  // Following achievements
  if (userData.followingCount >= 10) achievements.push('Community Builder')
  if (userData.followingCount >= 25) achievements.push('Social Butterfly')
  if (userData.followingCount >= 50) achievements.push('Network Master')
  
  // Streak achievements
  if (userData.streakDays >= 7) achievements.push('Week Warrior')
  if (userData.streakDays >= 30) achievements.push('Monthly Master')
  if (userData.streakDays >= 365) achievements.push('Year-Round Dancer')
  
  // Genre achievements
  if (userData.favoriteGenres.length >= 3) achievements.push('Genre Explorer')
  
  // Location achievements
  if (userData.favoriteLocations.length >= 5) achievements.push('Travel Enthusiast')
  
  return achievements
}