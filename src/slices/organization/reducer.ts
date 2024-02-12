import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    loading: false,
    shiftStartTime: null,
    shiftDuration: null,
    orgData: [],
    isOpen: false,
    errorMsg: "",
  };

  const OrgCreationSlice = createSlice({
    name: "orgData",
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
  
      getShiftStartTimeSuccess (state, action) {
        state.loading = false
        state.shiftStartTime = action.payload
      },

      getShiftDurationSuccess (state, action) {
        state.loading = false 
        state.shiftDuration = action.payload
      },

      getOrgDataByIdSuccess (state, action) {
        state.loading = false 
        state.orgData = action.payload
      }
    },
  });
  
  export const {
    isLoading,
    setIsLoadingFalse,
    setErrorMessage,
    closeErrorPopup,
    getShiftDurationSuccess,
    getShiftStartTimeSuccess,
    getOrgDataByIdSuccess
  } = OrgCreationSlice.actions;
  
  export default OrgCreationSlice.reducer;
  