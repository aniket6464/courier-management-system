import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../Redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaExpand, FaCompress, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
  
      // Check if the response status is OK (status code in the range 200-299)
      if (response.ok) {
        console.log("Sign out successful");
        dispatch(signOutUserSuccess());
        setTimeout(() => {
          navigate('/sign-in');
        }, 0);
      } else {
        console.log("Sign out request failed");
        dispatch(signOutUserFailure('Sign out failed!'));
      }
    } catch (error) {
      console.log("Error during sign out:", error);
      dispatch(signOutUserFailure(error.message));
    }
  };  

  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-500 shadow-md p-4 flex justify-between items-center text-white">
      <h1 className="text-2xl font-extrabold tracking-wide">Courier Management System</h1>
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleFullScreen}
          className="focus:outline-none p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition duration-300 ease-in-out"
          aria-label={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        >
          {isFullScreen ? (
            <FaCompress className="text-white text-lg" />
          ) : (
            <FaExpand className="text-white text-lg" />
          )}
        </button>
        <div className="relative">
          <span className="font-semibold text-lg">
            {currentUser.type ? currentUser.firstname : `${currentUser.firstname} ${currentUser.lastname}`}
          </span>
          <button
            onMouseEnter={() => setProfileMenuOpen(true)} // Show menu on hover
            className="ml-4 rounded-full text-white focus:outline-none hover:text-gray-300 hover:bg-white hover:bg-opacity-20 transition duration-300 ease-in-out profile-button" // Added class 'profile-button'
            aria-label="Profile"
          >
            <FaUserCircle className="text-2xl" />
          </button>


          {profileMenuOpen && (
            <div
              onMouseLeave={() => setProfileMenuOpen(false)} // Hide menu when not hovering over the button or menu
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden profile-menu" // Added class 'profile-menu'
            >
              <a
                href="#profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => navigate(currentUser.type ? '/admin/profile' : '/staff/profile')}
              >
                <FaUserCircle className="inline-block mr-2" /> My Profile
              </a>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaSignOutAlt className="inline-block mr-2" />
                Sign Out
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;
