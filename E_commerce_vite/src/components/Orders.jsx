import { useEffect, useState } from "react";

const Orders = () => {
    const username = sessionStorage.getItem('username') || 'Guest';

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await fetch('http://localhost:3000/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders:', response.statusText);
                    if (response.status === 401) {
                        // Optional: Handle unauthorized access, like redirecting to login
                        console.error('Unauthorized access - valid token required');
                    }
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-black text-white';
            case 'Processing':
                return 'bg-white border border-black text-black';
            case 'Shipped':
                return 'bg-gray-200 text-black';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Title */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold text-black">My Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {username}</p>
                </div>
            </div>

            {/* Orders List */}
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-gray-100">
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                                <div>
                                    <h2 className="text-lg font-bold text-black mb-1">
                                        {order.paymentId || order._id}
                                    </h2>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'Processing')}`}>
                                    {order.status || 'Processing'}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-black mb-3 text-sm">Items:</h3>
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <p className="font-medium text-black text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-black text-sm">
                                                ₹{(item.price || 0).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                                <span className="font-semibold text-black">Total:</span>
                                <span className="text-2xl font-bold text-black">
                                    ₹{(order.totalAmount || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {orders.length === 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <h2 className="text-2xl font-bold text-black mb-2">No Orders Yet</h2>
                        <p className="text-gray-600">Start shopping to see your orders here!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders