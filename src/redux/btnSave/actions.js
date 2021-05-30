const actions = {
  SHOW: 'SHOW',
  HIDE: 'HIDE',
  SAVE_SUCCESS: 'SAVE_SUCCESS',
  CANCEL_SAVE: 'CANCEL_SAVE',

  show: data => ({
    type: actions.SHOW,
    data,
  }),
  hide: () => ({
    type: actions.HIDE,
  }),
  saveSuccess: data => ({
    type: actions.SAVE_SUCCESS,
    data,
  }),
  cancelSave: data => ({
    type: actions.CANCEL_SAVE,
    data,
  }),
};

export default actions;
