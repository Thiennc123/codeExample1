import { propertyService } from '@iso/services';

const actions = {
  STORE_PROPERTIES: 'STORE_PROPERTIES',
  CHANGE_ACTIVITY: 'CHANGE_ACTIVITY',
  
  changeActiveProperty: (activePropertyId) => {
    return dispatch => {
      dispatch(changeActive(activePropertyId));
    }
  },
  loadProperties: (callback) => {
    return dispatch => {
      propertyService.getProperties().then(res => {
        if(res.code === '0000'){
          if(res.properties.length === 1){
            localStorage.setItem('active_property', JSON.stringify(res.properties[0]));
            dispatch(changeActive(res.properties[0].id));
          }
          dispatch(storeProperties(res.properties));
          if(typeof callback === 'function'){
            callback();
          }
        }
      });
    }
  }
};

function storeProperties(properties) {
  return {
    type: actions.STORE_PROPERTIES,
    properties,
  }
}

function changeActive(activePropertyId){
  return {
    type: actions.CHANGE_ACTIVITY,
    activePropertyId
  }
}

export default actions;
