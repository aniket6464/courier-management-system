import React, { useState } from 'react';

const TrackParcel = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleTrackParcel = async () => {
    try {
      const response = await fetch(`/api/parcels/track/${trackingNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }
      const data = await response.json();
      setTrackingData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setTrackingData([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Track Your Parcel</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Enter Tracking Number"
          value={trackingNumber}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleTrackParcel}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Track Parcel
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6">
          {trackingData.length > 0 ? (
            <ul className="space-y-4">
              {trackingData.map((entry) => (
                <li
                key={entry._id}
                className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="font-semibold text-gray-700">{entry.status}</span>
                <span className="text-gray-500">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                  {' '}
                  {new Date(entry.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </li>
              
              ))}
            </ul>
          ) : (
            !error && <p className="text-gray-500 mt-4">No tracking information available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackParcel;
