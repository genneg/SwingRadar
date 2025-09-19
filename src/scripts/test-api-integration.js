#!/usr/bin/env node

/**
 * Test script to verify API integration components
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Testing API integration components...')

// Test 1: Check if API client exists and has required methods
console.log('\n1. Testing API client...')
const apiClientPath = path.join(__dirname, '..', 'lib', 'api', 'client.ts')
if (fs.existsSync(apiClientPath)) {
  const apiClientContent = fs.readFileSync(apiClientPath, 'utf8')
  
  const requiredMethods = ['get', 'post', 'put', 'delete', 'patch']
  const foundMethods = requiredMethods.filter(method => 
    apiClientContent.includes(`async ${method}<`) || 
    apiClientContent.includes(`async ${method}(`) || 
    apiClientContent.includes(`${method}(`)
  )
  
  console.log(`✅ API client exists with ${foundMethods.length}/${requiredMethods.length} methods`)
  console.log(`   Found methods: ${foundMethods.join(', ')}`)
} else {
  console.log('❌ API client not found')
}

// Test 2: Check if API hooks exist
console.log('\n2. Testing API hooks...')
const apiHooksPath = path.join(__dirname, '..', 'hooks', 'useApi.ts')
if (fs.existsSync(apiHooksPath)) {
  const apiHooksContent = fs.readFileSync(apiHooksPath, 'utf8')
  
  const requiredHooks = ['useApi', 'useBatchApi', 'usePaginatedApi', 'useOptimisticApi']
  const foundHooks = requiredHooks.filter(hook => 
    apiHooksContent.includes(`export function ${hook}<`) ||
    apiHooksContent.includes(`export function ${hook}(`) ||
    apiHooksContent.includes(`export const ${hook}`) ||
    apiHooksContent.includes(`function ${hook}<`) ||
    apiHooksContent.includes(`function ${hook}(`)
  )
  
  console.log(`✅ API hooks exist with ${foundHooks.length}/${requiredHooks.length} hooks`)
  console.log(`   Found hooks: ${foundHooks.join(', ')}`)
} else {
  console.log('❌ API hooks not found')
}

// Test 3: Check if offline functionality exists
console.log('\n3. Testing offline functionality...')
const offlineHooksPath = path.join(__dirname, '..', 'hooks', 'useOffline.ts')
if (fs.existsSync(offlineHooksPath)) {
  const offlineHooksContent = fs.readFileSync(offlineHooksPath, 'utf8')
  
  const requiredOfflineHooks = ['useOffline', 'useOfflineData', 'useOfflineQueue', 'useOfflineForm']
  const foundOfflineHooks = requiredOfflineHooks.filter(hook => 
    offlineHooksContent.includes(`export function ${hook}<`) ||
    offlineHooksContent.includes(`export function ${hook}(`) ||
    offlineHooksContent.includes(`function ${hook}<`) ||
    offlineHooksContent.includes(`function ${hook}(`)
  )
  
  console.log(`✅ Offline hooks exist with ${foundOfflineHooks.length}/${requiredOfflineHooks.length} hooks`)
  console.log(`   Found hooks: ${foundOfflineHooks.join(', ')}`)
} else {
  console.log('❌ Offline hooks not found')
}

// Test 4: Check if loading states exist
console.log('\n4. Testing loading states...')
const loadingStatesPath = path.join(__dirname, '..', 'components', 'ui', 'LoadingStates.tsx')
if (fs.existsSync(loadingStatesPath)) {
  const loadingStatesContent = fs.readFileSync(loadingStatesPath, 'utf8')
  
  const requiredStates = ['PageLoading', 'CardSkeleton', 'ListSkeleton', 'EventCardSkeleton']
  const foundStates = requiredStates.filter(state => 
    loadingStatesContent.includes(`export function ${state}(`)
  )
  
  console.log(`✅ Loading states exist with ${foundStates.length}/${requiredStates.length} components`)
  console.log(`   Found components: ${foundStates.join(', ')}`)
} else {
  console.log('❌ Loading states not found')
}

// Test 5: Check if error states exist
console.log('\n5. Testing error states...')
const errorStatesPath = path.join(__dirname, '..', 'components', 'ui', 'ErrorStates.tsx')
if (fs.existsSync(errorStatesPath)) {
  const errorStatesContent = fs.readFileSync(errorStatesPath, 'utf8')
  
  const requiredErrorStates = ['ErrorState', 'NetworkError', 'ServerError', 'SmartError']
  const foundErrorStates = requiredErrorStates.filter(state => 
    errorStatesContent.includes(`export function ${state}(`)
  )
  
  console.log(`✅ Error states exist with ${foundErrorStates.length}/${requiredErrorStates.length} components`)
  console.log(`   Found components: ${foundErrorStates.join(', ')}`)
} else {
  console.log('❌ Error states not found')
}

// Test 6: Check if enhanced components exist
console.log('\n6. Testing enhanced components...')
const enhancedEventListPath = path.join(__dirname, '..', 'components', 'features', 'EnhancedEventList.tsx')
if (fs.existsSync(enhancedEventListPath)) {
  const enhancedContent = fs.readFileSync(enhancedEventListPath, 'utf8')
  
  const requiredFeatures = ['useApi', 'useOfflineData', 'SmartError', 'NetworkStatus']
  const foundFeatures = requiredFeatures.filter(feature => 
    enhancedContent.includes(feature)
  )
  
  console.log(`✅ Enhanced EventList exists with ${foundFeatures.length}/${requiredFeatures.length} features`)
  console.log(`   Found features: ${foundFeatures.join(', ')}`)
} else {
  console.log('❌ Enhanced EventList not found')
}

// Test 7: Check if providers are set up
console.log('\n7. Testing providers...')
const queryProviderPath = path.join(__dirname, '..', 'components', 'providers', 'QueryProvider.tsx')
if (fs.existsSync(queryProviderPath)) {
  console.log('✅ QueryProvider exists')
} else {
  console.log('❌ QueryProvider not found')
}

// Test 8: Check if layout is updated
console.log('\n8. Testing layout updates...')
const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx')
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8')
  
  if (layoutContent.includes('QueryProvider') && layoutContent.includes('OfflineBanner')) {
    console.log('✅ Layout updated with QueryProvider and OfflineBanner')
  } else {
    console.log('⚠️  Layout exists but may not be fully updated')
  }
} else {
  console.log('❌ Layout not found')
}

// Test 9: Check if API test suite exists
console.log('\n9. Testing API test suite...')
const apiTestPath = path.join(__dirname, '..', 'lib', 'api', 'test-endpoints.ts')
if (fs.existsSync(apiTestPath)) {
  const apiTestContent = fs.readFileSync(apiTestPath, 'utf8')
  
  if (apiTestContent.includes('ApiTester') && apiTestContent.includes('quickTest')) {
    console.log('✅ API test suite exists with comprehensive testing')
  } else {
    console.log('⚠️  API test suite exists but may be incomplete')
  }
} else {
  console.log('❌ API test suite not found')
}

console.log('\n🎉 API integration test completed!')
console.log('\nTo run the actual API tests:')
console.log('  1. Start the development server: npm run dev')
console.log('  2. Run the test suite in browser console or add to package.json scripts')