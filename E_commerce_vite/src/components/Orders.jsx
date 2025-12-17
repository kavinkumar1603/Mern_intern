import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const Orders = () => {
    const username = sessionStorage.getItem('username') || 'Guest';
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'processing':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200';
            case 'shipped':
                return 'bg-blue-50 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-white pt-28 pb-20 px-6">
            <div className="max-w-[1400px] mx-auto">
                <header className="mb-16 border-b border-black pb-6">
                    <span className="block text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
                        Welcome back, {username}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                        Order History
                    </h1>
                </header>

                <div className="grid gap-8">
                    {orders.map((order, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={order._id}
                            className="group border border-gray-100 p-8 hover:border-black transition-colors duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-xl font-bold text-black uppercase tracking-tight">
                                            #{order.paymentId || order._id}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                            {order.status || 'Processing'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</span>
                                    <span className="text-3xl font-black text-black tracking-tight">
                                        ₹{(order.totalAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                            <div>
                                                <p className="font-bold text-black text-sm uppercase tracking-wide">{item.name}</p>
                                                <p className="text-xs text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-black text-sm">
                                            ₹{(item.price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {orders.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-gray-200">
                            <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tight">No Orders Found</h3>
                            <p className="text-gray-400 mt-2">You haven't placed any orders yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Orders;