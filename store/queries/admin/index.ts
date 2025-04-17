
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

    assignInsurance: build.mutation({
      query: ({ data}) => (
        console.log(data),
        {
        url: endpointAdmin.ASSIGN_INSURANCE,
        method: "POST",
        body: data,
      }),
    }),

    getAllSubAdmin: build.query<any, GetAllUsersParams | void>({
      query: (params) => {
        const authorized = localStorage.getItem("authorized");
        const token = authorized ? JSON.parse(authorized).token.value : null;
    
        return {
          url: endpointAdmin.GET_ALL_SUB_ADMIN,
          method: "GET",
          params: params || {},
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          flashError: true,
        };
      }
    }),
    

    getFormByAdminId: build.query<any, { AdminId: string }>({
      query: ({ AdminId }) => ({
        url: endpointAdmin.GET_FORM_FOR_ADMIN.replace(':id', AdminId),
        method: 'GET',
      }),
    }),
    

  }),
})

export const { useGetAllUsersQuery, useAssignInsuranceMutation, useGetAllSubAdminQuery, useGetFormByAdminIdQuery } = userAPI

