import { Button } from '@components/ui/Button';
import { Loader2 } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  fetchNextPage: () => void;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
}

const LoadMore: React.FC<Props> = ({
  fetchNextPage,
  isLoading,
  hasNextPage,
}) => {
  const { t } = useTranslation('common');

  return (
    <Button
      data-cy='button-load-more'
      className='sm:text-base'
      variant='secondary'
      disabled={isLoading || !hasNextPage}
      onClick={() => fetchNextPage()}
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          {t('loading')}
        </>
      ) : hasNextPage ? (
        <>{t('load-more')}</>
      ) : (
        <>{t('nothing-load')}</>
      )}
    </Button>
  );
};

export default LoadMore;
