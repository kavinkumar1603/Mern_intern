import { useState, useEffect } from "react";
import { productImages } from "../assets/images";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 401) {
                    sessionStorage.clear();
                    window.location.href = '/login';
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setCartItems(Array.isArray(data) ? data : (data.items || []));
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        }
        fetchCart();
    }, []);

    const removeFromCart = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems(cartItems.filter(item => (item._id || item.productId || item.id) !== id));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                setCartItems(cartItems.map(item =>
                    (item._id || item.productId || item.id) === id ? { ...item, quantity } : item
                ));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price || item.sellingPrice || item.originalPrice || 0) * item.quantity, 0);
    };

    const handleCheckout = async () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            alert("Please login to checkout");
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const user = sessionStorage.getItem('username') || "guest_user";
            const totalAmount = getCartTotal() + 50;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user,
                    items: cartItems,
                    totalAmount,
                    paymentId: `PAY-${Date.now()}`
                })
            });

            if (response.ok) {
                alert("Order Placed Successfully!");
                setCartItems([]);
            } else {
                alert("Failed to place order.");
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert("Error processing checkout");
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-white py-32 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center"
            >
                <h2 className="text-6xl font-black text-gray-100 uppercase tracking-tighter mb-4">Empty</h2>
                <p className="text-black font-medium text-lg uppercase tracking-widest mb-8">Your bag looks a little light.</p>
                <a href="/products" className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                    Start Shopping
                </a>
            </motion.div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-[1400px] mx-auto">
                <header className="mb-16 border-b border-black pb-6 flex justify-between items-end">
                    <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                        Your <br /> Selection
                    </h1>
                    <span className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-2">
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </header>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    key={item._id || item.productId || item.id}
                                    className="flex flex-col sm:flex-row gap-8 py-8 border-b border-gray-100 last:border-0"
                                >
                                    {/* Image */}
                                    <div className="w-full sm:w-48 aspect-[3/4] bg-gray-50 flex-shrink-0">
                                        <img
                                            src={productImages[item.image] || item.image || "https://placehold.co/100"}
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-black uppercase tracking-tight max-w-[80%]">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xl font-bold text-black">
                                                    ₹{((item.price || item.sellingPrice || item.originalPrice) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
                                                {item.category}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item._id || item.productId || item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id || item.productId || item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.productId || item._id || item.id)}
                                                    className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors border-b border-transparent hover:border-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-1/3 lg:sticky lg:top-32 h-fit">
                        <div className="bg-gray-50 p-8 border border-gray-100">
                            <h3 className="text-lg font-black text-black uppercase tracking-widest mb-8">
                                Order Summary
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-bold">₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Shipping</span>
                                    <span className="font-bold">₹50.00</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black tracking-tight">₹{(getCartTotal() + 50).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all active:scale-[0.98]"
                            >
                                Checkout
                            </button>

                            <p className="text-[10px] text-gray-400 text-center mt-4">
                                TAXES AND SHIPPING CALCULATED AT CHECKOUT
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;