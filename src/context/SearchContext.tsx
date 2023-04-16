import type { inferRouterOutputs } from '@trpc/server';
import { createContext, useContext, useState } from 'react';
import type { AppRouter } from '../server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;
type getSearchOutput = RouterOutput['spotify']['getSearch'];
type Pages = getSearchOutput[]

type SearchContextType = {
  pages: Pages | null;
  searchTerm: string;
  updatePages: ({ pages, searchTerm }: { pages: Pages | null, searchTerm: string }) => void;
};

export const SearchContext = createContext<SearchContextType>({
  pages: null,
  searchTerm: '',
  updatePages: () => {
    return
  },
});

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [pages, setPages] = useState<Pages | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const updatePages = ({ pages, searchTerm }: { pages: Pages | null, searchTerm: string }) => {
    setPages(pages);
    setSearchTerm(searchTerm);
  };

  return (
    <SearchContext.Provider value={{ pages, searchTerm, updatePages }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext)

export default SearchContextProvider;
