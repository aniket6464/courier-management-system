import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (!currentUser.type) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
