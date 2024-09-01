import React, { useEffect, useState } from 'react';
import { FaBoxOpen, FaTruck } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const StaffDashboard = () => {
//   const [totalParcels, setTotalParcels] = useState(0);
//   const [parcelStatusCount, setParcelStatusCount] = useState({
//     'Item Accepted by Courier': 0,
//     'Collected': 0,
//     'Shipped': 0,
//     'In-Transit': 0,
//     'Arrived At Destination': 0,
//     'Out for Delivery': 0,
//     'Delivered': 0,
//     'Unsuccessful Delivery Attempt': 0,
//     'Out for Delivery (to the branch)': 0,
//     'Ready to Pickup (at the branch)': 0,
//     'Picked-up (by the user)': 0,
//   });

  const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     fetchStaffDashboardData();
//   }, []);

//   const fetchStaffDashboardData = async () => {
//     try {
//       // Fetch parcel data and count statuses
//       const parcelResponse = await fetch('/api/parcels/search?status=all&limit=1');
//       if (!parcelResponse.ok) throw new Error('Failed to fetch parcel data');
//       const parcelData = await parcelResponse.json();
//       setTotalParcels(parcelData.totalParcels);

//       const statusCounts = { ...parcelStatusCount };
//       parcelData.parcels.forEach((parcel) => {
//         if (statusCounts[parcel.status] !== undefined) {
//           statusCounts[parcel.status]++;
//         }
//       });

//       setParcelStatusCount(statusCounts);
//     } catch (error) {
//       console.error('Error fetching staff dashboard data:', error);
//     }
//   };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser.firstname}</h1>
    </div>
  );
};

export default StaffDashboard;
