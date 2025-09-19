import { apiClient } from './client'
import type { Event, Teacher, Musician, User } from '@/types'

/**
 * Test interface for API endpoints
 */
interface TestResult {
  endpoint: string
  method: string
  success: boolean
  responseTime?: number
  error?: string
  data?: any
}

/**
 * Test configuration
 */
interface TestConfig {
  timeout?: number
  retries?: number
  verbose?: boolean
}

/**
 * API endpoint tester
 */
export class ApiTester {
  private results: TestResult[] = []
  private config: TestConfig

  constructor(config: TestConfig = {}) {
    this.config = {
      timeout: 10000,
      retries: 1,
      verbose: false,
      ...config
    }
  }

  /**
   * Test a single endpoint
   */
  public async testEndpoint(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any
  ): Promise<TestResult> {
    const startTime = performance.now()
    
    const result: TestResult = {
      endpoint,
      method,
      success: false
    }

    try {
      let response
      
      switch (method) {
        case 'GET':
          response = await apiClient.get(endpoint, {
            timeout: this.config.timeout,
            retries: this.config.retries
          })
          break
        case 'POST':
          response = await apiClient.post(endpoint, data, {
            timeout: this.config.timeout,
            retries: this.config.retries
          })
          break
        case 'PUT':
          response = await apiClient.put(endpoint, data, {
            timeout: this.config.timeout,
            retries: this.config.retries
          })
          break
        case 'DELETE':
          response = await apiClient.delete(endpoint, {
            timeout: this.config.timeout,
            retries: this.config.retries
          })
          break
        case 'PATCH':
          response = await apiClient.patch(endpoint, data, {
            timeout: this.config.timeout,
            retries: this.config.retries
          })
          break
      }

      const endTime = performance.now()
      
      result.success = response.success
      result.responseTime = endTime - startTime
      result.data = response.data

      if (this.config.verbose) {
        console.log(`✅ ${method} ${endpoint} - ${result.responseTime.toFixed(2)}ms`)
      }

    } catch (error) {
      const endTime = performance.now()
      
      result.success = false
      result.responseTime = endTime - startTime
      result.error = error instanceof Error ? error.message : 'Unknown error'

      if (this.config.verbose) {
        console.error(`❌ ${method} ${endpoint} - ${result.error}`)
      }
    }

    this.results.push(result)
    return result
  }

