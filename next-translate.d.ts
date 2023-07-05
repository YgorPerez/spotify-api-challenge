import type common from '.locales/en-US/common.json'
import type search from '.locales/en-US/search.json'
import type { I18n, Translate } from 'next-translate'

type Join<S1, S2> = S1 extends string
  ? S2 extends string
    ? `${S1}.${S2}`
    : never
  : never

export type Paths<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Join<K, Paths<T[K]>>
    : K
}[keyof T]

export interface TranslationsKeys {
  common: Paths<typeof common>
  search: Paths<typeof search>
}

export interface TypeSafeTranslate<Namespace extends keyof TranslationsKeys>
  extends Omit<I18n, 't'> {
  t: (
    key: TranslationsKeys[Namespace],
    ...rest: Tail<Parameters<Translate>>
  ) => string
}

declare module 'next-translate/useTranslation' {
  export default function useTranslation<
    Namespace extends keyof TranslationsKeys,
  >(namespace: Namespace): TypeSafeTranslate<Namespace>
}
