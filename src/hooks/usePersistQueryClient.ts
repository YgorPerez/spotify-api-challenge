import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useQueryClient } from '@tanstack/react-query'
import {
  persistQueryClient,
  removeOldestQuery,
  type PersistedClient,
} from '@tanstack/react-query-persist-client'
import { useEffectOnce } from 'usehooks-ts'

const usePersistQueryClient = () => {
  const queryClient = useQueryClient()
  useEffectOnce(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      throttleTime: 1000,
      retry: removeOldestQuery,
      serialize: data => JSON.stringify(data),
      deserialize: data => JSON.parse(data) as PersistedClient,
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: Infinity,
    })
  })
}

export default usePersistQueryClient
