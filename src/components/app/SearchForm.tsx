import Label from '@components/ui/Label';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useId, type FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';

const SearchForm: FC<{ search: string | null }> = ({ search }) => {
  const router = useRouter();
  const formId = useId();
  const setSearchQueryParam = (value: string) => {
    void router.push(
      {
        query: {
          ...router.query,
          search: value,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  // performance optimization, it's much faster to change
  useEffectOnce(() => {
    !search && setSearchQueryParam('');
  });

  const { t } = useTranslation('search');

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
  }
  return (
    <>
      <form
        onSubmit={e => {
          submitHandler(e);
        }}
      >
        <div className='mt-6 flex justify-center text-primary sm:mt-0 sm:block sm:text-left'>
          <Label
            className='ml-2 w-4/5 sm:text-left sm:text-xl'
            htmlFor={`search-${formId}`}
          >
            {t('search-for')}
          </Label>
        </div>
        <div className='flex justify-center'>
          <input
            type='search'
            autoFocus
            id={`search-${formId}`}
            data-cy='search-input'
            placeholder={t('input-placeholder')}
            className='search-cancel:invert-100 mt-4 h-8 w-4/5 border-separate bg-background p-1 pb-2 text-2xl font-bold text-primary outline-none placeholder:text-primary-foreground placeholder:opacity-100 focus:border-b-2 focus:border-border search-cancel:ml-2 search-cancel:brightness-[1.08] search-cancel:contrast-[1.01] search-cancel:hue-rotate-[336deg]  search-cancel:saturate-[0] search-cancel:sepia-[.04] sm:-m-px sm:mt-4 sm:h-16 sm:w-full sm:p-3 sm:pb-4 sm:text-left sm:text-4xl sm:focus:border-b-4 lg:pb-8 xl:text-5xl'
            defaultValue={search || ''}
            onInput={e => {
              setSearchQueryParam(e.currentTarget.value.trim().toLowerCase());
            }}
            maxLength={20}
            // set cursor to the end
            onFocus={e =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length,
              )
            }
          />
        </div>
      </form>
    </>
  );
};

export default SearchForm;
