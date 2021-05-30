import axios from "axios";
import { apiEndpoint } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const userService = {
  registers,
  resendEmailConfirm,
  checkEmailExists,
  verifyEmail,
  login,
  checkEmailExistsInProperty
};

function registers(data){
  return (
    axios
      .post(
        apiEndpoint.registers,
        data,
        {
          headers: { "Content-Type": "application/json" }
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }
      })
  );
}

function resendEmailConfirm(email){
  return (
    axios
      .get(
        apiEndpoint.resendEmailConfirmation,
        {
          headers: { "Content-Type": "application/json" },
          params: {
            email
          }
        }
      ).then(res => {
        if(res && res.status === 200){
          return res.data;
        }
      })
  );
}

function checkEmailExists(email){
  return (
    axios.get(
      apiEndpoint.checkEmailExists,
      {
        headers: { "Content-Type": "application/json" },
        params:{
          email
        }
      }
    ).then(res => {
      if(res && res.status === 200 && res.data.code === '0000' && res.data.email_already_exists){
        return Promise.reject('Email already exists');
      }
      return Promise.resolve();
    })
  );
}

function checkEmailExistsInProperty(email, propertyId){
  return (
    axios.get(
      apiEndpoint.checkEmailExistsInProperty,
      {
        headers: authHeader(),
        params:{
          email,
          property_id: propertyId
        }
      }
    ).then(res => {
      if(res && res.status === 200 && res.data.code === '0000' && res.data.email_already_exists){
        return Promise.reject('Email already exists');
      }
      return Promise.resolve();
    })
  );
}

function verifyEmail(data){
  return (
    axios
      .get(
        apiEndpoint.verifyEmail,
        {
          headers: { "Content-Type": "application/json" },
          params:{
            token: data.token,
            property_id: data.property_id
          }
        }
      ).then(res => {
        if(res && res.data.code === '0000' && res.data.access_token){
          localStorage.setItem("id_token", res.data.access_token);
        } 
        return res.data;
      })
  );
}

function login(data) {
  return (
    axios
      .post(
        apiEndpoint.sessions,
        { email: data.email, password: data.password },
        {
          headers: { "Content-Type": "application/json" , 'Accept': 'application/json',}
        }
      )
      .then(res => {
        if(res && res.data.code === '0000' && res.data.access_token){
          localStorage.setItem("id_token", res.data.access_token);
        }

        return res.data;
      })
  );
}