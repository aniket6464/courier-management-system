import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../pages/Dashboard';
import Branch from './Branch';
import BranchStaff from './BranchStaff';
import Parcel from './Parcel';
import TrackParcel from '../pages/TrackParcel';
import Report from '../pages/Report';
import Profile from '../pages/Profile';

const AdminHome = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-4 bg-gray-100">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="branch/*" element={<Branch />} />
            <Route path="branch-staff/*" element={<BranchStaff />} />
            <Route path="parcel/*" element={<Parcel />} />
            <Route path="track-parcel" element={<TrackParcel />} />
            <Route path="report" element={<Report />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminHome;
