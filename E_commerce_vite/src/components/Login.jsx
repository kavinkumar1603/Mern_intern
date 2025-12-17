import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

const Login = () => {
    const [Email, setEmail] = useState("");
    const [error, setError] = useState(""); // State for login errors
    const passref = useRef('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        const password = passref.current.value;

        if (!Email || !password) {
            setError("Please enter Email and password");
            // toast.error("Please enter Email and password"); // Optional: Keep toast if desired, but user asked for frontend display
            return;
        }

        try {
            // Note: Ensure your backend server is running and listening on /auth/login
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: Email, password })
            });

            const data = await response.json();
            console.log('Server Response:', data); // View this in browser console

            if (response.ok) {
                if (data.token) {
                    toast.success("Login Successful");
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('token', data.token);
                    const role = data.role || 'user';
                    sessionStorage.setItem('userRole', role);
                    // Since server data doesn't return user email explicitly at root, fallback to input state
                    sessionStorage.setItem('username', Email);

                    if (role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/products');
                    }
                } else {
                    console.error("Login response missing token:", data);
                    setError("Login successful but received invalid data from server.");
                }
            } else {
                // Determine error message from server or default
                const errorMessage = data.message || "Invalid password or login failed";
                setError(errorMessage);
                // toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError("An error occurred during login. Ensure server is running.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <motion.div
                    className="bg-white border-2 border-gray-300 rounded-2xl shadow-2xl p-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-serif font-bold text-black mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to continue shopping</p>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={Email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(""); // Clear error on typing
                                }}
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition text-black placeholder-gray-400"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                ref={passref}
                                onChange={() => setError("")} // Clear error on typing
                                required
                                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition text-black placeholder-gray-400"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            Log In
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;