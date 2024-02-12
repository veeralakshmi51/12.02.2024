import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  beaconData: [],
  isOpen: false,
  errorMsg: "",
};

const BeaconRegisterSlice = createSlice({
  name: "beaconData",
  initialState,
  reducers: {
    isLoading(state) {
      state.loading = true;
    },

    setIsLoadingFalse(state) {
      state.loading = false;
    },
    setErrorMessage(state, action) {
      state.loading = false;
      state.isOpen = true;
      state.errorMsg = action.payload;
    },

    closeErrorPopup(state) {
      state.isOpen = false;
      state.errorMsg = "";
    },

    getBeaconSuccess(state, action) {
      state.loading = false;
      state.beaconData = action.payload;
    },
  },
});

export const {
  isLoading,
  setIsLoadingFalse,
  setErrorMessage,
  closeErrorPopup,
  getBeaconSuccess,
} = BeaconRegisterSlice.actions;

export default BeaconRegisterSlice.reducer;
