import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UpdateParcel = () => {
    const { id } = useParams(); // Get parcel ID from URL
    const [parcelData, setParcelData] = useState(null);
    const [senderInfo, setSenderInfo] = useState({ name: '', address: '', contact: '' });
    const [recipientInfo, setRecipientInfo] = useState({ name: '', address: '', contact: '' });
    const [parcelType, setParcelType] = useState(1);
    const [branchProcessed, setBranchProcessed] = useState('');
    const [pickupBranch, setPickupBranch] = useState('');
    const [branchOptions, setBranchOptions] = useState([]);
    const [parcelDetails, setParcelDetails] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
      const fetchData = async () => {
          try {
              // Fetch branch options
              const branchResponse = await fetch('/api/branch/get');
              const branchData = await branchResponse.json();
              setBranchOptions(branchData);
  
              // Fetch parcel data
              const parcelResponse = await fetch(`/api/parcels/get/${id}`);
              const parcelData = await parcelResponse.json();
  
              setParcelData(parcelData);
              setSenderInfo({
                  name: parcelData.sender_name,
                  address: parcelData.sender_address,
                  contact: parcelData.sender_contact,
              });
              setRecipientInfo({
                  name: parcelData.recipient_name,
                  address: parcelData.recipient_address,
                  contact: parcelData.recipient_contact,
              });
              setParcelType(parcelData.type);
              setBranchProcessed(parcelData.from_branch_id);
              setPickupBranch(parcelData.to_branch_id || '');
              setParcelDetails(parcelData.parcel_details);
  
          } catch (error) {
              console.error('Error fetching data:', error);
              setError('Failed to fetch data.');
          }
      };
  
      fetchData();
  }, [id]);
  
    
  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;
    if (section === 'sender') {
      setSenderInfo(prevState => ({ ...prevState, [name]: value }));
    } else if (section === 'recipient') {
      setRecipientInfo(prevState => ({ ...prevState, [name]: value }));
    } else if (section === 'parcelDetails') {
      const updatedDetails = [...parcelDetails];
      updatedDetails[index][name] = value;
      setParcelDetails(updatedDetails);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const payload = {
        sender_name: senderInfo.name,
        sender_address: senderInfo.address,
        sender_contact: senderInfo.contact,
        recipient_name: recipientInfo.name,
        recipient_address: recipientInfo.address,
        recipient_contact: recipientInfo.contact,
        type: parcelType,
        from_branch_id: branchProcessed,
        to_branch_id: parcelType === 0 ? pickupBranch : null,
        parcel_details: parcelDetails,
    };

    try {
        const response = await fetch(`/api/parcels/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to update parcel');
        }

        await response.json();
        alert('Parcel updated successfully');

        // Check user type and navigate accordingly
        if (currentUser.type === true) {
            navigate('/admin/parcel/parcel-list'); // Admin route
        } else {
            navigate('/staff/parcel/parcel-list'); // Staff route
        }
    } catch (error) {
        setError(error.message);
        setTimeout(() => setError(null), 2000);
    }
  };

  const handleCancel = () => {
    // Check user type and navigate accordingly
    if (currentUser.type === true) {
        navigate('/admin/parcel/parcel-list'); // Admin route
    } else {
        navigate('/staff/parcel/parcel-list'); // Staff route
    }
};

  if (!parcelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Parcel</h2>
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Sender Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Sender Name"
            value={senderInfo.name}
            required
            onChange={(e) => handleInputChange(e, 'sender')}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Sender Address"
            value={senderInfo.address}
            required
            onChange={(e) => handleInputChange(e, 'sender')}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="contact"
            placeholder="Sender Contact"
            value={senderInfo.contact}
            required
            onChange={(e) => handleInputChange(e, 'sender')}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Recipient Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Recipient Name"
            value={recipientInfo.name}
            required
            onChange={(e) => handleInputChange(e, 'recipient')}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Recipient Address"
            value={recipientInfo.address}
            required
            onChange={(e) => handleInputChange(e, 'recipient')}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            name="contact"
            placeholder="Recipient Contact"
            value={recipientInfo.contact}
            required
            onChange={(e) => handleInputChange(e, 'recipient')}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Parcel Type</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value={1}
                checked={parcelType === 1}
                onChange={() => setParcelType(1)}
                className="mr-2"
              />
              Deliver
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value={0}
                checked={parcelType === 0}
                onChange={() => setParcelType(0)}
                className="mr-2"
              />
              Pickup
            </label>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Branch Processed</h3>
          <select
            value={branchProcessed}
            onChange={(e) => setBranchProcessed(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Branch Processed</option>
            {branchOptions.map(branch => (
              <option key={branch._id} value={branch._id}>
                {branch.branch_code} - {branch.street}, {branch.city}
              </option>
            ))}
          </select>
        </div>

        {parcelType === 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Pickup Branch</h3>
            <select
              value={pickupBranch}
              onChange={(e) => setPickupBranch(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Pickup Branch</option>
              {branchOptions.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.branch_code} - {branch.street}, {branch.city}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Parcel Details</h3>
          {parcelDetails.map((item, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  value={item.weight}
                  required
                  onChange={(e) => handleInputChange(e, 'parcelDetails', index)}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="height"
                  placeholder="Height"
                  value={item.height}
                  required
                  onChange={(e) => handleInputChange(e, 'parcelDetails', index)}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="length"
                  placeholder="Length"
                  value={item.length}
                  required
                  onChange={(e) => handleInputChange(e, 'parcelDetails', index)}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="width"
                  placeholder="Width"
                  value={item.width}
                  required
                  onChange={(e) => handleInputChange(e, 'parcelDetails', index)}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={item.price}
                  required
                  onChange={(e) => handleInputChange(e, 'parcelDetails', index)}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateParcel;

