import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ListParcel = ({ status = 'all', branchId = '' }) => {
    const [parcels, setParcels] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [modalType, setModalType] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        fetchParcels();
    }, [search, sortField, sortOrder, page, limit, status]);

    const fetchParcels = async () => {
        const response = await fetch(
            `/api/parcels/search?search=${search}&status=${status}&branch_id=${branchId}&page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
        );
        const data = await response.json();
        
        setParcels(data.parcels);
        setTotalPages(data.totalPages);
    };
    

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = async (parcelId) => {
        if (!window.confirm('Are you sure you want to delete this parcel?')) return;

        try {
            const response = await fetch(`/api/parcels/delete/${parcelId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Parcel deleted successfully.');
                fetchParcels(); // Refresh the parcel list

                setTimeout(() => {
                    setSuccess(null);
                }, 2000);
            } else {
                setError('Failed to delete the parcel.');

                setTimeout(() => {
                    setError(null);
                }, 2000);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');

            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    };

    const handleEdit = (parcel) => {
        const cannotEditDeliverParcel = parcel.type === 1 && ['Out for Delivery', 'Delivered', 'Unsuccessful Delivery Attempt'].includes(parcel.status);
        const cannotEditPickupParcel = parcel.type === 0 && parcel.status === 'Picked-up (by the user)';
    
        if (cannotEditDeliverParcel || cannotEditPickupParcel) {
            setError('This parcel cannot be edited.');
            setTimeout(() => setError(null), 2000);
        } else {
            // Check user type and navigate accordingly
            if (currentUser.type === true) {
                navigate(`/admin/parcel/update-parcel/${parcel._id}`);
            } else {
                navigate(`/staff/parcel/update-parcel/${parcel._id}`);
            }
        }
    };
    
    

    const handleSeeDetails = async (parcelId) => {
        const response = await fetch(`/api/parcels/get/${parcelId}`);
        const parcel = await response.json();
        setSelectedParcel(parcel);
        setModalType('details');
    };

    const handleUpdateStatus = (parcel) => {
        setSelectedParcel(parcel);
        setModalType('update-status');
    };

    const updateParcelStatus = async () => {
        try {
            const response = await fetch(`/api/parcels/update-status/${selectedParcel._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newStatus }),
            });
    
            if (response.ok) {
                setSuccess('Parcel status updated successfully.');
                fetchParcels(); // Refresh the parcel list
                setTimeout(() => {
                    setSuccess(null);
                    setModalType('');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to update parcel status.');
                setTimeout(() => setError(null), 2000);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            setTimeout(() => setError(null), 2000);
        }
    };
    

    const closeModal = () => {
        setSelectedParcel(null);
        setModalType('');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="p-2 border border-gray-300 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                        // Check user type and navigate accordingly
                        if (currentUser.type === true) {
                            navigate('/admin/parcel/add-new');
                        } else {
                            navigate('/staff/parcel/add-new');
                        }
                    }}
                >
                    Add New Parcel
                </button>

            </div>
            {success && <div className="mb-4 text-green-500">{success}</div>}
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">#</th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('tracking_number')}
                        >
                            Tracking Number
                            <span className={sortField === 'tracking_number' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('sender_name')}
                        >
                            Sender Name
                            <span className={sortField === 'sender_name' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('recipient_name')}
                        >
                            Recipient Name
                            <span className={sortField === 'recipient_name' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('status')}
                        >
                            Status
                            <span className={sortField === 'status' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {parcels.length > 0 ? (
                        parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td className="py-2 px-4 border-b">{index + 1}</td>
                                <td className="py-2 px-4 border-b">{parcel.tracking_number}</td>
                                <td className="py-2 px-4 border-b">{parcel.sender_name}</td>
                                <td className="py-2 px-4 border-b">{parcel.recipient_name}</td>
                                <td className="py-2 px-4 border-b">{parcel.status}</td>
                                <td className="py-2 px-4 border-b">
                                    <button className="text-blue-500" onClick={() => handleEdit(parcel)}>Edit</button>
                                    <button className="text-green-500 ml-2" onClick={() => handleSeeDetails(parcel._id)}>See Details</button>
                                    <button className="text-orange-500 ml-2" onClick={() => handleUpdateStatus(parcel)}>Update Status</button>
                                    <button className="text-red-500 ml-2" onClick={() => handleDelete(parcel._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="py-4 px-4 text-center">No data available in table</td>
                        </tr>
                    )}
                </tbody>

            </table>
            <div className="flex justify-between items-center mt-4">
                <div>
                    Show entries:
                    <select
                        className="ml-2 p-2 border border-gray-300 rounded"
                        value={limit}
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <button
                        className="p-2 mx-1 border rounded-md bg-gray-200"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`p-2 mx-1 border rounded-md ${page === index + 1 ? 'bg-gray-400' : 'bg-gray-200'}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="p-2 mx-1 border rounded-md bg-gray-200"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal for See Details */}
            {modalType === 'details' && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Parcel Details</h3>
                        {selectedParcel && (
                            <div>
                                <p className="mb-2"><strong className="font-medium">Tracking Number:</strong> {selectedParcel.tracking_number}</p>
                                <p className="mb-2"><strong className="font-medium">Sender Name:</strong> {selectedParcel.sender_name}</p>
                                <p className="mb-2"><strong className="font-medium">Sender Address:</strong> {selectedParcel.sender_address}</p>
                                <p className="mb-2"><strong className="font-medium">Sender Contact:</strong> {selectedParcel.sender_contact}</p>
                                <p className="mb-2"><strong className="font-medium">Recipient Name:</strong> {selectedParcel.recipient_name}</p>
                                <p className="mb-2"><strong className="font-medium">Recipient Address:</strong> {selectedParcel.recipient_address}</p>
                                <p className="mb-2"><strong className="font-medium">Recipient Contact:</strong> {selectedParcel.recipient_contact}</p>
                                
                                {/* Display Parcel Type */}
                                <p className="mb-2"><strong className="font-medium">Parcel Type:</strong> {selectedParcel.type === 1 ? 'Deliver' : 'Pickup'}</p>
                                
                                <p className="mb-2"><strong className="font-medium">Status:</strong> {selectedParcel.status}</p>
                                
                                <p className="mt-4 mb-2 font-semibold">Parcel Details:</p>
                                {selectedParcel.parcel_details.map((detail, index) => (
                                    <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                                        <p className="font-medium">Parcel {index + 1}:</p>
                                        <ul className="list-disc ml-6 mt-2">
                                            <li>Weight: {detail.weight}</li>
                                            <li>Height: {detail.height}</li>
                                            <li>Length: {detail.length}</li>
                                            <li>Width: {detail.width}</li>
                                            <li>Price: ${detail.price}</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-gray-600 transition-colors"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}



            {/* Modal for Update Status */}
{modalType === 'update-status' && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-md max-w-lg w-full">
            <h3 className="text-xl mb-4">Update Parcel Status</h3>
            {selectedParcel && (
                <div>
                    <p><strong>Current Status:</strong> {selectedParcel.status}</p>
                    <label className="block mb-2">New Status:</label>
                    <select
                        className="p-2 border border-gray-300 rounded w-full"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        {selectedParcel.type === 1 ? (
                            <>
                                <option value="">Select Status</option>
                                <option value="Item Accepted by Courier">Item Accepted by Courier</option>
                                <option value="Collected">Collected</option>
                                <option value="Shipped">Shipped</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Arrived At Destination">Arrived At Destination</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Unsuccessful Delivery Attempt">Unsuccessful Delivery Attempt</option>
                            </>
                        ) : (
                            <>
                                <option value="">Select Status</option>
                                <option value="Item Accepted by Courier">Item Accepted by Courier</option>
                                <option value="Collected">Collected</option>
                                <option value="Shipped">Shipped</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Arrived At Destination">Arrived At Destination</option>
                                <option value="Out for Delivery (to the branch)">Out for Delivery (to the branch)</option>
                                <option value="Ready to Pickup (at the branch)">Ready to Pickup (at the branch)</option>
                                <option value="Picked-up (by the user)">Picked-up (by the user)</option>
                            </>
                        )}
                    </select>
                    <button
    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
    onClick={updateParcelStatus}
>
    Update Status
</button>
                </div>
            )}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={closeModal}
            >
                Close
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default ListParcel;
