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
  const { t } = useTranslation();

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
          {t('common:loading')}
        </>
      ) : hasNextPage ? (
        <>{t('common:load-more')}</>
      ) : (
        <>{t('common:nothing-load')}</>
      )}
    </Button>
  );
};

export default LoadMore;
