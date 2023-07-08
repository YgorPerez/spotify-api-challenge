import { SignIn } from '@clerk/nextjs';
import { type NextPage } from 'next';

const SignInPage: NextPage = () => (
  <div className='h-screen w-screen bg-white'>
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
  </div>
);

export default SignInPage;
