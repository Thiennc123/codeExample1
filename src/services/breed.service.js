import axios from "axios";
import { apiEndpoint, apiEndpointFunction } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const breedService = {
  getList,
  storeOrUpdate
};

function getList(propertyId){
  return (
    axios
      .get(
        `${apiEndpoint.breeds}?property_id=${propertyId}`,
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
        apiEndpointFunction.breeds(id),
        data,
        {
          headers: authHeader(),
        }
      )
  ) : (
    axios
      .post(
        apiEndpoint.breeds,
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