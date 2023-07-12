import { SignIn } from '@clerk/nextjs';
import { Button } from '@components/ui/Button';
import { Toaster } from '@components/ui/Toaster';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/Tooltip';
import { toast } from '@hooks/use-toast';
import { type NextPage } from 'next';

const SignInPage: NextPage = () => {
  return (
    <div className='h-screen w-screen bg-white'>
      <div className='fixed left-1/2 top-[20%] -translate-x-1/2 text-secondary-foreground'>
        <p>
          Log out of your Spotify account and use these credentials for Signing
          in the <span className='text-green-600'>Spotify</span>
        </p>
        <div className='mt-4 flex justify-between'>
          <TooltipProvider delayDuration={300} skipDelayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outlineSecondary'
                  onClick={() => {
                    void navigator.clipboard.writeText('55122zazaz@gmail.com');
                    toast({
                      title: 'Copied email with success',
                    });
                  }}
                >
                  Email: 55122zazaz@gmail.com
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy email to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300} skipDelayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outlineSecondary'
                  onClick={() => {
                    void navigator.clipboard.writeText('Pass@1234');
                    toast({
                      title: 'Copied password with success',
                    });
                  }}
                >
                  Password: Pass@1234
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy password to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'fixed -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2',
            logoBox: 'justify-center',
            formButtonPrimary:
              'bg-slate-500 hover:bg-slate-400 text-sm normal-case',
            footer: 'hidden',
          },
        }}
        path='/auth/sign-in'
        routing='path'
        signUpUrl='/auth/sign-up'
        redirectUrl='/search'
      />
      <Toaster />
    </div>
  );
};

export default SignInPage;
