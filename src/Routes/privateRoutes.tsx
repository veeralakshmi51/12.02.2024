import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
  //   let auth = { token: false }
  let key = localStorage.getItem('authStaff')
  return key ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes