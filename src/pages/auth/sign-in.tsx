import { SignIn } from '@clerk/nextjs'
import { type NextPage } from 'next'

const SignInPage: NextPage = () => (
  <div className='fixed translate-x-1/2 translate-y-2/3'>
    <SignIn
      appearance={{
        elements: {
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
  </div>
)

export default SignInPage
