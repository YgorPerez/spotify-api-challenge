import NextAuth from 'next-auth'
import { authOptions } from '../../../server/lib/auth'

export default NextAuth(authOptions)
