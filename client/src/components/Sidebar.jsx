import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to get the currentUser

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState('');
  const { currentUser } = useSelector((state) => state.user); // Get currentUser from Redux store

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? '' : menu);
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">{currentUser.type ? 'Admin' : 'Staff'}</h1> {/* Display Admin or Staff */}
      <nav className="flex flex-col space-y-2">
        {/* Display Dashboard with different paths based on user role */}
        <NavLink
          className="hover:bg-gray-700 p-2 rounded"
          to={currentUser.type ? "dashboard" : "staff-dashboard"} // Conditionally set path
        >
          Dashboard
        </NavLink>

        {/* Only display these fields for Admin */}
        {currentUser.type && (
          <>
            <div>
              <button onClick={() => toggleMenu('branch')} className="w-full text-left p-2 hover:bg-gray-700 rounded">
                Branch
              </button>
              {expandedMenu === 'branch' && (
                <div className="ml-4 flex flex-col space-y-1">
                  <NavLink className="hover:bg-gray-700 p-2 rounded" to="/admin/branch/add-new">Add New</NavLink>
                  <NavLink className="hover:bg-gray-700 p-2 rounded" to="/admin/branch/list">List</NavLink>
                </div>
              )}
            </div>

            <div>
              <button onClick={() => toggleMenu('branch-staff')} className="w-full text-left p-2 hover:bg-gray-700 rounded">
                Branch Staff
              </button>
              {expandedMenu === 'branch-staff' && (
                <div className="ml-4 flex flex-col space-y-1">
                  <NavLink className="hover:bg-gray-700 p-2 rounded" to="/admin/branch-staff/add-new">Add New</NavLink>
                  <NavLink className="hover:bg-gray-700 p-2 rounded" to="/admin/branch-staff/list">List</NavLink>
                </div>
              )}
            </div>
          </>
        )}

        {/* Display these fields for both Admin and Staff */}
        <div>
          <button onClick={() => toggleMenu('parcel')} className="w-full text-left p-2 hover:bg-gray-700 rounded">
            Parcel
          </button>
          {expandedMenu === 'parcel' && (
            <div className="ml-4 flex flex-col space-y-1">
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/add-new">Add New</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list">List All</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/item-accepted">Item Accepted by Courier</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/collected">Collected</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/shipped">Shipped</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/in-transit">In-Transit</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/arrived">Arrived At Destination</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/out-for-delivery">Out for Delivery</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/ready-to-pickup">Ready to Pickup (at the branch)</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/delivered">Delivered</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/picked-up">Picked-up (by the user)</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/unsuccessful-attempt">Unsuccessful Delivery Attempt</NavLink>
              <NavLink className="hover:bg-gray-700 p-2 rounded" to="parcel/parcel-list/out-for-branch">Out for Delivery (to the branch)</NavLink>
            </div>
          )}
        </div>

        <NavLink className="hover:bg-gray-700 p-2 rounded" to="track-parcel">Track Parcel</NavLink>
        <NavLink className="hover:bg-gray-700 p-2 rounded" to="report">Report</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
