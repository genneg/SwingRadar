// NextAuth.js configuration for SwingRadar
// This file configures authentication providers and session management
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'


import { findUserByEmail } from '../db/postgres'

export const authOptions: NextAuthOptions = {
  // Note: PrismaAdapter commented out for JWT session strategy
  // adapter: PrismaAdapter(db) as Adapter,

  // Secret key for JWT and session encryption
  secret: process.env.NEXTAUTH_SECRET,

  // Configure authentication providers
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      // Force redirect mode instead of popup
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Facebook OAuth provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'email',
        },
      },
    }),

    // Email/password credentials provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      // Force form-based authentication instead of popup
      id: 'credentials',
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('NextAuth authorize: Missing credentials')
          return null
        }

        try {
          console.log('NextAuth authorize: Attempting to authenticate user:', credentials.email)

          // Find user by email with account information using direct PostgreSQL
          const user = await findUserByEmail(credentials.email)

          if (!user) {
            console.error('NextAuth authorize: No user found with email:', credentials.email)
            return null
          }

          // Find the credentials account for this user
          const credentialsAccount = user.accounts.find(
            account => account.provider === 'credentials'
          )

          if (!credentialsAccount?.password) {
            console.error('NextAuth authorize: No credentials account found for user:', user.email)
            return null
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            credentialsAccount.password
          )

          if (!passwordMatch) {
            console.error('NextAuth authorize: Password mismatch for user:', user.email)
            return null
          }

          console.log('NextAuth authorize: User authenticated successfully:', user.email)

          // Return user object for NextAuth
          const authUser = {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            verified: user.verified,
          }

          console.log('NextAuth authorize: Returning user object:', authUser)
          return authUser
        } catch (error) {
          console.error('NextAuth authorize: Authorization error:', error)
          return null
        }
      },
    }),
  ],

  // Configure session strategy - using JWT for credentials compatibility
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days for better security
    updateAge: 24 * 60 * 60, // 24 hours - refresh session daily
  },

  // Configure JWT tokens (when using JWT strategy)
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days matching session
  },

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/auth/welcome',
  },

  // Callbacks for customizing behavior
  callbacks: {
    // Called when user signs in
    async signIn({ user, account: _account }) {
      if (!user.email) {
        console.error('NextAuth signIn failed: No email provided')
        return false
      }
      return true
    },

    // Called when session is checked (JWT strategy)
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string || token.sub as string
        session.user.verified = token.verified as boolean || false
      }
      return session
    },

    // Called when JWT token is created (JWT strategy)
    async jwt({ token, user }) {
      if (user) {
        // Store user data in token
        token.id = user.id
        token.verified = user.verified || false
        // Also store in sub for compatibility
        token.sub = user.id
      }
      return token
    },
  },

  // Enable debug mode in development only
  debug: process.env.NODE_ENV === 'development',

  // Configure logger
  logger: {
    error(code, metadata) {
      console.error(`NextAuth Error [${code}]:`, metadata)
    },
    warn(code) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`NextAuth Warning [${code}]`)
      }
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`NextAuth Debug [${code}]:`, metadata)
      }
    },
  },

  // Security configuration - Let NextAuth handle cookies automatically
  useSecureCookies: process.env.NODE_ENV === 'production',
}

export default authOptions
