import { Button } from '@components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const GoBack: React.FC = () => {
  const { t } = useTranslation();

  const router = useRouter();
  return (
    <Button
      variant='link'
      onClick={() => router.back()}
      className='flex items-center px-0 text-white-gray sm:text-xl'
    >
      <ChevronLeft size='30' />
      <span className=''>{t('common:go-back')}</span>
    </Button>
  );
};

export default GoBack;
