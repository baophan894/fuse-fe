

"use client"

import { endpointAdmin, endpointCollaborator} from "@/helpers/enpoints"
import { baseApi } from "../base"
import { da } from "date-fns/locale"



export interface GetAllCollaboratorsParams {
    searchPhase?: string
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: string
  }

export const collaboratorAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    GetAllCollaborators: build.query<any, GetAllCollaboratorsParams | void>({
      query: (params) => ({
        url: endpointCollaborator.GET_ALL,
        method: "GET",
        params: params || {},
        flashError: true,
      }),
    }),
    RejectRequest: build.mutation({
      query: ({ requestId, data }) => ({
        url: endpointCollaborator.REJECT_REQUEST.replace(":id",requestId),
        method: "PATCH",
        body: data,
      }),
    }),
    UploadContract: build.mutation({
      query: ({ data }) => (
        console.log(data),
        console.log("Upload contract data:", data),
        {
        
        url: endpointCollaborator.UPLOAD_CONTRACT,
        method: "POST",
        body: data,
      }),
    }),
    SendEmail: build.mutation({
      query: ({ contractRequestId}) => ({
        url: endpointCollaborator.SEND_EMAIL,
        method: "POST",
        body: {contractRequestId},
      }),
    }),
    ApproveRequest: build.mutation({
      query: ({ contractRequestId}) => ({
        url: endpointCollaborator.APPROVE_REQUEST,
        method: "PATCH",
        body: {contractRequestId},
      }),
    }),
    UpdateRole: build.mutation({
      query: ({ userId}) => ({
        url: endpointCollaborator.UPDATE_ROLE.replace(":id",userId),
        method: "PATCH",
     
      }),
    }),
  }),
  
})

export const { useGetAllCollaboratorsQuery, useRejectRequestMutation, useUploadContractMutation, useSendEmailMutation,
  useApproveRequestMutation, useUpdateRoleMutation } = collaboratorAPI;

