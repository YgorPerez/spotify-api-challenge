/**
 * This is the client-side entrypoint for your tRPC API.
 * It is used to create the `api` object which contains the Next.js
 * App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types
 */
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { devtoolsLink } from 'trpc-client-devtools-link'

import { type AppRouter } from '../server/api/root'
import getBaseUrl from './getBaseUrl'
import { transformer } from './transformer'

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 3,
          },
        },
      },

      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       **/
      transformer: transformer,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       * */
      links: [
        // to enable trpc-client-devtools
        devtoolsLink({
          enabled: process.env.NODE_ENV !== 'production',
        }),
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV !== 'production' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
})
/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
