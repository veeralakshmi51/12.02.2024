import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { publicRoutes, AdminRoutes, SuperAdminRoutes, SystemAdminRoutes } from './Routes/allRoutes';
import { ToastContainer } from 'react-toastify';
import ProtectedAuth from './Routes/protectedAuth';
import Sidebar from './components/sidebar/sidebar';
import { useSelector } from 'react-redux';

const App = () => {
  const jwt = useSelector((state: any) => state.Login.jwt);
  const userType = useSelector((state: any) => state.Login.userType);
  const getAuthenticatedRoutes = () => {
    if (userType === 'Super Admin') {
      return SuperAdminRoutes;
    } else if (userType === 'Admin') {
      return AdminRoutes;
    } else if (userType === 'System Admin') {
      return SystemAdminRoutes;
    } else {
      return [];
    }
  };

  const location = useLocation();
  const authProtectedRoutes = getAuthenticatedRoutes();
  const shouldRenderSidebar = jwt && location.pathname !== '/secret-key';

  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} key={idx} element={route.component} />
        ))}
      </Routes>

      {shouldRenderSidebar && (
        <Sidebar>
          <div className='container' style={{ padding: '80px 10px 0px', maxHeight: '700px' }}>

          </div>
          <Routes>
            {authProtectedRoutes.map((route, idx) => (
              <Route
                path={route.path}
                key={idx}
                element={
                  <React.Fragment>
                    <ProtectedAuth>{route.component}</ProtectedAuth>
                  </React.Fragment>
                }
              />
            ))}
          </Routes>
        </Sidebar>
      )}

      <ToastContainer theme='dark' />
    </React.Fragment>
  );
};

export default App;
