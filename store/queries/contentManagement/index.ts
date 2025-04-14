'use client';

import { endpointFAQs } from '@/helpers/enpoints';
import { baseApi } from '../base';

export const faqsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFAQ: build.mutation({
      query: (token: string) => ({
        url: endpointFAQs.CREATE,
        method: 'POST',
        body: { token },
        flashError: true
      })
    }),
    updateFAQ: build.mutation({
      query: (token: string) => ({
        url: endpointFAQs.CREATE,
        method: 'PACTH',
        body: { token },
        flashError: true
      })
    }),
    getFAQS: build.mutation({
      query: (token: string) => ({
        url: endpointFAQs.CREATE,
        method: 'GET',
        body: { token },
        flashError: true
      })
    }),
    DeleteFAQS: build.mutation({
      query: (token: string) => ({
        url: endpointFAQs.CREATE,
        method: 'DELETE',
        body: { token },
        flashError: true
      })
    })
  })
});

export const {
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQSMutation,
  useGetFAQSMutation
} = faqsApi;
