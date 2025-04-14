'use client';

import { endpointAuth } from '@/helpers/enpoints';
import { baseApi } from '../base';

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (data: { email: string; password: string }) => ({
        url: endpointAuth.SIGN_IN,
        method: 'POST',
        body: data,
        flashError: true
      })
    }),
    getProfile: build.mutation({
      query: () => ({
        url: endpointAuth.GET_INFO,
        method: 'GET',
        flashError: true
      })
    })
  })
});

export const { useSignInMutation, useGetProfileMutation } = authAPI;
