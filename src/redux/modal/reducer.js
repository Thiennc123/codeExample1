import modalActions from './actions';

const initialState = {
  modalVisibility: false,
  modalData: {}
};

export default function modalReducer(state = initialState, action) {
  switch (action.type) {
    case modalActions.SHOW_MODAL:
      return {
        modalVisibility: true,
        modalData: action.data,
      };
    case modalActions.HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
}
