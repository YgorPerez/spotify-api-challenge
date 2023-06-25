import { SignIn } from '@clerk/nextjs'
import { type NextPage } from 'next'

const SignInPage: NextPage = () => (
  <SignIn
    appearance={{
      elements: {
        rootBox: 'fixed -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2',
        logoBox: 'justify-center',
        formButtonPrimary:
          'bg-slate-500 hover:bg-slate-400 text-sm normal-case',
      },
    }}
    path='/auth/sign-in'
    routing='path'
    signUpUrl='/auth/sign-up'
    redirectUrl='/search'
  />
)

export default SignInPage
