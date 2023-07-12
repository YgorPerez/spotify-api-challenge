import { SignUp } from '@clerk/nextjs';
import { type NextPage } from 'next';

const SignUpPage: NextPage = () => (
  <div className='h-screen w-screen bg-white'>
    <SignUp
      appearance={{
        elements: {
          rootBox: 'fixed -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2',
          logoBox: 'justify-center',
          formButtonPrimary:
            'bg-slate-500 hover:bg-slate-400 text-sm normal-case',
        },
      }}
      path='/auth/sign-up'
      routing='path'
      signInUrl='/auth/sign-in'
      redirectUrl='/'
    />
  </div>
);

export default SignUpPage;
