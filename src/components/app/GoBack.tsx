import { Button } from '@components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const GoBack: React.FC = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  return (
    <Button
      data-cy='go-back'
      variant='link'
      onClick={() => router.back()}
      className='flex items-center px-0 sm:text-xl'
    >
      <ChevronLeft size='30' />
      <span className=''>{t('go-back')}</span>
    </Button>
  );
};

export default GoBack;
