'use client';

import { endpointUser } from '@/helpers/enpoints';
import { baseApi } from '../base';

export const userAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({
        url: endpointUser.GET_ALL,
        method: 'GET',
        flashError: true
      })
    })
  })
});

export const {  } = userAPI;
