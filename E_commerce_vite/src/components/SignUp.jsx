import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import hero1 from "../assets/hero1.jpg";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const passRef = useRef('');
    const confirmPassRef = useRef('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const password = passRef.current.value;
        const confirmPassword = confirmPassRef.current.value;

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Registration Successful! Please login.");
                navigate('/login');
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            console.error('Registration error:', error);
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
                            JOIN THE <br /> REVOLUTION.
                        </h1>
                        <p className="text-gray-300 max-w-md font-medium">
                            Create an account and start your journey with exclusive styles and offers.
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
                        <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Create Account</h2>
                        <p className="text-gray-500 font-medium">Sign up for a new adventure.</p>
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
                                    type="email"
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
                                    ref={passRef}
                                    onChange={() => setError("")}
                                />
                                <label
                                    htmlFor="password"
                                    className="peer-focus:font-bold absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-widest"
                                >
                                    Password
                                </label>
                            </div>

                            <div className="group relative z-0 w-full mb-6 group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="block py-4 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-black peer transition-colors"
                                    placeholder=" "
                                    required
                                    ref={confirmPassRef}
                                    onChange={() => setError("")}
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className="peer-focus:font-bold absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-widest"
                                >
                                    Confirm Password
                                </label>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black uppercase tracking-widest"
                        >
                            CREATE ACCOUNT
                        </motion.button>

                        <p className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500 font-medium">
                            ALREADY HAVE AN ACCOUNT?{' '}
                            <Link to="/login" className="font-bold text-black hover:underline uppercase tracking-widest">
                                LOG IN
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
