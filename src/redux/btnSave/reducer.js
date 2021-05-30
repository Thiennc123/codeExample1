import actions from './actions';

const initialState = {
  btnVisibility: false,
  data: {},
  saveSuccess: false,
  cancelSave: false,
};

export default function btnSaveReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SHOW:
      return {
        ...initialState,
        btnVisibility: true,
        data: action.data,
      };
    case actions.HIDE:
      return initialState;
    case actions.SAVE_SUCCESS:
      return {
        ...initialState,
        btnVisibility: false,
        saveSuccess: true,
        data: action.data,
      };
    case actions.CANCEL_SAVE:
      return {
        ...initialState,
        btnVisibility: false,
        cancelSave: true,
        data: action.data,
      };
    default:
      return state;
  }
}
