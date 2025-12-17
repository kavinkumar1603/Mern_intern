import { Link, useNavigate } from "react-router";
import cart from "../assets/cart.png";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion"; // eslint-disable-line no-unused-vars

const Header = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole'));
    const [username, setUsername] = useState(() => sessionStorage.getItem('username') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
    const [cartCount, setCartCount] = useState(0);
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    useEffect(() => {
        // Fetch cart count
        const fetchCartCount = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
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

        if (isLoggedIn) {
            fetchCartCount();
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
        setUsername('');
        navigate('/login');
    };

    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 ${isScrolled ? "py-3 shadow-sm" : "py-5"}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black tracking-tighter uppercase transition-colors text-black">
                    Aurevia
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { to: "/products", label: "Products" },
                        { to: "/orders", label: "Orders" },
                        { to: "/top-products", label: "Top Rated" }
                    ].map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors text-black"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {userRole === 'admin' && (
                        <Link to="/admin" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors text-black">
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Right Side - Cart & Actions */}
                <div className="flex items-center gap-6">

                    <Link to="/cart" className="relative group">
                        <motion.img
                            src={cart}
                            alt="Cart"
                            className="w-5 h-5 transition-all invert-0"
                            whileTap={{ scale: 0.9 }}
                        />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-black">
                                {username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-300 border-black text-black hover:bg-black hover:text-white"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-black text-white hover:bg-gray-800">
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