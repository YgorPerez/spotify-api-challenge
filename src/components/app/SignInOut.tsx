import { SignInButton, useClerk, useUser } from '@clerk/nextjs'
import Button from '@components/ui/Button'
import { api } from '../../utils/api'

const SignInOut: React.FC = () => {
  const user = useUser()
  const { signOut } = useClerk()

  const { data: secretMessage } = api.user.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: user.isSignedIn !== undefined },
  )

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-center text-2xl text-white-gray'>
        {user.isSignedIn && <span>Logged in as {user.user?.fullName}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      {user.isSignedIn ? (
        <Button
          onClick={() => void signOut()}
          className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white-gray no-underline transition hover:bg-white/20'
        >
          Sign out
        </Button>
      ) : (
        <SignInButton mode='modal'>
          <button className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white-gray no-underline transition hover:bg-white/20'>
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  )
}

export default SignInOut
