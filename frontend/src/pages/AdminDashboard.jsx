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
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = () => {
        setIsLoading(true);
        fetch('http://localhost:5000/api/orders/all')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch orders:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        // Find the order and update it optimistically
        const originalOrders = [...orders];
        const updatedOrders = orders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        // Make the API call
        fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to update');
            return res.json();
        })
        .catch(error => {
            console.error("Failed to update status:", error);
            // If the API call fails, revert to the original state
            setOrders(originalOrders);
            alert('Failed to update status. Please try again.');
        });
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                    <div className="text-sm text-gray-500">{order.email}</div>
                                </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{order.phone}</div>
                            </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.websiteType}</div>
                                    <div className="text-sm text-gray-500 max-w-xs truncate" title={order.preferences}>{order.preferences}</div>
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
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            {/* Orders Table */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {/* ... (your entire <table> is here) ... */}
            </div>

            {/* Offer Manager Section */}
            <OfferManager /> {/* 2. Add it here */}
        </div>
        </div>
    );
}

export default AdminDashboard;