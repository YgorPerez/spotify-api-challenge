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
      <div className='grid w-1/2 place-items-center'>
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
        <Skeleton className='h-5 w-[80ch] 2xl:h-6' />
      </div>
    );
  } else if ((!lyrics && !isError) || (!lyrics && !isFetching)) {
    return (
      <div className='grid w-1/2 place-items-center'>
        <p className='text-center text-2xl text-white 2xl:text-4xl'>
          {t('common:loading')}
        </p>
      </div>
    );
  }
  return (
    <ScrollArea className='max-h-[70vh] max-w-[50vw] translate-x-1/4 p-4'>
      <p className='prose whitespace-pre text-white lg:prose-xl xl:prose-2xl'>
        {lyrics}
      </p>
    </ScrollArea>
  );
};

export default Lyrics;