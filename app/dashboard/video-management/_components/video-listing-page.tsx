'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/constants/data';
import { fakeUsers } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import VideoTable from './video-tables';
import { use } from 'react';
import { useGetAllVideosQuery } from '@/store/queries/videoManagement';

type TVideosListingPage = {};

export default async function VideoListingPage({}: TVideosListingPage) {
  const {
    result = [],
    total = 0,
    isFetching,
    refetch
  } = useGetAllVideosQuery(null, {
    selectFromResult: ({ data, isFetching }) => ({
      result: data?.data || [],
      total: data?.data?.length ?? 0,
      isFetching
    })
  });
  console.log(result);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Videos (${total})`} description="Manage videos" />
        </div>
        <Separator />
        <VideoTable data={result} totalData={total} />
      </div>
    </PageContainer>
  );
}
