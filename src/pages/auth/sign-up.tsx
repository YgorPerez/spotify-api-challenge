import { SignUp } from '@clerk/nextjs'
import { type NextPage } from 'next'

const SignUpPage: NextPage = () => (
  <div className='fixed translate-x-1/2 translate-y-2/3'>
    <SignUp
      appearance={{
        elements: {
          logoBox: 'justify-center',
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
