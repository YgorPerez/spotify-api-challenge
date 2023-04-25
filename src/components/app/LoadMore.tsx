import Button from '@components/ui/Button'
import { Loader2 } from 'lucide-react'

interface Props {
  loadMore: () => void
  isLoading: boolean
}

const LoadMore: React.FC<Props> = ({ loadMore, isLoading }) => {
  return (
    <Button disabled={isLoading} onClick={() => loadMore()}>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Carregando...
        </>
      ) : (
        <>Carregar mais</>
      )}
    </Button>
  )
}

export default LoadMore
