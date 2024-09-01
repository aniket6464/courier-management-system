import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNewBranch from '../pages/AddNewBranch';
import ListBranch from '../pages/ListBranch';
import UpdateBranch from '../pages/UpdateBranch';

const Branch = () => {
  return (
    <Routes>
      <Route path="add-new" element={<AddNewBranch />} />
      <Route path="list" element={<ListBranch />} />
      <Route path="update-branch/:id" element={<UpdateBranch />} />
    </Routes>
  );
};

export default Branch;
