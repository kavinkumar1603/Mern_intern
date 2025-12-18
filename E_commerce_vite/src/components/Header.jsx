import { Link, useNavigate } from "react-router";
import cart from "../assets/cart.png";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const Header = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole'));
    const [username, setUsername] = useState(() => sessionStorage.getItem('username') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
    const [cartCount, setCartCount] = useState(0);
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const navLinks = [
        { to: "/products", label: "Products" },
        { to: "/orders", label: "Orders" },
        { to: "/top-products", label: "Top Rated" }
    ];

    return (
        <>
            <motion.header
                className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 ${isScrolled ? "py-3 shadow-sm" : "py-5"}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter uppercase transition-colors text-black z-50 relative">
                        Aurevia
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
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
                    <div className="flex items-center gap-4 md:gap-6 z-50 relative">

                        <Link to="/cart" className="relative group" onClick={() => setMobileMenuOpen(false)}>
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

                        {/* Desktop Login/Logout */}
                        <div className="hidden md:flex items-center gap-4">
                            {isLoggedIn ? (
                                <>
                                    <span className="text-xs font-bold uppercase tracking-widest text-black">
                                        {username}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-300 border-black text-black hover:bg-black hover:text-white"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login">
                                    <button className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-black text-white hover:bg-gray-800">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-black z-50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-white z-[45] flex flex-col items-center justify-center space-y-8 md:hidden"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-tighter text-black hover:text-gray-500 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {userRole === 'admin' && (
                            <Link
                                to="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-tighter text-black hover:text-gray-500 transition-colors"
                            >
                                Admin
                            </Link>
                        )}

                        <div className="h-px w-20 bg-gray-200 my-8"></div>

                        {isLoggedIn ? (
                            <div className="flex flex-col items-center gap-6">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                    Signed in as {username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-8 py-3 text-sm font-bold uppercase tracking-widest border-2 border-black text-black hover:bg-black hover:text-white transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <button className="px-10 py-4 text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all shadow-lg">
                                    Login
                                </button>
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;