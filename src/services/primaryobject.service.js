import axios from "axios";
import { apiEndpoint, apiEndpointFunction } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const primaryObjectService = {
  storeOrUpdateProperties,
  destroy,
  updateArea,
};

function storeOrUpdateProperties(data, id = null){
  return (id ? (
    axios
      .put(
        apiEndpointFunction.primaryObjects(id),
        data,
        {
          headers: authHeader(),
        }
      )
  ) : (
    axios
      .post(
        apiEndpoint.primaryObjects,
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

function updateArea(data, id = null){
  return (
    axios
      .put(
        `${apiEndpointFunction.primaryObjects(id)}/update-area`,
        data,
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

function destroy(id){
  return (
    axios
      .delete(
        apiEndpointFunction.primaryObjects(id),
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