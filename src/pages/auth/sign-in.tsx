import { SignIn } from '@clerk/nextjs'
import { type NextPage } from 'next'

const SignInPage: NextPage = () => (
  <div className="justify-center items-center flex">
    <SignIn
      appearance={{
        elements: {
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
