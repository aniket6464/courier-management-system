import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNewStaff from '../pages/AddNewStaff';
import ListStaff from '../pages/ListStaff';

const BranchStaff = () => {
  return (
    <Routes>
      <Route path="add-new" element={<AddNewStaff />} />
      <Route path="list" element={<ListStaff />} />
    </Routes>
  );
};

export default BranchStaff;
