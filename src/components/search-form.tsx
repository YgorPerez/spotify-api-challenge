import { useRouter } from "next/router";
import React, { useState } from "react";

const SearchForm: React.FC<{ search: string }> = ({ search }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const setSearchQueryParam = (value: string) => {
    void router.push({
      pathname: router.pathname,
      query: { search: value },
    });
  };
  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
  }
  return (
    <>
      <form
        onSubmit={(e) => {
          submitHandler(e);
          setSearchQueryParam(searchQuery);
        }}
      >
        <label className="ml-2 text-left text-xl  text-white-gray">
          Busque por artistas, álbuns ou músicas
        </label>
        <input
          type="text"
          placeholder="Comece a escrever..."
          className="-m-px mt-4 h-16 w-full border-separate bg-dark-gray p-2 pb-8 text-left text-5xl font-bold text-white-gray outline-none placeholder:text-light-gray placeholder:opacity-100 focus:border-b-2 focus:border-light-gray 2xl:focus:border-b-4"
          value={searchQuery || search}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchQueryParam(e.target.value);
          }}
          ref={(input) => input && input.focus()}
        />
      </form>
    </>
  );
};

export default SearchForm;
