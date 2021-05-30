import axios from "axios";
import { apiEndpoint, apiEndpointFunction } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const propertyService = {
  getProperties,
  viewProperty,
  storeOrUpdateProperties,
  getListUsersOfProperty,
  inviteUser,
  cancelInviteUser
};

function getProperties(){
  return (
    axios
    .get(
      apiEndpoint.properties,
      {
        headers: authHeader()
      }
    )
    .then(res => {
      if(res && res.status === 200){
        return res.data;
      }
      return [];
    })
  );
}

function storeOrUpdateProperties(data, id = null){
  return (id ? (
    axios
      .put(
        apiEndpointFunction.properties(id),
        data,
        {
          headers: authHeader(),
        }
      )
  ) : (
    axios
      .post(
        apiEndpoint.properties,
        data,
        {
          headers: authHeader()
        }
      )
  )).then(res => {
    if(res && res.status === 200){
      return res.data;
    }
    return {};
  });
}

function viewProperty(id){
  return (
    axios
      .get(
        apiEndpointFunction.properties(id),
        {
          headers: authHeader(),
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }
        return {};
      })
  );
}

function getListUsersOfProperty(propertyId){
  return (
    axios
      .get(
        `${apiEndpoint.users}?property_id=${propertyId}`,
        {
          headers: authHeader(),
        }
      ).then(res => {
        if(res && res.status === 200){
          let users = res.data.users.map(user => {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              mobile_phone: user.mobile_phone,
              permission: user.more_info.permission,
              status: user.more_info.status,
            }
          });

          return {
            users: users,
            code: res.data.code,
          };
        }
        return {};
      })
  );
}

function inviteUser(id, data){
  return (
    axios
      .post(
        `${apiEndpointFunction.properties(id)}/invite`,
        data,
        {
          headers: authHeader(),
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }
        return {};
      })
  );
}

function cancelInviteUser(id, userId){
  return (
    axios
      .get(
        `${apiEndpointFunction.properties(id)}/cancel-invite`,
        {
          headers: authHeader(),
          params: {
            user_id: userId
          }
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }
        return {};
      })
  );
}