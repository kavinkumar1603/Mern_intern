import { useState, useMemo } from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars

const Products = ({ products = [] }) => {
    const [activeFilter, setActiveFilter] = useState("all");

    const categories = useMemo(() => {
        const uniqueCategories = ["all", ...new Set(products.map(p => p.category.toLowerCase()))];
        return uniqueCategories;
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (activeFilter === "all") return products;
        return products.filter(p => p.category.toLowerCase() === activeFilter);
    }, [products, activeFilter]);

    const addToCart = async (product) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            alert("Please login to add items to cart");
            return;
        }

        const schemaPid = product.id; // Numeric ID

        if (!schemaPid) {
            alert(`Error: Product has no numeric ID. Keys: ${Object.keys(product).join(', ')}`);
            return;
        }

        try {
            const payload = {
                id: Date.now() + Math.floor(Math.random() * 10000), // Unique row ID workaround
                productId: schemaPid, // Numeric Product ID
                name: product.name,
                category: product.category,
                image: product.image,
                price: product.sellingPrice || product.originalPrice,
                quantity: 1
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 401) {
                alert("Session expired. Please login again.");
                sessionStorage.clear();
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                alert('Product added to cart!');
            } else {
                const errorData = await response.json();
                alert(`Failed: ${errorData.message || errorData.error || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(`Error adding to cart: ${error.message}`);
        }
    };

    return (
        <section id="products" className="w-full bg-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="block text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-4"
                        >
                            Latest Drops
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none"
                        >
                            CURATED <span className="text-gray-400">COLLECTION</span>
                        </motion.h2>
                    </div>

                    {/* Filter Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${activeFilter === cat
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <Card key={product._id || product.id} product={product} addToCart={addToCart} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-gray-400"
                    >
                        No products found in this category.
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Products;