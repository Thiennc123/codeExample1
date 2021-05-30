import axios from "axios";
import { apiEndpoint, apiEndpointFunction } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const mobService = {
  getList,
  storeOrUpdate,
  destroy
};

function getList(propertyId){
  return (
    axios
      .get(
        `${apiEndpoint.mobs}?property_id=${propertyId}`,
        {
          headers: authHeader(),
        }
      ).then(res => {
        if(res && res.status === 200 && res.data.code === '0000'){
          return res.data;
        }
      })
  );
}

function storeOrUpdate(data, id = null){
  return (id ? (
    axios
      .put(
        apiEndpointFunction.mobs(id),
        data,
        {
          headers: authHeader(),
        }
      )
  ) : (
    axios
      .post(
        apiEndpoint.mobs,
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

function destroy(id){
  return (
    axios
      .delete(
        apiEndpointFunction.mobs(id),
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