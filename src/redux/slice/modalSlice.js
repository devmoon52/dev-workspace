import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clipboardAlert: null,
  failedPopUp: null,
  successAlert: null,
  accModal: false,
  shortCutSuggetion: {
    id: null,
    alert: false,
    isSettingpageFirstTime: false,
    isSearchPageFirstTime: false,
  },
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    // account modal
    setAccModal: (state, action) => {
      state.accModal = true;
    },
    removeAccModal: (state, action) => {
      state.accModal = false;
    },

    // copy toast bar
    setCopyToast: (state, actions) => {
      state.clipboardAlert = actions.payload;
    },
    removeCopyToast: (state, actions) => {
      state.clipboardAlert = null;
    },

    // failed popups
    setFailedAlert: (state, actions) => {
      state.failedPopUp = actions.payload;
    },
    removeFailedAlert: (state, actions) => {
      state.failedPopUp = null;
    },

    // success popup
    setSuccessAlert: (state, actions) => {
      state.successAlert = actions.payload;
    },
    removeSuccessAlert: (state, actions) => {
      state.successAlert = null;
    },

    // short cut suggetion alert
    setShortCut: (state, action) => {
      state.shortCutSuggetion = action.payload;
    },
    removeShortCut: (state, action) => {
      state.shortCutSuggetion = {
        ...state.shortCutSuggetion,
        alert: false,
      };
    },
  },
});

export const {
  setCopyToast,
  removeCopyToast,
  setFailedAlert,
  removeFailedAlert,
  setSuccessAlert,
  removeSuccessAlert,
  setShortCut,
  removeShortCut,
  setAccModal,
  removeAccModal,
} = modalSlice.actions;
export default modalSlice.reducer;
