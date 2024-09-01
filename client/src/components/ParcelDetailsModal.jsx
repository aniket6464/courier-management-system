// ParcelDetailsModal.jsx
import React, { useEffect, useState } from 'react';

const ParcelDetailsModal = ({ parcelId, onClose }) => {
    const [parcelDetails, setParcelDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParcelDetails = async () => {
            try {
                const response = await fetch(`/api/parcels/get/${parcelId}`);
                const parcel = await response.json();
                setParcelDetails(parcel);
            } catch (err) {
                setError('Failed to fetch parcel details.');
            }
        };

        if (parcelId) {
            fetchParcelDetails();
        }
    }, [parcelId]);

    if (!parcelDetails) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Parcel Details</h3>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        <p className="mb-2"><strong className="font-medium">Tracking Number:</strong> {parcelDetails.tracking_number}</p>
                        <p className="mb-2"><strong className="font-medium">Sender Name:</strong> {parcelDetails.sender_name}</p>
                        <p className="mb-2"><strong className="font-medium">Sender Address:</strong> {parcelDetails.sender_address}</p>
                        <p className="mb-2"><strong className="font-medium">Sender Contact:</strong> {parcelDetails.sender_contact}</p>
                        <p className="mb-2"><strong className="font-medium">Recipient Name:</strong> {parcelDetails.recipient_name}</p>
                        <p className="mb-2"><strong className="font-medium">Recipient Address:</strong> {parcelDetails.recipient_address}</p>
                        <p className="mb-2"><strong className="font-medium">Recipient Contact:</strong> {parcelDetails.recipient_contact}</p>
                        <p className="mb-2"><strong className="font-medium">Parcel Type:</strong> {parcelDetails.type === 1 ? 'Deliver' : 'Pickup'}</p>
                        <p className="mb-2"><strong className="font-medium">Status:</strong> {parcelDetails.status}</p>
                        <p className="mt-4 mb-2 font-semibold">Parcel Details:</p>
                        {parcelDetails.parcel_details.map((detail, index) => (
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
                    </>
                )}
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-gray-600 transition-colors"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ParcelDetailsModal;