  /**
   * Test all health endpoints
   */
  async testHealthEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/health'),
      () => this.testEndpoint('/api/health'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test authentication endpoints
   */
  async testAuthEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/auth/test'),
      () => this.testEndpoint('/users/me'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test events endpoints
   */
  async testEventsEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/events'),
      () => this.testEndpoint('/events?page=1&limit=10'),
      () => this.testEndpoint('/events?q=blues'),
      () => this.testEndpoint('/events?startDate=2024-01-01&endDate=2024-12-31'),
      () => this.testEndpoint('/events?city=New York'),
      () => this.testEndpoint('/events?sort=date'),
      () => this.testEndpoint('/events/test-event-id'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test teachers endpoints
   */
  async testTeachersEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/teachers'),
      () => this.testEndpoint('/teachers?page=1&limit=10'),
      () => this.testEndpoint('/teachers/test-teacher-id'),
      () => this.testEndpoint('/search/teachers?q=john'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test musicians endpoints
   */
  async testMusiciansEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/musicians'),
      () => this.testEndpoint('/musicians?page=1&limit=10'),
      () => this.testEndpoint('/musicians/test-musician-id'),
      () => this.testEndpoint('/search/musicians?q=blues'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test search endpoints
   */
  async testSearchEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/search/events?q=festival'),
      () => this.testEndpoint('/search/suggestions?q=blues'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test user endpoints (requires authentication)
   */
  async testUserEndpoints(): Promise<TestResult[]> {
    const tests = [
      () => this.testEndpoint('/users/me/dashboard/stats'),
      () => this.testEndpoint('/users/me/dashboard/events'),
      () => this.testEndpoint('/users/me/dashboard/updates'),
      () => this.testEndpoint('/users/me/saved-searches'),
    ]

    const results = await Promise.all(tests.map(test => test()))
    return results
  }

  /**
   * Test all endpoints
   */
  async testAllEndpoints(): Promise<{
    health: TestResult[]
    auth: TestResult[]
    events: TestResult[]
    teachers: TestResult[]
    musicians: TestResult[]
    search: TestResult[]
    users: TestResult[]
  }> {
    console.log('🧪 Starting API endpoint tests...')
    
    const [health, auth, events, teachers, musicians, search, users] = await Promise.all([
      this.testHealthEndpoints(),
      this.testAuthEndpoints(),
      this.testEventsEndpoints(),
      this.testTeachersEndpoints(),
      this.testMusiciansEndpoints(),
      this.testSearchEndpoints(),
      this.testUserEndpoints(),
    ])

    return {
      health,
      auth,
      events,
      teachers,
      musicians,
      search,
      users
    }
  }

  /**
   * Get test summary
   */
  getTestSummary(): {
    total: number
    passed: number
    failed: number
    averageResponseTime: number
    results: TestResult[]
  } {
    const total = this.results.length
    const passed = this.results.filter(r => r.success).length
    const failed = total - passed
    const averageResponseTime = this.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / total

    return {
      total,
      passed,
      failed,
      averageResponseTime,
      results: this.results
    }
  }

  /**
   * Clear test results
   */
  clearResults(): void {
    this.results = []
  }

  /**
   * Generate test report
   */
  generateReport(): string {
    const summary = this.getTestSummary()
    
    let report = `
API Endpoint Test Report
========================

Summary:
- Total tests: ${summary.total}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Success rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%
- Average response time: ${summary.averageResponseTime.toFixed(2)}ms

Detailed Results:
`

    summary.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌'
      const time = result.responseTime ? `${result.responseTime.toFixed(2)}ms` : 'N/A'
      const error = result.error ? ` (${result.error})` : ''
      
      report += `${index + 1}. ${status} ${result.method} ${result.endpoint} - ${time}${error}\n`
    })

    return report
  }
}

/**
 * Quick test function for development
 */
export async function quickTest(): Promise<void> {
  const tester = new ApiTester({ verbose: true })
  
  console.log('🚀 Running quick API test...')
  
  // Test essential endpoints
  await tester.testHealthEndpoints()
  await tester.testEventsEndpoints()
  
  const summary = tester.getTestSummary()
  console.log(`\n📊 Test Summary: ${summary.passed}/${summary.total} passed (${((summary.passed / summary.total) * 100).toFixed(1)}%)`)
  
  if (summary.failed > 0) {
    console.log('\n❌ Failed tests:')
    summary.results
      .filter(r => !r.success)
      .forEach(r => console.log(`  - ${r.method} ${r.endpoint}: ${r.error}`))
  }
}

/**
 * Load test for performance testing
 */
export async function loadTest(
  endpoint: string,
  concurrency: number = 10,
  duration: number = 30000
): Promise<{
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  requestsPerSecond: number
  errors: string[]
}> {
  const startTime = Date.now()
  const results: TestResult[] = []
  const errors: string[] = []
  
  console.log(`🔥 Load testing ${endpoint} with ${concurrency} concurrent users for ${duration/1000}s...`)
  
  const makeRequest = async (): Promise<void> => {
    const tester = new ApiTester()
    const result = await tester.testEndpoint(endpoint)
    results.push(result)
    
    if (!result.success && result.error) {
      errors.push(result.error)
    }
  }
  
  const workers: Promise<void>[] = []
  
  // Start concurrent workers
  for (let i = 0; i < concurrency; i++) {
    workers.push(
      (async () => {
        while (Date.now() - startTime < duration) {
          await makeRequest()
          await new Promise(resolve => setTimeout(resolve, 100)) // Small delay
        }
      })()
    )
  }
  
  await Promise.all(workers)
  
  const totalRequests = results.length
  const successfulRequests = results.filter(r => r.success).length
  const failedRequests = totalRequests - successfulRequests
  const averageResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalRequests
  const requestsPerSecond = totalRequests / (duration / 1000)
  
  console.log(`\n📈 Load Test Results:`)
  console.log(`  - Total requests: ${totalRequests}`)
  console.log(`  - Successful: ${successfulRequests}`)
  console.log(`  - Failed: ${failedRequests}`)
  console.log(`  - Success rate: ${((successfulRequests / totalRequests) * 100).toFixed(1)}%`)
  console.log(`  - Average response time: ${averageResponseTime.toFixed(2)}ms`)
  console.log(`  - Requests per second: ${requestsPerSecond.toFixed(2)}`)
  
  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageResponseTime,
    requestsPerSecond,
    errors: [...new Set(errors)] // Remove duplicates
  }
}

export default ApiTester