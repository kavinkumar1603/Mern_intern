import Products from "./Products";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const TopProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
                if (response.ok) {
                    const data = await response.json();
                    // Simulating "Top Products" by taking the first 4 items
                    setProducts(data.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching top products:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-white min-h-screen pt-28 pb-12">
            <div className="max-w-[1400px] mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="border-b border-black pb-6"
                >
                    <span className="block text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
                        Customer Favorites
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                        Top Trending
                    </h1>
                </motion.div>
            </div>
            <Products products={products} />
        </div>
    );
}

export default TopProducts;
