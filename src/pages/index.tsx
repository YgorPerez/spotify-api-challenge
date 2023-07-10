import SearchForm from '@components/app/SearchForm';
import Footer from '@components/ui/Footer';
import useGetLastSearchedAlbum from '@hooks/useGetLastSearchedAlbums';
import useGetSearch from '@hooks/useGetSearch';
import { ssrHelper } from '@utils/ssrHelper';
import { stringOrNull } from '@utils/stringOrNull';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useRef } from 'react';
import {
  useDebounce,
  useIntersectionObserver,
  useLocalStorage,
} from 'usehooks-ts';

const SpotifyCard = dynamic(() => import('@components/app/SpotifyCard'), {
  loading: () => <p>Loading...</p>,
});

const Header = dynamic(() => import('@components/ui/Header'), {
  loading: () => <p>Loading...</p>,
});

interface Props {
  searchTerm: string | null;
}

const searchLimit = 5;

const generateLoadingData = (amount: number) => {
  const loadingData = [];
  for (let i = 1; i <= amount; i++) {
    loadingData.push(<SpotifyCard cardData={null} key={i} />);
  }
  return loadingData;
};

const loadingData = generateLoadingData(searchLimit * 3);

const SearchPage: NextPage<Props> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const router = useRouter();
  const queryRouter = router.query.search as string | undefined;

  const { t } = useTranslation();

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useIntersectionObserver(ref, {
    threshold: 0,
    rootMargin: '30%',
  });

  const [lastSearchTerm, setLastSearchTerm] = useLocalStorage(
    'lastSearchTerm',
    '',
  );

  const searchTerm = stringOrNull(
    props.searchTerm ? props.searchTerm : queryRouter,
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchOptions = {
    searchTerm: debouncedSearchTerm as string,
    enabled: Boolean(debouncedSearchTerm),
    limit: searchLimit,
  };

  const {
    data: allSearchData,
    isError,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetSearch(searchOptions);

  useEffect(() => {
    if (inView?.isIntersecting && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetching]);

  if (isError) {
    throw new Error(error.message);
  }

  const isUserTyping = searchTerm !== debouncedSearchTerm;
  const isLoadingFirstPage =
    (isFetching && !isFetchingNextPage) || isUserTyping;
  const shouldDisplayLoadingData = (isFetching || isUserTyping) && searchTerm;
  const searchData = allSearchData?.pages;
  const shouldDisplayData =
    (searchData?.[0]?.albums?.[0] ||
      searchData?.[0]?.tracks?.[0] ||
      searchData?.[0]?.artists?.[0]) &&
    searchTerm &&
    !isLoadingFirstPage;

  useEffect(() => {
    if (shouldDisplayData) {
      setLastSearchTerm(searchTerm);
    }
  }, [searchTerm, setLastSearchTerm, shouldDisplayData]);

  const lastSearchedAlbums = useGetLastSearchedAlbum(lastSearchTerm);

  return (
    <>
      <NextSeo
        title={t('search:title')}
        description={t('search:description')}
      />
      <SiteLinksSearchBoxJsonLd
        url='spotify-api-challenge.vercel.app/'
        potentialActions={[
          {
            target: 'spotify-api-challenge.vercel.app/?search',
            queryInput: searchTerm ?? 'Taylor',
          },
        ]}
      />
      <div>
        <div className='min-h-[calc(100vh_-_4em_-_5px)]'>
          <Header />
          <main className='flex min-h-max flex-col'>
            <div>
              <div className='sm:mx-32 sm:mb-8'>
                <SearchForm search={searchTerm} />
                <div className='ml-8 sm:ml-0'>
                  {shouldDisplayData || shouldDisplayLoadingData ? (
                    <h1 className='my-4 mt-6 text-primary sm:mt-14 sm:text-2xl xl:text-3xl'>
                      {t('search:results-for')} &#8220;{searchTerm}&#8221;
                    </h1>
                  ) : searchTerm ? (
                    <h1 className='my-4 mt-6 text-primary sm:mt-14 sm:text-2xl xl:text-3xl'>
                      {t('search:no-results')} &#8220;{searchTerm}&#8221;
                    </h1>
                  ) : lastSearchedAlbums[0] ? (
                    <h1 className='my-4 mt-6 text-primary sm:mt-14 sm:text-2xl xl:text-3xl'>
                      {t('search:last-searched')}
                    </h1>
                  ) : (
                    <h1 className='my-4 mt-6 text-primary sm:mt-14 sm:text-2xl xl:text-3xl'>
                      {t('search:did-not-search')}
                    </h1>
                  )}
                </div>
              </div>
              <div
                className='m-auto flex w-[95%] flex-wrap justify-center gap-6
                  2xl:w-11/12 2xl:gap-12'
              >
                {shouldDisplayData &&
                  searchData.flatMap((searchResults, index) => (
                    <Fragment key={index}>
                      {searchResults.albums?.map(album => (
                        <div key={album.id}>
                          <SpotifyCard cardData={album} />
                        </div>
                      ))}
                      {searchResults.tracks?.map(track => (
                        <div key={track.id}>
                          <SpotifyCard cardData={track} />
                        </div>
                      ))}
                      {searchResults.artists?.map(artist => (
                        <div key={artist.id}>
                          <SpotifyCard cardData={artist} />
                        </div>
                      ))}
                    </Fragment>
                  ))}
                {shouldDisplayLoadingData && loadingData}
                {!shouldDisplayData &&
                  !shouldDisplayLoadingData &&
                  !searchTerm &&
                  lastSearchedAlbums?.map(album => (
                    <div key={album.id}>
                      <SpotifyCard cardData={album} />
                    </div>
                  ))}
              </div>
            </div>
          </main>
        </div>
        <div ref={ref}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const searchTerm = stringOrNull(context.query.search);
  if (!searchTerm || searchTerm.length < 1) {
    return { props: { searchTerm: null } };
  }

  const trpc = ssrHelper(context);
  await trpc.spotify.getSearch.prefetchInfinite({
    searchTerm,
    limit: searchLimit,
  });

  return {
    props: {
      trpcState: trpc.dehydrate(),
      searchTerm,
    },
  };
};

export default SearchPage;
