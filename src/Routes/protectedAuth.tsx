import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthRoutesProps {
  children?: React.ReactNode;
  onAccess?: () => void; // Callback to notify parent component about access
}

const ProtectedAuth = ({ children, onAccess }: AuthRoutesProps) => {
  useEffect(() => {
    if (onAccess) {
      onAccess(); // Notify parent component about access
    }
  }, [onAccess]);

  if (!localStorage.getItem('authStaff')) {
    return <Navigate to={{ pathname: '/login' }} />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedAuth;
