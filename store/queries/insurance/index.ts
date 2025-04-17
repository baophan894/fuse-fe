

"use client"

import { endpointAdmin, endpointCollaborator, endpointInsurance} from "@/helpers/enpoints"
import { baseApi } from "../base"
import { da } from "date-fns/locale"



export interface GetAllCollaboratorsParams {
    searchPhase?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: string
  }

export const insuranceAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    GetAllInsurance: build.query<any, GetAllCollaboratorsParams | void>({
      query: (params) => ({
        url: endpointInsurance.GET_ALL,
        method: "GET",
        params: params || {},
        flashError: true,
      }),
    }),
    Approve: build.mutation({
      query: ({id}) => ({
        url: endpointInsurance.APPROVE.replace(":id", id),
        method: "PATCH",
        body: {id},
      }),
    }),
    UploadContract: build.mutation({
      query: ({ data}) => (
       
        {
        url: endpointInsurance.UPLOAD_CONTRACT,
        method: "POST",
        body: data,
      }),
    }),
    SendContract: build.mutation({
      query: ({ data}) => (
  
        {
        url: endpointInsurance.SEND_CONTRACT,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
   
  
   
    
  }),
  
})

export const { useGetAllInsuranceQuery,useUploadContractMutation, useApproveMutation, useSendContractMutation  } = insuranceAPI;

