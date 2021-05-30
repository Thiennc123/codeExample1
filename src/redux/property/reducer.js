import actions from './actions';

const initialState = {
  properties: [],
  activePropertyId: null,
};

export default function propertyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.STORE_PROPERTIES:
      return {
        ...state,
        properties: action.properties,
      };
    case actions.CHANGE_ACTIVITY:
      return {
        ...state,
        activePropertyId: action.activePropertyId
      };
    default:
      return state;
  }
}
