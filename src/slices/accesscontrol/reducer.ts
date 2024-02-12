import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  accessControl : [],
  organization : [],
  isOpen: false,
  errorMsg: ''
}

const accessControlSlice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    isLoading (state) {
      state.loading = true
    },

    setIsLoadingFalse (state) {
      state.loading = false
    },

    getAccessControlSuccess (state, action) {
        state.loading = false
        state.accessControl = action.payload
    },

    getOrgSuccess (state, action) {
      state.loading = false
      state.organization = action.payload
    },

    setErrorMessage (state, action) {
        state.loading = false
        state.isOpen = true
        state.errorMsg = action.payload
      },

  }
})

export const {isLoading, setIsLoadingFalse, getAccessControlSuccess, getOrgSuccess, setErrorMessage } = accessControlSlice.actions

export default accessControlSlice.reducer
