import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from 'react-toastify';
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import hero1 from "../assets/hero1.jpg"; // Re-using the hero image for consistency

const Login = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const passref = useRef('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const password = passref.current.value;

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    toast.success("Login Successful");
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('token', data.token);
                    const role = data.role || 'user';
                    sessionStorage.setItem('userRole', role);
                    sessionStorage.setItem('username', email);

                    if (role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/products');
                    }
                } else {
                    setError("Login successful but received invalid data.");
                }
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError("Server connection failed");
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <motion.div
                className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-black"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                    style={{ backgroundImage: `url(${hero1})` }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
                    <Link to="/" className="text-white text-2xl font-black tracking-tighter uppercase">LUXORA</Link>
                    <div>
                        <h1 className="text-6xl font-black text-white leading-none tracking-tighter mb-4">
                            ELEVATE <br /> YOUR STYLE.
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium">
                            Join our community of trendsetters. Experience fashion that speaks before you do.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="w-full max-w-md space-y-12">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-50 text-red-600 px-4 py-3 text-sm font-bold border-l-4 border-red-600"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="group relative z-0 w-full mb-6 group">
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    className="block py-4 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-black peer transition-colors"
                                    placeholder=" "
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                />
                                <label
                                    htmlFor="email"
                                    className="peer-focus:font-bold absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-widest"
                                >
                                    Email Address
                                </label>
                            </div>

                            <div className="group relative z-0 w-full mb-6 group">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="block py-4 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-black peer transition-colors"
                                    placeholder=" "
                                    required
                                    ref={passref}
                                    onChange={() => setError("")}
                                />
                                <label
                                    htmlFor="password"
                                    className="peer-focus:font-bold absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-widest"
                                >
                                    Password
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-xs">
                                <a href="#" className="font-bold text-black hover:text-gray-600 uppercase tracking-widest">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black uppercase tracking-widest"
                        >
                            Log In
                        </motion.button>

                        <p className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500 font-medium">
                            DON'T HAVE AN ACCOUNT?{' '}
                            <Link to="/signup" className="font-bold text-black hover:underline uppercase tracking-widest">
                                SIGN UP
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;