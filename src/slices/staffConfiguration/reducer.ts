import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  shiftData : [],
  rnInchargeList: [],
  socialWorkerList: [],
  isOpen: false,
  errorMsg: ''
}

const psConfigSlice = createSlice({
  name: 'psConfig',
  initialState,
  reducers: {
    startLoading (state) {
      state.loading = true
    },

    endLoading (state) {
      state.loading = false
    },

    getPSConfigSuccess (state, action) {
      state.loading = false
      state.shiftData = action.payload
    },

    getRNInchargeListSuccess (state, action) {
      state.loading = false
      state.rnInchargeList = action.payload
    },

    getSocialWorkerListSuceess (state, action) {
      state.loading = false
      state.socialWorkerList = action.payload
    },

    setErrorMessage (state, action) {
      state.loading = false
      state.isOpen = true
      state.errorMsg = action.payload
    },

    closeErrorPopup (state) {
      state.isOpen = false
      state.errorMsg = ''
    }

  }
})

export const {startLoading, endLoading, getPSConfigSuccess, getRNInchargeListSuccess, getSocialWorkerListSuceess, setErrorMessage, closeErrorPopup } = psConfigSlice.actions

export default psConfigSlice.reducer
