import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useQueryClient } from '@tanstack/react-query'
import {
  persistQueryClient,
  removeOldestQuery,
  type PersistedClient,
} from '@tanstack/react-query-persist-client'
import { compress, decompress } from 'lz-string'
import { useEffectOnce } from 'usehooks-ts'

const usePersistQueryClient = () => {
  const queryClient = useQueryClient()
  useEffectOnce(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      retry: removeOldestQuery,
      serialize: data => compress(JSON.stringify(data)),
      deserialize: data => JSON.parse(decompress(data)) as PersistedClient,
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: Infinity,
    })

    // syncs the query client between browser tabs/windows with the same origin.
    broadcastQueryClient({
      queryClient,
    })
  })
}

export default usePersistQueryClient
