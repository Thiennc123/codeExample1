import { profileService } from '@iso/services';

const actions = {
  STORE_CURRENT_USER: 'STORE_CURRENT_USER',
  
  store: () => {
    return dispatch => {
      profileService.getProfile().then(res => {
        if(res.code === '0000'){
          localStorage.setItem('user', JSON.stringify(res.user));
          dispatch(storeCurrentUser(res.user));
        }
      });
    }
  }
};

function storeCurrentUser(user) {
  return {
    type: actions.STORE_CURRENT_USER,
    user,
  }
}

export default actions;
