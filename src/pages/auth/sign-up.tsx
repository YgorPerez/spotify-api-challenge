import { SignUp } from '@clerk/nextjs'
import { type NextPage } from 'next'
import React from 'react'

const SignUpPage: NextPage = () => (
  <SignUp
    appearance={{
      elements: {
        formButtonPrimary:
          'bg-slate-500 hover:bg-slate-400 text-sm normal-case',
      },
    }}
    path='/auth/sign-up'
    routing='path'
    signInUrl='/auth/sign-in'
    redirectUrl='/search'
  />
)

export default SignUpPage
