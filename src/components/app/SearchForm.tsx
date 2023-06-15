import Label from '@components/ui/Label'
import { useRouter } from 'next/router'
import React, { useId } from 'react'
import { useEffectOnce } from 'usehooks-ts'

const SearchForm: React.FC<{ search: string | null }> = ({ search }) => {
  const router = useRouter()
  const formId = useId()
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
    )
  }

  // performance optimization, it's much faster to change
  // the serch query after it's already on the query params
  useEffectOnce(() => {
    !search && setSearchQueryParam('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  function submitHandler(e: React.FormEvent) {
    e.preventDefault()
  }
  return (
    <>
      <form
        onSubmit={e => {
          submitHandler(e)
        }}
      >
        <Label
          className='ml-2 text-left text-xl text-white-gray'
          htmlFor={`search-${formId}`}
        >
          Search for artists, albums or tracks
        </Label>
        <input
          type='search'
          autoFocus
          id={`search-${formId}`}
          placeholder='Start typing...'
          className='search-cancel:invert-100 -m-px mt-4 h-16 w-full border-separate bg-dark-gray p-2 pb-8 text-left text-5xl font-bold text-white-gray outline-none placeholder:text-light-gray placeholder:opacity-100 search-cancel:brightness-[1.08] search-cancel:contrast-[1.01] search-cancel:hue-rotate-[336deg] search-cancel:saturate-[0] search-cancel:sepia-[.04] focus:border-b-2 focus:border-light-gray 2xl:focus:border-b-4'
          defaultValue={search || ''}
          onInput={e => {
            setSearchQueryParam(e.currentTarget.value)
          }}
          // set cursor to the end
          onFocus={e =>
            e.currentTarget.setSelectionRange(
              e.currentTarget.value.length,
              e.currentTarget.value.length,
            )
          }
        />
      </form>
    </>
  )
}

export default SearchForm
