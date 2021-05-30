const modalActions = {
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',

  openModal: data => ({
    type: modalActions.SHOW_MODAL,
    data,
  }),
  closeModal: () => ({
    type: modalActions.HIDE_MODAL,
  }),
};

export default modalActions;
