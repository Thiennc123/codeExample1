import actions from './actions';

let user = localStorage.getItem('user');

const initialState = {
  user: user ? JSON.parse(user) : {},
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.STORE_CURRENT_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}
