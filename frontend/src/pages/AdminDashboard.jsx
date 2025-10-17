import React, { useState, useEffect } from 'react';
import OfferManager from '../components/OfferManager';

// A new component for a styled status badge
const StatusBadge = ({ status }) => {
    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Accepted: 'bg-green-100 text-green-800',
        Completed: 'bg-blue-100 text-blue-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};


function AdminDashboard() {
    // --- MODIFIED: State setup for filtering ---
    const [isLoading, setIsLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]); // Master list of all orders
    const [filteredOrders, setFilteredOrders] = useState([]); // List of orders to display
    const [filters, setFilters] = useState({
        referral: '',
        websiteType: 'All',
        package: 'All'
    });

    const fetchOrders = () => {
        setIsLoading(true);
        console.log('Fetching orders from backend...');
        fetch('https://web-gengrok.onrender.com/api/orders/all')
            .then(res => {
                console.log('Response status:', res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Received orders:', data);
                // --- MODIFIED: Populate both master and filtered lists ---
                setAllOrders(data);
                setFilteredOrders(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch orders:", error);
                alert('Failed to fetch orders: ' + error.message);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // --- ADDED: useEffect to apply filters when they change ---
    useEffect(() => {
        let result = allOrders;

        if (filters.websiteType !== 'All') {
            result = result.filter(order => order.websiteType === filters.websiteType);
        }
        if (filters.package !== 'All') {
            result = result.filter(order => order.package === filters.package);
        }
        if (filters.referral) {
            result = result.filter(order =>
                order.referral && order.referral.toLowerCase().includes(filters.referral.toLowerCase())
            );
        }
        setFilteredOrders(result);
    }, [filters, allOrders]);


    // --- ADDED: Handler for when a filter input changes ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // --- MODIFIED: handleStatusChange now updates the master `allOrders` list ---
    const handleStatusChange = (orderId, newStatus) => {
        const originalOrders = [...allOrders];
        const updatedAllOrders = allOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
        );
        setAllOrders(updatedAllOrders); // This triggers the filter useEffect automatically

        fetch(`https://web-gengrok.onrender.com/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })
        .then(res => { if (!res.ok) throw new Error('Failed to update'); })
        .catch(error => {
            console.error("Failed to update status:", error);
            setAllOrders(originalOrders); // Revert on failure
            alert('Failed to update status. Please try again.');
        });
    };
    
    if (isLoading) {
        return <div className="text-center p-10">Loading Admin Dashboard...</div>;
    }
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <OfferManager />
            
            <h1 className="text-3xl font-bold my-6">Orders</h1>

            {/* --- ADDED: Filter UI Controls --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
                <div>
                    <label htmlFor="websiteType" className="block text-sm font-medium text-gray-700">Project Type</label>
                    <select name="websiteType" value={filters.websiteType} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option>All</option>
                        <option>Portfolio</option>
                        <option>Resume</option>
                        <option>Project</option>
                        <option>Blog</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="package" className="block text-sm font-medium text-gray-700">Package</label>
                    <select name="package" value={filters.package} onChange={handleFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option>All</option>
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="pro">Pro</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="referral" className="block text-sm font-medium text-gray-700">Referral Name</label>
                    <input type="text" name="referral" value={filters.referral} onChange={handleFilterChange} placeholder="Search by referral..." className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* --- MODIFIED: Map over `filteredOrders` instead of `orders` --- */}
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                    <div className="text-sm text-gray-500">{order.email}</div>
                                    <div className="text-sm text-gray-500">{order.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.websiteType}</div>
                                    <div className="text-sm text-gray-500 max-w-xs truncate" title={order.preferences}>{order.preferences || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">
                                    <div className="text-sm text-gray-900">{order.package}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.referral || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {order.status === 'Pending' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleStatusChange(order._id, 'Accepted')} className="text-green-600 hover:text-green-900">Accept</button>
                                            <button onClick={() => handleStatusChange(order._id, 'Rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                        </div>
                                    )}
                                    {order.status === 'Accepted' && (
                                        <button onClick={() => handleStatusChange(order._id, 'Completed')} className="text-blue-600 hover:text-blue-900">Mark as Completed</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;