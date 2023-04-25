// https://github.com/vercel/next.js/discussions/32243
// https://github.com/vercel/next.js/discussions/19611
// https://twitter.com/TkDodo/status/1558752788393476096

// makes gssp run only once
import PageRouter from 'next/router'
import { useEffect } from 'react'

export const useSSRIntercept = () => {
  useEffect(() => {
    if (!PageRouter.router?.components) return

    const pageLoader = PageRouter.router.pageLoader
    if (!pageLoader) return

    for (const key in PageRouter.router.components) {
      if (key !== '/_app') delete PageRouter.router.components[key]
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { loadPage: originalLoadPage } = pageLoader
    pageLoader.loadPage = (...args) =>
      originalLoadPage.apply(pageLoader, args).then(pageCache => ({
        ...pageCache,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mod: {
          ...pageCache.mod,
          __N_SSP: false,
        },
      }))

    return () => {
      pageLoader.loadPage = originalLoadPage
    }
  }, [])
}
