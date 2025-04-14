"use client"

import { endpointAdmin} from "@/helpers/enpoints"
import { baseApi } from "../base"

export interface GetAllUsersParams {
  searchPhase?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

export interface GetAllCollaboratorsParams {
    searchPhase?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: string
  }

export const userAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<any, GetAllUsersParams | void>({
      query: (params) => ({
        url: endpointAdmin.GET_ALL,
        method: "GET",
        params: params || {},
        flashError: true,
      }),
    }),
  }),
})

export const { useGetAllUsersQuery } = userAPI

