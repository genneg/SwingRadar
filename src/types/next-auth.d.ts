// NextAuth.js type declarations for Festival Scout
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      verified: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    verified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    verified: boolean
  }
}