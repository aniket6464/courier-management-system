import React, { useEffect, useState } from 'react';
import { FaBuilding, FaTruck, FaUser, FaBoxOpen } from 'react-icons/fa';

const Dashboard = () => {
  const [totalBranches, setTotalBranches] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalParcels, setTotalParcels] = useState(0);
  const [parcelStatusCount, setParcelStatusCount] = useState({
    'Item Accepted by Courier': 0,
    'Collected': 0,
    'Shipped': 0,
    'In-Transit': 0,
    'Arrived At Destination': 0,
    'Out for Delivery': 0,
    'Delivered': 0,
    'Unsuccessful Delivery Attempt': 0,
    'Out for Delivery (to the branch)': 0,
    'Ready to Pickup (at the branch)': 0,
    'Picked-up (by the user)': 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total branches
      const branchResponse = await fetch('/api/branch/search?limit=1');
      if (!branchResponse.ok) throw new Error('Failed to fetch branch data');
      const branchData = await branchResponse.json();
      setTotalBranches(branchData.totalBranches);
  
      // Fetch total staff
      const staffResponse = await fetch('/api/staff/search?limit=1');
      if (!staffResponse.ok) throw new Error('Failed to fetch staff data');
      const staffData = await staffResponse.json();
      setTotalStaff(staffData.totalStaff);
  
      // Fetch parcel data and count statuses
      const parcelResponse = await fetch('/api/parcels/search?status=all&limit=infinite');
      if (!parcelResponse.ok) throw new Error('Failed to fetch parcel data');
      const parcelData = await parcelResponse.json();console.log(parcelData);
      
      setTotalParcels(parcelData.totalParcels);
  
      const statusCounts = { ...parcelStatusCount };
      parcelData.parcels.forEach(parcel => {
        if (statusCounts[parcel.status] !== undefined) {
          statusCounts[parcel.status]++;
        }
      });
  
      setParcelStatusCount(statusCounts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
   

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Branches */}
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaBuilding className="text-blue-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Branches</h2>
            <p className="text-2xl">{totalBranches}</p>
          </div>
        </div>
        
        {/* Total Staff */}
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaUser className="text-green-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Staff</h2>
            <p className="text-2xl">{totalStaff}</p>
          </div>
        </div>
  
        {/* Total Parcels */}
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
          <FaBoxOpen className="text-orange-500 text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Parcels</h2>
            <p className="text-2xl">{totalParcels}</p>
          </div>
        </div>
      </div>
  
      <h2 className="text-2xl font-bold mt-8 mb-4">Parcel Statuses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(parcelStatusCount).map((status) => (
          <div key={status} className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <FaTruck className="text-purple-500 text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold">{status}</h3>
              <p className="text-xl">{parcelStatusCount[status]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
};

export default Dashboard;