import { UpdateIcon } from "@radix-ui/react-icons";

const endpointAuth = {
  SIGN_IN: `/auth/sign-in-with-admin`,
  GET_INFO: `/users/admin-info`
};

const endpointUser = {
  GET_ALL: `/user/admin`
};

const endpointAdmin = {
  GET_ALL: `/users/find-all-guest`,
  ASSIGN_INSURANCE: `/application-form/assign-admin`,
  GET_ALL_SUB_ADMIN: `/users/find-all-admin`,
  GET_FORM_FOR_ADMIN: `/application-form/get-form-admin/:id`,
};

const endpointCollaborator = {
  GET_ALL: `/collaborator-request`,
  REJECT_REQUEST: `/collaborator-request/rejected/:id`,
  UPLOAD_CONTRACT: `/contact-collaborators/upload`,
  SEND_EMAIL: `/collaborator-request/send-email-include-contract`,
  APPROVE_REQUEST: `/collaborator-request`,
  UPDATE_ROLE: `user/:id`,
};

const endpointInsurance = {
  GET_ALL: `/application-form`,
  SEND_CONTRACT: `/application-form`,
  UPLOAD_CONTRACT: `/contract/upload`,
  APPROVE: `application-form/update-in-progress/:id`,

};


const endpointVideo = {
  GET_ALL: `/video/admin`
};

const endpointFAQs = {
  CREATE: `/faqs/`,
  READ: `/faqs/`,
  READ_BY_ID: `/faqs/:id`,
  UPDATE: `/faqs/`,
  DELETE: `/faqs/`
};

const endpointOther = {};

export { endpointAuth, endpointFAQs, endpointUser, endpointVideo, endpointAdmin, endpointCollaborator,endpointInsurance };
