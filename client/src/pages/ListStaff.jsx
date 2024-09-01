import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ListStaff = () => {
    const [staff, setStaff] = useState([]);
    const [staffWithBranches, setStaffWithBranches] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [showBranchPopup, setShowBranchPopup] = useState(false);
    const [staffToChangeBranch, setStaffToChangeBranch] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStaff();
    }, [search, sortField, sortOrder, page, limit]);

    const fetchStaff = async () => {
        try {
            const response = await fetch(
                `/api/staff/search?search=${search}&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`
            );
            const data = await response.json();
            setStaff(data.staff);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError('Failed to load staff.');
        }
    };

    useEffect(() => {
        const fetchBranches = async () => {
            const updatedStaff = await Promise.all(
                staff.map(async (staffMember) => {
                    const branch = await fetchBranchDetails(staffMember.branch_id);
                    return { ...staffMember, branch };
                })
            );
            setStaffWithBranches(updatedStaff);
        };

        if (staff.length > 0) {
            fetchBranches();
        }
    }, [staff]);

    const fetchBranchDetails = async (branchId) => {
        try {
            const response = await fetch(`/api/branch/get/${branchId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            setError('Failed to load branch details.');
        }
    };

    useEffect(() => {
        fetchAvailableBranches();
    }, []);

    const fetchAvailableBranches = async () => {
        try {
            const response = await fetch('/api/branch/get');
            const data = await response.json();
            setBranches(data);
        } catch (error) {
            setError('Failed to load branches.');
        }
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = async (staffId) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const response = await fetch(`/api/staff/delete/${staffId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Staff deleted successfully.');
                fetchStaff();
                setTimeout(() => setSuccess(null), 2000);
            } else {
                setError('Failed to delete the staff.');
                setTimeout(() => setError(null), 2000);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            setTimeout(() => setError(null), 2000);
        }
    };

    const handleChangeBranchClick = (staffMember) => {
        setStaffToChangeBranch(staffMember);
        setShowBranchPopup(true);
    };

    const handleBranchChange = async () => {
        try {
            const response = await fetch(`/api/staff/changeStaffBranch/${staffToChangeBranch._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ branch_id: selectedBranch }),
            });
            console.log(staffToChangeBranch._id);
            console.log(selectedBranch);
            console.log(response);
            

            if (response.ok) {
                setSuccess('Branch updated successfully.');
                fetchStaff();
                setShowBranchPopup(false);
                setSelectedBranch('');
                setTimeout(() => setSuccess(null), 2000);
            } else {
                setError('Failed to update branch.');
                setTimeout(() => setError(null), 2000);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            setTimeout(() => setError(null), 2000);
        }
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
                    onClick={() => navigate('/admin/branch-staff/add-new')}
                >
                    Add Staff
                </button>
            </div>
            {success && <div className="mb-4 text-green-500">{success}</div>}
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">#</th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            // onClick={() => handleSort('firstname')}
                        >
                            Staff Name
                            {/* <span className={sortField === 'firstname' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span> */}
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            // onClick={() => handleSort('email')}
                        >
                            Email
                            {/* <span className={sortField === 'email' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span> */}
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            // onClick={() => handleSort('branch.branch_code')}
                        >
                            Branch
                            {/* <span className={sortField === 'branch.branch_code' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span> */}
                        </th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {staffWithBranches.map((staffMember, index) => (
                        <tr key={staffMember._id}>
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">
                                {staffMember.firstname} {staffMember.lastname}
                            </td>
                            <td className="py-2 px-4 border-b">{staffMember.email}</td>
                            <td className="py-2 px-4 border-b">
                                {staffMember.branch ? (
                                    <>
                                        {staffMember.branch.branch_code} - {staffMember.branch.street}, {staffMember.branch.city}, {staffMember.branch.state}, {staffMember.branch.country}
                                        <br />
                                        Contact: {staffMember.branch.contact}
                                    </>
                                ) : (
                                    'Branch not found'
                                )}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="text-blue-500"
                                    onClick={() => handleChangeBranchClick(staffMember)}
                                >
                                    Change Branch
                                </button>
                                <button
                                    className="text-red-500 ml-2"
                                    onClick={() => handleDelete(staffMember._id)}
                                >
                                    Delete Staff
                                </button>
                            </td>
                        </tr>
                    ))}
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
                            className={`p-2 mx-1 border rounded-md ${page === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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

            {showBranchPopup && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md">
                        <h3 className="text-lg font-bold mb-4">Change Branch for {staffToChangeBranch.firstname} {staffToChangeBranch.lastname}</h3>
                        <select
                            className="p-2 border border-gray-300 rounded w-full"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option value="">Select a branch</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.branch_code} - {branch.street}, {branch.city}, {branch.state}, {branch.country}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={() => {
                                    setShowBranchPopup(false);
                                    setStaffToChangeBranch(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleBranchChange}
                                disabled={!selectedBranch}
                            >
                                Change Branch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListStaff;
