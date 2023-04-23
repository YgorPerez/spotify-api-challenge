import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

const GoBack: React.FC = () => {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className='ml-8 flex items-center text-xl text-white-gray'
    >
      <FontAwesomeIcon icon={faAngleLeft} />
      <span className='ml-2'>Voltar</span>
    </button>
  )
}

export default GoBack
