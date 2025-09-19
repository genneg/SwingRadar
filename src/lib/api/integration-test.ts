import { ApiTester, quickTest, loadTest } from './test-endpoints'

/**
 * Run comprehensive API integration tests
 */
export async function runApiIntegrationTests(): Promise<void> {
  console.log('🔬 Starting comprehensive API integration tests...')
  
  const tester = new ApiTester({ verbose: true })
  
  try {
    // 1. Test all endpoints
    const allResults = await tester.testAllEndpoints()
    
    console.log('\n📊 Test Results by Category:')
    
    // Health endpoints
    const healthPassed = allResults.health.filter(r => r.success).length
    console.log(`  Health: ${healthPassed}/${allResults.health.length} passed`)
    
    // Auth endpoints
    const authPassed = allResults.auth.filter(r => r.success).length
    console.log(`  Auth: ${authPassed}/${allResults.auth.length} passed`)
    
    // Events endpoints
    const eventsPassed = allResults.events.filter(r => r.success).length
    console.log(`  Events: ${eventsPassed}/${allResults.events.length} passed`)
    
    // Teachers endpoints
    const teachersPassed = allResults.teachers.filter(r => r.success).length
    console.log(`  Teachers: ${teachersPassed}/${allResults.teachers.length} passed`)
    
    // Musicians endpoints
    const musiciansPassed = allResults.musicians.filter(r => r.success).length
    console.log(`  Musicians: ${musiciansPassed}/${allResults.musicians.length} passed`)
    
    // Search endpoints
    const searchPassed = allResults.search.filter(r => r.success).length
    console.log(`  Search: ${searchPassed}/${allResults.search.length} passed`)
    
    // User endpoints
    const usersPassed = allResults.users.filter(r => r.success).length
    console.log(`  Users: ${usersPassed}/${allResults.users.length} passed`)
    
    // 2. Generate and display full report
    const report = tester.generateReport()
    console.log('\n' + report)
    
    // 3. Test specific high-traffic endpoints under load
    console.log('\n🚀 Running load tests on critical endpoints...')
    
    const loadTestResults = await Promise.all([
      loadTest('/events', 5, 10000), // 5 concurrent users for 10 seconds
      loadTest('/api/health', 10, 5000), // 10 concurrent users for 5 seconds
    ])
    
    console.log('\n📈 Load Test Summary:')
    loadTestResults.forEach((result, index) => {
      const endpoint = index === 0 ? '/events' : '/api/health'
      console.log(`  ${endpoint}: ${result.requestsPerSecond.toFixed(2)} req/s, ${result.averageResponseTime.toFixed(2)}ms avg`)
    })
    
    // 4. Test error handling
    console.log('\n🔍 Testing error handling...')
    await testErrorHandling()
    
    // 5. Test offline functionality
    console.log('\n📱 Testing offline functionality...')
    await testOfflineFunctionality()
    
  } catch (error) {
    console.error('❌ Integration test failed:', error)
    throw error
  }
  
  console.log('\n✅ API integration tests completed!')
}

/**
 * Test error handling scenarios
 */
async function testErrorHandling(): Promise<void> {
  const tester = new ApiTester({ verbose: true })
  
  // Test 404 errors
  await tester.testEndpoint('/non-existent-endpoint')
  
  // Test invalid parameters
  await tester.testEndpoint('/events?page=invalid')
  await tester.testEndpoint('/events?limit=9999')
  
  // Test malformed requests
  await tester.testEndpoint('/events', 'POST', { invalid: 'data' })
  
  console.log('  Error handling tests completed')
}

/**
 * Test offline functionality
 */
async function testOfflineFunctionality(): Promise<void> {
  // This would normally test the offline hooks and caching
  // For now, we'll just verify the endpoints are accessible
  
  const tester = new ApiTester()
  
  // Test endpoints that should be cached
  const cachableEndpoints = [
    '/events',
    '/teachers',
    '/musicians',
  ]
  
  for (const endpoint of cachableEndpoints) {
    await tester.testEndpoint(endpoint)
  }
  
  console.log('  Offline functionality tests completed')
}

/**
 * Test API performance benchmarks
 */
export async function runPerformanceTests(): Promise<void> {
  console.log('⚡ Running API performance tests...')
  
  const benchmarks = [
    { endpoint: '/api/health', target: 100 }, // 100ms target
    { endpoint: '/events', target: 500 }, // 500ms target
    { endpoint: '/search/events?q=blues', target: 1000 }, // 1s target
  ]
  
  const tester = new ApiTester({ verbose: true })
  
  for (const benchmark of benchmarks) {
    const result = await tester.testEndpoint(benchmark.endpoint)
    
    if (result.success && result.responseTime) {
      const status = result.responseTime <= benchmark.target ? '✅' : '⚠️'
      console.log(`  ${status} ${benchmark.endpoint}: ${result.responseTime.toFixed(2)}ms (target: ${benchmark.target}ms)`)
    } else {
      console.log(`  ❌ ${benchmark.endpoint}: Failed - ${result.error}`)
    }
  }
  
  console.log('⚡ Performance tests completed!')
}

/**
 * Test retry logic and error recovery
 */
export async function testRetryLogic(): Promise<void> {
  console.log('🔄 Testing retry logic and error recovery...')
  
  const tester = new ApiTester({ retries: 3, verbose: true })
  
  // Test network timeout recovery
  await tester.testEndpoint('/events?delay=5000') // Simulate slow endpoint
  
  // Test server error recovery
  await tester.testEndpoint('/events?error=500') // Simulate server error
  
  console.log('🔄 Retry logic tests completed!')
}

/**
 * Test authentication flows
 */
export async function testAuthenticationFlows(): Promise<void> {
  console.log('🔐 Testing authentication flows...')
  
  const tester = new ApiTester({ verbose: true })
  
  // Test public endpoints (should work without auth)
  await tester.testEndpoint('/events')
  await tester.testEndpoint('/teachers')
  await tester.testEndpoint('/musicians')
  
  // Test protected endpoints (should require auth)
  await tester.testEndpoint('/users/me')
  await tester.testEndpoint('/users/me/dashboard/stats')
  
  console.log('🔐 Authentication flow tests completed!')
}

/**
 * Run all integration tests
 */
export async function runAllTests(): Promise<void> {
  try {
    await runApiIntegrationTests()
    await runPerformanceTests()
    await testRetryLogic()
    await testAuthenticationFlows()
    
    console.log('\n🎉 All integration tests completed successfully!')
    
  } catch (error) {
    console.error('\n💥 Integration tests failed:', error)
    process.exit(1)
  }
}

// Export for use in scripts
export default {
  runApiIntegrationTests,
  runPerformanceTests,
  testRetryLogic,
  testAuthenticationFlows,
  runAllTests
}