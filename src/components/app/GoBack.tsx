import Button  from '@components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'

const GoBack: React.FC = () => {
  const router = useRouter()
  return (
    <Button
      variant='link'
      onClick={() => router.back()}
      className='ml-8 flex items-center text-xl text-white-gray'
    >
      <ChevronLeft size='30' />
      <span className='ml-2'>Voltar</span>
    </Button>
  )
}

export default GoBack
