import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  jwt:"",
  userType:"",
  userDetails: {},
  userData:{},
  organization:''
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    startLoading (state) {
      state.loading = true
    },

    endLoading (state) {
      state.loading = false
    },

    saveLoginData(state, action) {
      state.loading = false
      state.jwt = action.payload;
    },
    saveUserType(state, action) {
      state.loading = false
      state.userType = action.payload;
    },
    saveUserDetails(state, action) {
      state.loading = false
      state.userDetails = action.payload;
    },
    saveOrganization(state, action) {
      state.loading = false
      state.organization = action.payload
    }
  }
})

export const {endLoading, startLoading, saveLoginData, saveUserType, saveUserDetails, saveOrganization } = loginSlice.actions

export default loginSlice.reducer
