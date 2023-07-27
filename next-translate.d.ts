/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { I18n, Paths, Translate } from 'next-translate';

export interface TranslationsKeys {
  // Example with "common" and "home" namespaces in "en" (the default language):
  common: Paths<typeof import('./locales/en-US/common.json')>;
  search: Paths<typeof import('./locales/en-US/search.json')>;
  // Specify here all the namespaces you have...
}

export interface TypeSafeTranslate<Namespace extends keyof TranslationsKeys>
  extends Omit<I18n, 't'> {
  t: {
    (
      key: TranslationsKeys[Namespace],
      ...rest: Tail<Parameters<Translate>>
    ): string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <T extends string>(template: TemplateStringsArray): string;
  };
}

declare module 'next-translate/useTranslation' {
  export default function useTranslation<
    Namespace extends keyof TranslationsKeys,
  >(namespace: Namespace): TypeSafeTranslate<Namespace>;
}
