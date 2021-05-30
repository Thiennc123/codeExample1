import axios from "axios";
import { apiEndpoint } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const permissionService = {
  getPermissions,
  getUserPermission,
};

function getPermissions(){
  return (
    axios
      .get(
        apiEndpoint.permissions,
        {
          headers: authHeader()
        }
      ).then(res => {
        if(res && res.status === 200 && res.data.code === '0000'){
          return res.data;
        }
      })
  );
}

function getUserPermission(property_id){
  return (
    axios
      .get(
        apiEndpoint.getUserPermission,
        {
          headers: authHeader(),
          params: {
            property_id
          }
        }
      ).then(res => {
        if(res && res.status === 200 && res.data.code === '0000'){
          return res.data;
        }
      })
  );
}