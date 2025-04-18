import { use } from 'react';
import { endpointAdmin, endpointCollaborator, endpointInsurance, endpointNotification} from "@/helpers/enpoints"
import { baseApi } from "../base"
import { da } from "date-fns/locale"



export const notificationAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    SaveToken: build.mutation({
        query: (body) => ({
          url: endpointNotification.SAVE_TOKEN,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: body
        }),
      }),
    SendNotification: build.mutation({
        query: (body) => ({
          url: endpointNotification.SEND_NOTIFICATION,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: body
        }),
      }),
      
   
  
   
    
  }),
  
})

export const { useSendNotificationMutation, useSaveTokenMutation} = notificationAPI;

