import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import VideoListingPage from './_components/video-listing-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Video Management'
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);
  return <VideoListingPage />;
}
