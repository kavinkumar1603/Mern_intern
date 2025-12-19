
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { productImages } from "../assets/images";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            navigate('/');
        }
    }, [order, navigate]);

    if (!order) return null;

    return (
        <div className="min-h-screen bg-white py-32 px-6 flex flex-col items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl w-full bg-gray-50 p-12 border border-gray-100"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
                        Order Placed <br/> Successfully!
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                    <p className="text-sm font-bold text-black mt-2 uppercase tracking-widest">
                        Order ID: {order._id}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-t border-b border-gray-200 py-12">
                     <div>
                        <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                            Shipping Details
                        </h3>
                        {order.shippingAddress ? (
                            <div className="text-gray-600 space-y-1">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No shipping address provided.</p>
                        )}
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                            Order Summary
                        </h3>
                         <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 flex-shrink-0">
                                            {/* Attempt to show image if available */}
                                            {item.image && (
                                                <img 
                                                    src={productImages[item.image] || item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover mix-blend-multiply" 
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black uppercase">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">₹{((item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                            <span className="font-bold text-black uppercase tracking-widest">Total Amount</span>
                            <span className="text-xl font-black">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button 
                        onClick={() => navigate('/products')}
                        className="bg-black text-white px-12 py-4 font-bold uppercase tracking-[0.2em] text-sm hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
