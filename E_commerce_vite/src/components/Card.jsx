import { productImages } from "../assets/images";
import { motion } from "framer-motion";

const Card = ({ product, addToCart }) => {
    // Resolve image path: check map, or fallback to original
    const imageSrc = productImages[product.image] || product.image;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100"
        >
            <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                <motion.img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Overlay Badge - Optional */}
                {product.sellingPrice && product.originalPrice > product.sellingPrice && (
                    <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        SALE
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-black line-clamp-2 leading-snug group-hover:underline transition-all">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold text-black">
                            ₹{product.sellingPrice || product.originalPrice}
                        </span>
                        {product.sellingPrice && product.originalPrice > product.sellingPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                    </div>

                    <motion.button
                        onClick={() => addToCart(product)}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-black text-white py-3 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors duration-200 border border-black hover:bg-white hover:text-black cursor-pointer"
                    >
                        Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
export default Card;