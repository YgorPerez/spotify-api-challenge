/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react'

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    whyDidYouRender(React, {
      trackAllPureComponents: true,
    })
  }
}
