import { useRouter } from "next/router";
import React, { useState } from "react";

const Search: React.FC<{ search: string }> = ({ search }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const setSearchQueryParam = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: { search: value },
    });
  };
  return (
    <>
      <input
        type="text"
        placeholder="Comece a escrever..."
        className="-m-px mt-4 h-16 w-full border-separate bg-dark-gray p-2 pb-8 text-left text-5xl font-bold text-white-gray outline-none placeholder:text-light-gray placeholder:opacity-100 focus:border-b-2 focus:border-light-gray 2xl:focus:border-b-4"
        autoFocus
        value={searchQuery || search}
        onChange={(e) => {
          setSearchQueryParam(e.target.value);
          setSearchQuery(e.target.value);
        }}
      />
    </>
  );
};

export default Search;
