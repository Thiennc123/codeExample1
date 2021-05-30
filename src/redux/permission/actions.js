import { permissionService } from '@iso/services';

const actions = {
  LOAD_PERMISSIONS: 'LOAD_PERMISSIONS',
  
  store: () => {
    return dispatch => {
      permissionService.getPermissions().then(res => {
        if(res.code === '0000'){
          dispatch(loadPermissions(res.permissions));
        }
      });
    }
  }
};

function loadPermissions(permissions) {
  return {
    type: actions.LOAD_PERMISSIONS,
    permissions,
  }
}

export default actions;
