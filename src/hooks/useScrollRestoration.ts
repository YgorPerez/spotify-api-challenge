/**
 * Based on https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81
 * - see https://github.com/vercel/next.js/issues/3303#issuecomment-628400930
 * - see https://github.com/vercel/next.js/issues/12530#issuecomment-628864374
 */
import Router, { useRouter } from 'next/router'
import { useEffect } from 'react'

type ScrollPosition =
  | {
      x: number
      y: number
    }
  | null
  | undefined

function saveScrollPosition(asPath: string) {
  sessionStorage.setItem(
    `scrollPosition:${asPath}`,
    JSON.stringify({ x: window.scrollX, y: window.scrollY }),
  )
}

function restoreScrollPosition(asPath: string) {
  const json = sessionStorage.getItem(`scrollPosition:${asPath}`)
  const scrollPosition = json ? (JSON.parse(json) as ScrollPosition) : undefined
   if (scrollPosition) {
    window.scrollTo(scrollPosition.x, scrollPosition.y)
  }
}

export const useScrollRestoration = (): void => {
  const router = useRouter()

  useEffect(() => {
    restoreScrollPosition(router.asPath)
  })

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const userAgent = window.navigator.userAgent.toLowerCase()
    const isMobileSafari =
      /safari/.test(userAgent) && /iphone|ipod|ipad/.test(userAgent)
    window.history.scrollRestoration = isMobileSafari ? 'auto' : 'manual'

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      saveScrollPosition(router.asPath)
      delete event['returnValue']
    }

    const onRouteChangeStart = () => {
      saveScrollPosition(router.asPath)
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    Router.events.on('routeChangeStart', onRouteChangeStart)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      Router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [router])
}
