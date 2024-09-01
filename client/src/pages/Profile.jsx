import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../Redux/user/userSlice'; // Import Redux actions

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [firstname, setFirstname] = useState(currentUser?.firstname || '');
  const [lastname, setLastname] = useState(currentUser?.lastname || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState(null);
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await fetch(`/api/branch/get/${currentUser.branch_id}`);
        if (response.ok) {
          const branchData = await response.json();
          setBranch(branchData);
        } else {
          console.error('Failed to fetch branch details');
        }
      } catch (err) {
        console.error('Error fetching branch details:', err);
      }
    };

    if (currentUser?.branch_id) {
      fetchBranchDetails();
    }
  }, [currentUser?.branch_id]);

  const handleUpdate = async () => {
    dispatch(updateUserStart());

    const endpoint = currentUser.type
      ? `/api/admin/update/${currentUser._id}`
      : `/api/staff/update/${currentUser._id}`;

    const requestBody = {
      firstname,
      lastname,
      email,
      password,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch(updateUserSuccess(updatedUser));
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        dispatch(updateUserFailure(errorData.message || 'Failed to update profile.'));
      }
    } catch (err) {
      dispatch(updateUserFailure('An error occurred while updating the profile.'));
      setTimeout(() => {
        alert('An error occurred while updating the profile.');
      }, 500);
    }
  };

  const handleCancel = () => {
    if (currentUser?.type) {
      navigate('/admin/dashboard');
    } else {
      navigate('/staff/staff-dashboard');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>} {/* Display error */}

      <div className="mb-4">
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      {branch && (
        <div className="mb-4">
          <label className="block text-gray-700">Branch</label>
          <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100">
            {branch.branch_code} - {branch.street}, {branch.city}, {branch.state} {branch.zip_code}, {branch.country}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUpdate}
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Updating...' : 'Update'} {/* Change button text when loading */}
        </button>
      </div>
    </div>
  );
}

export default Profile;
