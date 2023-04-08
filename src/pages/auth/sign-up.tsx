import { SignUp } from '@clerk/nextjs'
import { type NextPage } from 'next'

const SignUpPage: NextPage = () => (
  <div className='justify-center items-center'>
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
  </div>
)

export default SignUpPage
