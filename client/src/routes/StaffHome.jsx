import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StaffDashboard from '../pages/StaffDashboard';
import Parcel from './Parcel';
import TrackParcel from '../pages/TrackParcel';
import Report from '../pages/Report';
import Profile from '../pages/Profile';

const StaffHome = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Check if currentUser is available and has a branch_id
  const branchId = currentUser ? currentUser.branch_id : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-4 bg-gray-100">
          <Routes>
            <Route path="staff-dashboard" element={<StaffDashboard />} />
            <Route path="parcel/*" element={<Parcel branchId={branchId} />} />
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

export default StaffHome;
