import Button from '@components/ui/Button'
import { Loader2 } from 'lucide-react'

interface Props {
  fetchNextPage: () => void
  isLoading: boolean
  hasNextPage: boolean | undefined
}

const LoadMore: React.FC<Props> = ({
  fetchNextPage,
  isLoading,
  hasNextPage,
}) => {
  return (
    <Button
      variant='secondary'
      disabled={isLoading || !hasNextPage}
      onClick={() => fetchNextPage()}
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Loading...
        </>
      ) : hasNextPage ? (
        <>Load more</>
      ) : (
        <>Nothing more to load</>
      )}
    </Button>
  )
}

export default LoadMore
