import Products from "./Products";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const ProductDetail = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Products products={products} />
        </motion.div>
    );
}

export default ProductDetail;