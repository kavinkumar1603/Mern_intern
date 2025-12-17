import { Link, useNavigate } from "react-router";
import cart from "../assets/cart.png";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Header = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        const role = sessionStorage.getItem('userRole');
        const name = sessionStorage.getItem('username');
        setIsLoggedIn(loggedIn === 'true');
        setUserRole(role);
        setUsername(name || '');

        // Fetch cart count
        const fetchCartCount = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:3000/cart', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const items = Array.isArray(data) ? data : (data.items || []);
                    const count = items.reduce((total, item) => total + item.quantity, 0);
                    setCartCount(count);
                }
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        if (loggedIn === 'true') {
            fetchCartCount();
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
        setUsername('');
        navigate('/login');
    };

    return (
        <motion.header
            className="bg-white text-black px-6 py-4 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/90"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold tracking-tight">
                    AUREVIA
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex ml-20 items-center gap-8 text-sm font-medium">
                    <Link to="/products" className="hover:text-gray-500 transition">
                        Products
                    </Link>
                    <Link to="/orders" className="hover:text-gray-500 transition">
                        Orders
                    </Link>
                    <Link to="/top-products" className="hover:text-gray-500 transition">
                        Top products
                    </Link>
                    {userRole === 'admin' && (
                        <Link to="/admin" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                            Add Product
                        </Link>
                    )}
                </nav>

                {/* Right Side - Cart & Actions */}
                <div className="flex items-center gap-6">

                    <Link to="/cart" className="relative hover:opacity-70 transition">
                        <img src={cart} alt="Cart" className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-black">{username}</span>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 bg-white text-black border border-black text-sm font-medium rounded-lg hover:bg-black hover:text-white transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

export default Header;