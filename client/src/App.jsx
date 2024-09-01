// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import AdminPrivateRoute from './routes/AdminPrivateRoute';
import StaffPrivateRoute from './routes/StaffPrivateRoute';
import AdminHome from './routes/AdminHome';
import StaffHome from './routes/StaffHome';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* Routes for Admin */}
        <Route element={<AdminPrivateRoute />}>
          <Route path='/admin/*' element={<AdminHome />} />
        </Route>

        {/* Routes for Staff */}
        <Route element={<StaffPrivateRoute />}>
          <Route path='/staff/*' element={<StaffHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
