#!/usr/bin/env node

/**
 * Test script to verify NextAuth.js configuration
 * This script checks if all authentication providers and settings are properly configured
 */

const { authOptions } = require('../src/lib/auth/config.ts')

async function testAuthConfiguration() {
  console.log('🔍 Testing NextAuth.js Configuration...\n')

  try {
    // Test 1: Check if authOptions is properly configured
    console.log('✅ Test 1: Auth options loaded successfully')
    
    // Test 2: Check providers
    const providers = authOptions.providers || []
    console.log(`✅ Test 2: Found ${providers.length} authentication providers:`)
    providers.forEach(provider => {
      console.log(`   - ${provider.name} (${provider.type})`)
    })

    // Test 3: Check required environment variables
    console.log('\n🔧 Environment Variables Check:')
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'DATABASE_URL'
    ]

    const optionalVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET', 
      'FACEBOOK_CLIENT_ID',
      'FACEBOOK_CLIENT_SECRET'
    ]

    requiredVars.forEach(varName => {
      const value = process.env[varName]
      if (value) {
        console.log(`   ✅ ${varName}: ${value.substring(0, 20)}...`)
      } else {
        console.log(`   ❌ ${varName}: Missing (required)`)
      }
    })

    optionalVars.forEach(varName => {
      const value = process.env[varName]
      if (value && value !== `your-${varName.toLowerCase().replace('_', '-')}`) {
        console.log(`   ✅ ${varName}: Configured`)
      } else {
        console.log(`   ⚠️  ${varName}: Not configured (optional for OAuth)`)
      }
    })

    // Test 4: Check database adapter
    if (authOptions.adapter) {
      console.log('\n✅ Test 4: Database adapter configured')
    } else {
      console.log('\n❌ Test 4: Database adapter missing')
    }

    // Test 5: Check session configuration
    if (authOptions.session) {
      console.log(`✅ Test 5: Session strategy: ${authOptions.session.strategy}`)
      console.log(`   Max age: ${authOptions.session.maxAge} seconds`)
    } else {
      console.log('\n❌ Test 5: Session configuration missing')
    }

    // Test 6: Check custom pages
    if (authOptions.pages) {
      console.log('\n✅ Test 6: Custom pages configured:')
      Object.entries(authOptions.pages).forEach(([key, path]) => {
        console.log(`   - ${key}: ${path}`)
      })
    }

    // Test 7: Check callbacks
    if (authOptions.callbacks) {
      console.log('\n✅ Test 7: Callbacks configured:')
      Object.keys(authOptions.callbacks).forEach(callback => {
        console.log(`   - ${callback}`)
      })
    }

    console.log('\n🎉 NextAuth.js configuration test completed!')
    console.log('\n📝 Next Steps:')
    console.log('1. Set up OAuth credentials (see docs/oauth-setup.md)')
    console.log('2. Start development server: npm run dev')
    console.log('3. Test authentication at: http://localhost:3000/auth/signin')
    console.log('4. Check auth status at: http://localhost:3000/api/auth/test')

  } catch (error) {
    console.error('❌ Configuration test failed:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('1. Check if all dependencies are installed: npm install')
    console.error('2. Verify .env file exists and has correct variables')
    console.error('3. Check if database schema is applied: npm run db:generate')
    console.error('4. Review auth configuration in src/lib/auth/config.ts')
    process.exit(1)
  }
}

// Run the test
testAuthConfiguration()