import { useRouter } from 'next/router'
import React from 'react'

const SearchForm: React.FC<{ search: string | null }> = ({ search }) => {
  const router = useRouter()
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
        <label className='ml-2 text-left text-xl  text-white-gray'>
          Busque por artistas, álbuns ou músicas
        </label>
        <input
          type='text'
          placeholder='Comece a escrever...'
          className='-m-px mt-4 h-16 w-full border-separate bg-dark-gray p-2 pb-8 text-left text-5xl font-bold text-white-gray outline-none placeholder:text-light-gray placeholder:opacity-100 focus:border-b-2 focus:border-light-gray 2xl:focus:border-b-4'
          defaultValue={search || ''}
          onChange={e => {
            setSearchQueryParam(e.target.value)
          }}
          ref={input => input && input.focus()}
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
