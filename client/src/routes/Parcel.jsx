import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNewParcel from '../pages/AddNewParcel';
import ListParcel from '../pages/ListParcel';
import UpdateParcel from '../pages/UpdateParcel';

const Parcel = ({ branchId = '' }) => {
  return (
    <Routes>
      <Route path="add-new" element={<AddNewParcel />} />
      <Route path="update-parcel/:id" element={<UpdateParcel />} />
      
      {/* All Status Parcels */}
      <Route path="parcel-list" element={<ListParcel branchId={branchId} />} />

      {/* Specific Status Parcels */}
      <Route path="parcel-list/item-accepted" element={<ListParcel branchId={branchId} status="Item Accepted by Courier" />} />
      <Route path="parcel-list/collected" element={<ListParcel branchId={branchId} status="Collected" />} />
      <Route path="parcel-list/shipped" element={<ListParcel branchId={branchId} status="Shipped" />} />
      <Route path="parcel-list/in-transit" element={<ListParcel branchId={branchId} status="In-Transit" />} />
      <Route path="parcel-list/arrived" element={<ListParcel branchId={branchId} status="Arrived At Destination" />} />
      <Route path="parcel-list/out-for-delivery" element={<ListParcel branchId={branchId} status="Out for Delivery" />} />
      <Route path="parcel-list/delivered" element={<ListParcel branchId={branchId} status="Delivered" />} />
      <Route path="parcel-list/unsuccessful-attempt" element={<ListParcel branchId={branchId} status="Unsuccessful Delivery Attempt" />} />
      <Route path="parcel-list/out-for-branch" element={<ListParcel branchId={branchId} status="Out for Delivery (to the branch)" />} />
      <Route path="parcel-list/ready-to-pickup" element={<ListParcel branchId={branchId} status="Ready to Pickup (at the branch)" />} />
      <Route path="parcel-list/picked-up" element={<ListParcel branchId={branchId} status="Picked-up (by the user)" />} />
    </Routes>
  );
};

export default Parcel;
