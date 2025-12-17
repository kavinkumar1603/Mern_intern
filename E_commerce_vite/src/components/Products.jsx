import Card from "./Card";
import { motion } from "framer-motion";

const Products = ({ products = [] }) => {
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

            console.log("Sending Payload:", payload);

            const response = await fetch('http://localhost:3000/cart', {
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
                console.error("Server Error:", errorData);
                alert(`Failed: ${errorData.message || errorData.error || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert(`Error adding to cart: ${error.message}`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    if (!products || products.length === 0) {
        return (
            <motion.section
                id="products"
                className="w-full bg-white py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">
                            New Arrivals
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Our latest collection is on its way. Stay tuned for exclusive drops.
                        </p>
                    </div>
                </div>
            </motion.section>
        );
    }

    return (
        <section id="products" className="w-full bg-white pt-0 pb-8 md:pb-12">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-end mb-2 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={headerVariants}
                >
                    <div className="max-w-2xl">
                        <span className="text-gray-500 font-bold tracking-wider uppercase text-sm mt-2 mb-2 block">
                            Summer Collection 2024
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight mb-2">
                            Curated Fashion <span className="text-black underline decoration-gray-300 decoration-4 underline-offset-4">For You</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Discover our handpicked selection of premium clothing and accessories designed for the modern lifestyle.
                        </p>
                    </div>
                </motion.div>

                {/* Shirts Section */}
                {products.filter(p => p.category.toLowerCase().includes('shirt')).length > 0 && (
                    <div className="mb-16">
                        <motion.h3
                            className="text-3xl font-bold text-black mb-8 border-b pb-4"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Shirts
                        </motion.h3>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {products
                                .filter(product => product.category.toLowerCase().includes('shirt'))
                                .map((product) => (
                                    <Card key={product._id || product.id} product={product} addToCart={addToCart} />
                                ))}
                        </motion.div>
                    </div>
                )}

                {/* Pants Section */}
                {products.filter(p => p.category.toLowerCase().includes('pant')).length > 0 && (
                    <div className="mb-16">
                        <motion.h3
                            className="text-3xl font-bold text-black mb-8 border-b pb-4"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Pants
                        </motion.h3>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {products
                                .filter(product => product.category.toLowerCase().includes('pant'))
                                .map((product) => (
                                    <Card key={product._id || product.id} product={product} addToCart={addToCart} />
                                ))}
                        </motion.div>
                    </div>
                )}

                {/* Other Items Section */}
                {products.filter(p => !p.category.toLowerCase().includes('shirt') && !p.category.toLowerCase().includes('pant')).length > 0 && (
                    <div className="mb-16">
                        <motion.h3
                            className="text-3xl font-bold text-black mb-8 border-b pb-4"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Other Collection
                        </motion.h3>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {products
                                .filter(product => !product.category.toLowerCase().includes('shirt') && !product.category.toLowerCase().includes('pant'))
                                .map((product) => (
                                    <Card key={product._id || product.id} product={product} addToCart={addToCart} />
                                ))}
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};
export default Products;