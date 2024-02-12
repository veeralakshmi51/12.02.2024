import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  bedAssignData: [],
  errorMsg: "",
};

const BedCreateSlice = createSlice({
  name: "bedassignData",
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
      state.errorMsg = action.payload;
    },
    getBedAssignSuccess(state, action) {
      state.loading = false;
      state.bedAssignData = action.payload;
    },
  },
});

export const { isLoading, setErrorMessage, setIsLoadingFalse, getBedAssignSuccess } = BedCreateSlice.actions;
export default BedCreateSlice.reducer;