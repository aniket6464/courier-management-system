// StaffPrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const StaffPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.type === false ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
};

export default StaffPrivateRoute;
