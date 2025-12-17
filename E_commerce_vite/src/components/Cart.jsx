import { useState, useEffect } from "react";
import { productImages } from "../assets/images";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = sessionStorage.getItem('token');

                // If no token, maybe redirect or just return (empty cart)
                if (!token) return;

                const response = await fetch('http://localhost:3000/cart', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.status === 401) {
                    // Token expired or invalid
                    sessionStorage.clear();
                    window.location.href = '/login';
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    // Handle both array (legacy) and object with items property (new schema)
                    setCartItems(Array.isArray(data) ? data : (data.items || []));
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        }
        fetchCart();
    }, []);

    const addToCart = async (product) => {
        // ... (previous content implementation is redundant with Products.jsx handling mostly, but keeping simplified or fixing ID usage)
        // Since addToCart in Cart is mostly legacy/optimistic or unused for the main flow, we focus on ensuring ID usage:
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('http://localhost:3000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product._id || product.id,
                    name: product.name,
                    category: product.category,
                    image: product.image,
                    price: product.sellingPrice || product.originalPrice,
                    quantity: 1
                })
            });

            if (response.ok) {
                // Re-fetch to sync
                const fetchCart = async () => {
                    const response = await fetch('http://localhost:3000/cart', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCartItems(Array.isArray(data) ? data : (data.items || []));
                    }
                };
                fetchCart();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            await fetch(`http://localhost:3000/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Try to match _id or productId or id
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
            const response = await fetch(`http://localhost:3000/cart/${id}`, {
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

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const calculateSavings = () => {
        return cartItems.reduce(
            (total, item) => {
                const price = item.price || item.sellingPrice || item.originalPrice || 0;
                const original = item.originalPrice || price;
                return total + (original - price) * item.quantity;
            },
            0
        ).toFixed(2);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const handleCheckout = async () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            alert("Please login to checkout"); // Or use toast if imported
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const user = sessionStorage.getItem('username') || "guest_user"; // Fallback if username missing
            const totalAmount = getCartTotal() + 50; // Including Shipping

            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user,
                    items: cartItems,
                    totalAmount,
                    paymentId: `PAY-${Date.now()}` // Mock payment ID
                })
            });

            if (response.ok) {
                // If using toast, add import
                alert("Order Placed Successfully!");
                clearCart();
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
            <div className="w-full bg-white py-16 px-6 min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-black uppercase tracking-tighter mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Add some products to your cart to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-100 py-12 px-4 md:px-8 min-h-screen flex items-start justify-center">
            <div className="max-w-6xl w-full bg-white shadow-2xl flex flex-col lg:flex-row shadow-gray-300/50">

                {/* LEFT SECTION: CART ITEMS */}
                <div className="w-full lg:w-2/3 p-8 md:p-12">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-3xl font-extrabold text-black uppercase tracking-tighter">Your Shopping Cart</h2>
                        <span className="text-lg font-bold text-gray-400">{getCartCount()} Items</span>
                    </div>

                    {/* Table Headers */}
                    <div className="hidden md:grid grid-cols-12 gap-4 mb-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="col-span-6">Item Info</div>
                        <div className="col-span-3 text-center">Quantity</div>
                        <div className="col-span-3 text-right">Price</div>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-8">
                        {cartItems.map((item) => (
                            <div key={item._id || item.productId || item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-8 last:border-0 last:pb-0">

                                {/* Product Info */}
                                <div className="col-span-1 md:col-span-6 flex items-start gap-6">
                                    <div className="w-24 h-24 bg-gray-100 p-2 border border-gray-200 flex-shrink-0">
                                        <img
                                            src={productImages[item.image] || item.image || "https://placehold.co/100"}
                                            alt={item.name}
                                            className="w-full h-full object-contain grayscale mix-blend-multiply"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-black uppercase tracking-tight mb-1">{item.name}</h3>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{item.category}</p>
                                        <button
                                            onClick={() => removeFromCart(item.productId || item._id || item.id)}
                                            className="text-xs text-gray-400 hover:text-black font-medium transition-colors uppercase tracking-wider"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Quantity Control */}
                                <div className="col-span-1 md:col-span-3 flex justify-center items-center">
                                    <div className="flex items-center border border-gray-300">
                                        <button
                                            onClick={() => updateQuantity(item._id || item.productId || item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 h-8 flex items-center justify-center text-sm font-bold text-black border-l border-r border-gray-300">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item._id || item.productId || item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-1 md:col-span-3 text-right">
                                    <p className="text-lg font-bold text-black">₹{((item.price || item.sellingPrice || item.originalPrice) * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SECTION: ORDER SUMMARY */}
                <div className="w-full lg:w-1/3 bg-gray-50 p-8 md:p-12 border-l border-gray-200">
                    <h3 className="text-xl font-bold text-black uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">
                        Order Summary
                    </h3>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium uppercase tracking-wider">Items {getCartCount()}</span>
                            <span className="font-bold text-black">₹{getCartTotal().toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium uppercase tracking-wider">Shipping</span>
                            <div className="text-right">
                                <select className="bg-transparent text-black font-bold text-sm outline-none cursor-pointer">
                                    <option>Standard Delivery - ₹50.00</option>
                                    <option>Express Delivery - ₹150.00</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter your code"
                                    className="w-full bg-white border border-gray-300 px-4 py-2 text-sm outline-none focus:border-black transition-colors"
                                />
                                <button className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-300 pt-6 mt-6">
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-sm font-bold text-black uppercase tracking-widest">Total Cost</span>
                                <span className="text-2xl font-extrabold text-black">₹{(getCartTotal() + 50).toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors shadow-lg">
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;