import axios from "axios";
import { apiEndpoint, apiEndpointFunction } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const profileService = {
  getProfile,
  updateProfile,
  checkCurrentPassword,
};

function getProfile(){
  return (
    axios
      .get(
        apiEndpoint.profiles,
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

function updateProfile(data, id = null){
  return (
    axios
      .put(
        apiEndpointFunction.profiles(id),
        data,
        {
          headers: authHeader(),
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }
      })
  );
}

function checkCurrentPassword(current_password, id = null){
  return (
    axios
      .post(
        `${apiEndpointFunction.profiles(id)}/check-current-password`,
        current_password,
        {
          headers: authHeader()
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }        
      })
  );
}