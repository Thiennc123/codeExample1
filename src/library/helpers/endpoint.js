import _ from 'lodash';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

let endpoints = {
  registers: '/api/web/registrations',
  resendEmailConfirmation: '/api/web/registrations/resend-email-confirmation',
  users: '/api/web/users',
  sessions: '/api/web/sessions',
  checkEmailExists: '/api/web/users/check-email-exists',
  checkEmailExistsInProperty: '/api/web/users/check-email-exists-in-property',
  verifyEmail: '/api/web/verifications',
  properties: '/api/web/properties',
  profiles: '/api/web/profiles',
  permissions: '/api/web/permissions',
  getUserPermission: '/api/web/permissions/get-user-permission',
  primaryObjects: '/api/web/primary-objects',
  tasks: '/api/web/tasks',
  mobs: '/api/web/mobs',
  breeds: '/api/web/breeds'
}

let API_ENDPOINTS = {};

_.forEach(endpoints, (value, key) => API_ENDPOINTS[key] = `${API_BASE_URL}${value}`)
export const apiEndpoint = API_ENDPOINTS;

let API_ENDPOINTS_FUNCTION = {
  properties: (id) => {
    return API_BASE_URL + `${endpoints.properties}/${id}`;
  },
  primaryObjects: (id) => {
    return API_BASE_URL + `${endpoints.primaryObjects}/${id}`;
  },
  tasks: (id) => {
    return API_BASE_URL + `${endpoints.tasks}/${id}`;
  },
  mobs: (id) => {
    return API_BASE_URL + `${endpoints.mobs}/${id}`;
  },
  breeds: (id) => {
    return API_BASE_URL + `${endpoints.breeds}/${id}`;
  },
  profiles: (id) => {
    return API_BASE_URL + `${endpoints.profiles}/${id}`;
  }
}
export const apiEndpointFunction = API_ENDPOINTS_FUNCTION;