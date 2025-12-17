import { productImages } from "../assets/images";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const Card = ({ product, addToCart }) => {
    // Resolve image path: check map, or fallback to original
    const imageSrc = productImages[product.image] || product.image;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
            className="group relative bg-white"
        >
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                <motion.img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }} // Smooth cubic-bezier
                />

                {/* Overlay Badge - Optional */}
                {product.sellingPrice && product.originalPrice > product.sellingPrice && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold tracking-widest px-3 py-1 uppercase">
                        Sale
                    </div>
                )}

                {/* Quick Add Button showing on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                        onClick={() => addToCart(product)}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors duration-200 shadow-lg"
                    >
                        Add to Cart
                    </motion.button>
                </div>
            </div>

            <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">
                    {product.category}
                </span>
                <h3 className="text-base font-semibold text-black leading-snug mb-2 group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-3 mt-auto">
                    <span className="text-lg font-bold text-black font-mono">
                        ₹{product.sellingPrice || product.originalPrice}
                    </span>
                    {product.sellingPrice && product.originalPrice > product.sellingPrice && (
                        <span className="text-sm text-gray-400 line-through font-mono decoration-gray-300">
                            ₹{product.originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
export default Card;