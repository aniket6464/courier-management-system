import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const viewReport = async () => {
    const query = new URLSearchParams({
      status: status !== 'all' ? status : '',
      startDate,
      endDate,
    }).toString();

    const response = await fetch(`/api/parcels/report?${query}`);
    const data = await response.json();
    setReportData(data);
  };

  const calculateAmount = (parcelDetails) => {
    return parcelDetails.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.text("Parcel Report", 14, 16);
  
    const tableColumn = ["Serial No", "Date", "Sender Name", "Recipient Name", "Amount", "Status"];
    const tableRows = [];
  
    reportData.forEach((parcel, index) => {
      const rowData = [
        index + 1,
        new Date(parcel.date_created).toLocaleDateString(),
        parcel.sender_name,
        parcel.recipient_name,
        `$${calculateAmount(parcel.parcel_details)}`,
        parcel.status
      ];
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
  
    doc.save('parcel_report.pdf');
  };  

  return (
    <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Parcel Report</h2>

    <div className="flex space-x-4 mb-4">
        <div className="flex-1">
            <label className="block mb-2">Status</label>
            <select value={status} onChange={handleStatusChange} className="w-full p-2 border rounded">
                <option value="all">All</option>
                <option value="Item Accepted by Courier">Item Accepted by Courier</option>
                <option value="Collected">Collected</option>
                <option value="Shipped">Shipped</option>
                <option value="In-Transit">In-Transit</option>
                <option value="Arrived At Destination">Arrived At Destination</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Unsuccessful Delivery Attempt">Unsuccessful Delivery Attempt</option>
                <option value="Out for Delivery (to the branch)">Out for Delivery (to the branch)</option>
                <option value="Ready to Pickup (at the branch)">Ready to Pickup (at the branch)</option>
                <option value="Picked-up (by the user)">Picked-up (by the user)</option>
            </select>
        </div>

        <div className="flex-1">
            <label className="block mb-2">From Date</label>
            <input type="date" value={startDate} onChange={handleStartDateChange} className="w-full p-2 border rounded" />
        </div>

        <div className="flex-1">
            <label className="block mb-2">To Date</label>
            <input type="date" value={endDate} onChange={handleEndDateChange} className="w-full p-2 border rounded" />
        </div>

        <div className="flex items-end">
            <button onClick={viewReport} className="bg-blue-500 text-white px-4 py-2 rounded">View Report</button>
        </div>
    </div>

    {reportData.length > 0 && (
        <table className="w-full mt-4 border">
        <thead>
            <tr>
            <th className="border px-4 py-2">Serial No</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Sender Name</th>
            <th className="border px-4 py-2">Recipient Name</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            </tr>
        </thead>
        <tbody>
            {reportData.map((parcel, index) => (
            <tr key={parcel._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{new Date(parcel.date_created).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{parcel.sender_name}</td>
                <td className="border px-4 py-2">{parcel.recipient_name}</td>
                <td className="border px-4 py-2">${calculateAmount(parcel.parcel_details)}</td>
                <td className="border px-4 py-2">{parcel.status}</td>
            </tr>
            ))}
        </tbody>
        </table>
    )}

    {/* Print Button */}
    <div className="flex justify-center mt-4">
        <button onClick={generatePDF} className="bg-green-500 text-white px-4 py-2 rounded">Print Report</button>
    </div>
    </div>

  );
};

export default Report;
