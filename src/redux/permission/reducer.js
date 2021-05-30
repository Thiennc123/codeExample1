import actions from './actions';

const initialState = {
  permissions: [],
};

export default function permissionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_PERMISSIONS:
      return {
        ...state,
        permissions: action.permissions,
      };
    default:
      return state;
  }
}
