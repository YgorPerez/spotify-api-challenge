import Button from '@components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

const GoBack: React.FC = () => {
  const { t } = useTranslation()

  const router = useRouter()
  return (
    <Button
      variant='link'
      onClick={() => router.back()}
      className='ml-8 flex items-center text-xl text-white-gray'
    >
      <ChevronLeft size='30' />
      <span className='ml-2'>{t('common:go-back')}</span>
    </Button>
  )
}

export default GoBack
