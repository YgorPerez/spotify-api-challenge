import ScrollArea from '@components/ui/ScrollArea';
import Skeleton from '@components/ui/Skeleton';
import useTranslation from 'next-translate/useTranslation';
import { type FC } from 'react';

const Lyrics: FC<{
  lyrics: string | null | undefined;
  isFetching: boolean;
  isError: boolean;
}> = ({ lyrics, isFetching, isError }) => {
  const { t } = useTranslation();

  if (!lyrics && !isError && isFetching) {
    return (
      <div className='grid w-full place-items-center lg:w-1/2'>
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
        <Skeleton className='my-2 h-5 w-[28ch] sm:w-[55ch] lg:my-0 lg:w-[60ch] xl:w-[80ch] 2xl:h-6' />
      </div>
    );
  } else if ((!lyrics && !isError) || (!lyrics && !isFetching)) {
    return (
      <div className='grid w-1/2 place-items-center'>
        <p className='text-2x text-center 2xl:text-4xl'>
          {t('common:lyrics-not-found')}
        </p>
      </div>
    );
  }
  return (
    <ScrollArea className='mb-36 p-4 lg:mb-0 lg:ml-8 lg:max-h-[75vh] xl:ml-12 2xl:ml-16'>
      <div className='flex justify-center'>
        <p className='prose prose-base whitespace-pre-wrap text-foreground sm:prose-lg lg:prose-xl xl:prose-2xl lg:w-[55vw]'>
          {lyrics}
        </p>
      </div>
    </ScrollArea>
  );
};

export default Lyrics;
