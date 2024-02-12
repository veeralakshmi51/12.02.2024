import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  staffData: [],
  isOpen: false,
  errorMsg: "",
};

const StaffCreationSlice = createSlice({
  name: "staffData",
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

    getStaffSuccess(state, action) {
      state.loading = false;
      state.staffData = action.payload;
    },
  },
});

export const {
  isLoading,
  setIsLoadingFalse,
  setErrorMessage,
  closeErrorPopup,
  getStaffSuccess,
} = StaffCreationSlice.actions;

export default StaffCreationSlice.reducer;