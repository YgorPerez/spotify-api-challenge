import { SignIn } from '@clerk/nextjs';
import { Button } from '@components/ui/Button';
import { toast } from '@hooks/use-toast';
import { type NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';

const TooltipProvider = dynamic(() =>
  import('@components/ui/Tooltip').then(mod => mod.TooltipProvider),
);
const TooltipContent = dynamic(() =>
  import('@components/ui/Tooltip').then(mod => mod.TooltipContent),
);
const TooltipTrigger = dynamic(() =>
  import('@components/ui/Tooltip').then(mod => mod.TooltipTrigger),
);
const Tooltip = dynamic(() =>
  import('@components/ui/Tooltip').then(mod => mod.Tooltip),
);
const Toaster = dynamic(() =>
  import('@components/ui/Toaster').then(mod => mod.Toaster),
);

const SignInPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <div className='h-screen w-screen bg-white'>
      <div className='fixed left-1/2 top-12 -translate-x-1/2 text-secondary-foreground sm:text-lg lg:top-[10%] xl:top-[15%] 2xl:top-[20%] 2xl:text-xl'>
        <p className='mx-2'>
          {t('sign-in:log-out')} <span className='text-green-600'>Spotify</span>
        </p>
        <p className='mt-4 text-center'>{t('sign-in:click-to-copy')}</p>
        <div className='mt-4 flex justify-between'>
          <TooltipProvider delayDuration={300} skipDelayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outlineSecondary'
                  onClick={() => {
                    void navigator.clipboard.writeText('55122zazaz@gmail.com');
                    toast({
                      title: t('sign-in:copy-success', { credential: 'email' }),
                    });
                  }}
                >
                  Email: 55122zazaz@gmail.com
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('sign-in:copy-to', { credential: 'email' })}</p>
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
                      title: t('sign-in:copy-success', {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        credential: t('sign-in:password'),
                      }),
                    });
                  }}
                >
                  {t('sign-in:Password')}: Pass@1234
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t('sign-in:copy-to', {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    credential: t('sign-in:password'),
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox:
              'fixed -translate-y-1/2 -translate-x-1/2 top-[60%] left-1/2',
            logoBox: 'justify-center',
            formButtonPrimary:
              'bg-slate-500 hover:bg-slate-400 text-sm normal-case',
            footer: 'hidden',
          },
        }}
        path='/auth/sign-in'
        routing='path'
        signUpUrl='/auth/sign-up'
        redirectUrl='/'
      />
      <Toaster />
    </div>
  );
};

export default SignInPage;
