/**
 * Based on https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81
 * - see https://github.com/vercel/next.js/issues/3303#issuecomment-628400930
 * - see https://github.com/vercel/next.js/issues/12530#issuecomment-628864374
 */
import Router, { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useEffectOnce, useSessionStorage } from 'usehooks-ts'

type ScrollPosition =
  | {
      x: number
      y: number
    }
  | null
  | undefined

export const useScrollRestoration = (): void => {
  const router = useRouter()
  const path = router.asPath
  const [scrollPosition, setScrollPostion] = useSessionStorage<ScrollPosition>(
    `scrollPosition:${path}`,
    null,
  )

  useEffectOnce(() => {
    if (scrollPosition) {
      window.scrollTo(scrollPosition.x, scrollPosition.y)
    }
  })

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const userAgent = window.navigator.userAgent.toLowerCase()
    const isMobileSafari =
      /safari/.test(userAgent) && /iphone|ipod|ipad/.test(userAgent)
    window.history.scrollRestoration = isMobileSafari ? 'auto' : 'manual'

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      setScrollPostion({ x: window.scrollX, y: window.scrollY })
      delete event['returnValue']
    }

    const onRouteChangeStart = () => {
      setScrollPostion({ x: window.scrollX, y: window.scrollY })
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    Router.events.on('routeChangeStart', onRouteChangeStart)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      Router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [router, setScrollPostion])
}
