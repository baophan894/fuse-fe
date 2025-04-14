'use client';

import { endpointVideo } from '@/helpers/enpoints';
import { baseApi } from '../base';

export const videosAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllVideos: build.query({
      query: () => ({
        url: endpointVideo.GET_ALL,
        method: 'GET',
        flashError: true
      })
    })
  })
});

export const { useGetAllVideosQuery } = videosAPI;
