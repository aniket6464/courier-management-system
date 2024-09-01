import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ListBranch = () => {
    const [branches, setBranches] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBranches();
    }, [search, sortField, sortOrder, page, limit]);

    const fetchBranches = async () => {
        const response = await fetch(
            `/api/branch/search?search=${search}&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`
        );
        const data = await response.json();
        
        setBranches(data.branches);
        
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

    const handleDelete = async (branchId) => {
      if (!window.confirm('Are you sure you want to delete this branch?')) return;
  
      try {
          const response = await fetch(`/api/branch/delete/${branchId}`, {
              method: 'DELETE',
          });
  
          if (response.ok) {
              setSuccess('Branch deleted successfully.');
              fetchBranches(); // Refresh the branch list
  
              // Set a timeout to clear the success message after 2 seconds
              setTimeout(() => {
                  setSuccess(null);
              }, 2000);
          } else {
              setError('Failed to delete the branch.');
  
              // Set a timeout to clear the error message after 2 seconds
              setTimeout(() => {
                  setError(null);
              }, 2000);
          }
      } catch (error) {
          setError('An error occurred. Please try again.');
  
          // Set a timeout to clear the error message after 2 seconds
          setTimeout(() => {
              setError(null);
          }, 2000);
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
                    onClick={() => navigate('/admin/branch/add-new')}
                >
                    Add Branch
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
                            onClick={() => handleSort('branch_code')}
                        >
                            Branch Code
                            <span className={sortField === 'branch_code' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('street')}
                        >
                            Street/Building
                            <span className={sortField === 'street' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('city')}
                        >
                            City/State/Zip
                            <span className={sortField === 'city' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('country')}
                        >
                            Country
                            <span className={sortField === 'country' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('contact')}
                        >
                            Contact #
                            <span className={sortField === 'contact' ? 'text-black' : 'text-gray-300'}>
                                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                            </span>
                        </th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map((branch, index) => (
                        <tr key={branch._id}>
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{branch.branch_code}</td>
                            <td className="py-2 px-4 border-b">{branch.street}</td>
                            <td className="py-2 px-4 border-b">
                                {branch.city}, {branch.state}, {branch.zip_code}
                            </td>
                            <td className="py-2 px-4 border-b">{branch.country}</td> {/* Added country column */}
                            <td className="py-2 px-4 border-b">{branch.contact}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="text-blue-500"
                                    onClick={() => navigate(`/admin/branch/update-branch/${branch._id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-500 ml-2"
                                    onClick={() => handleDelete(branch._id)}
                                >
                                    Delete
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
                            className={`p-2 mx-1 border rounded-md ${
                                index + 1 === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
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
        </div>
    );
};

export default ListBranch;
