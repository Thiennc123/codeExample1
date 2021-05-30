import axios from "axios";
import { apiEndpoint, apiEndpointFunction } from '@iso/lib/helpers/endpoint';
import { authHeader } from '@iso/lib/helpers/authHeader';

export const taskService = {
  getList,
  getBoard,
  storeOrUpdateTasks,
  destroy,
  changeStatus,
};

function getList(propertyId){
  return (
    axios
      .get(
        `${apiEndpoint.tasks}?property_id=${propertyId}`,
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

function getBoard(propertyId){
  return (
    axios
      .get(
        `${apiEndpoint.tasks}/get-board?property_id=${propertyId}`,
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

function storeOrUpdateTasks(data, id = null){
  return (id ? (
    axios
      .put(
        apiEndpointFunction.tasks(id),
        data,
        {
          headers: authHeader(),
        }
      )
  ) : (
    axios
      .post(
        apiEndpoint.tasks,
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

function changeStatus(data, id = null){
  axios.put(
    `${apiEndpointFunction.tasks(id)}/change-status`,
    data,
    {
      headers: authHeader()
    }
  )
}

function destroy(id){
  return (
    axios
      .delete(
        apiEndpointFunction.tasks(id),
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