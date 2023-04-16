/**
 * Based on https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81
 * - see https://github.com/vercel/next.js/issues/3303#issuecomment-628400930
 * - see https://github.com/vercel/next.js/issues/12530#issuecomment-628864374
 */
import Router, { useRouter } from 'next/router'
import { useEffect } from 'react'

type ScrollPos =
  | {
    x: number
    y: number
  }
  | null
  | undefined

function saveScrollPos(asPath: string) {
  sessionStorage.setItem(
    `scrollPosition:${asPath}`,
    JSON.stringify({ x: window.scrollX, y: window.scrollY }),
  )
}

function restoreScrollPos(asPath: string) {
  const json = sessionStorage.getItem(`scrollPosition:${asPath}`)
  const scrollPos = json ? (JSON.parse(json) as ScrollPos) : undefined
  if (scrollPos) {
    window.scrollTo(scrollPos.x, scrollPos.y)
  }
}

export const useScrollRestoration = (): void => {
  const router = useRouter()

  useEffect(() => {
    restoreScrollPos(router.asPath)
  })

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const userAgent = window.navigator.userAgent.toLowerCase()
    const isMobileSafari =
      /safari/.test(userAgent) && /iphone|ipod|ipad/.test(userAgent)
    window.history.scrollRestoration = isMobileSafari ? 'auto' : 'manual'

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      saveScrollPos(router.asPath)
      delete event['returnValue']
    }

    const onRouteChangeStart = () => {
      saveScrollPos(router.asPath)
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    Router.events.on('routeChangeStart', onRouteChangeStart)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      Router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [router])
}
