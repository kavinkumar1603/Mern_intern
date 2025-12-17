import hero1 from "../assets/hero1.jpg";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]); // Parallax effect

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section id="home" className="w-full bg-white px-4 pt-4 pb-0 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                {/* Rounded Hero Container */}
                <div className="relative w-full h-[550px] sm:h-[600px] rounded-3xl overflow-hidden bg-gray-900 shadow-2xl">
                    {/* Background Image with Parallax */}
                    <motion.div
                        className="absolute inset-0 w-full h-[120%] bg-cover bg-center grayscale"
                        style={{
                            backgroundImage: `url(${hero1})`,
                            y
                        }}
                    >
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                    </motion.div>

                    {/* Content Container */}
                    <motion.div
                        className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-10 lg:p-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Top Content */}
                        <div className="max-w-xl space-y-6">
                            {/* Main Heading */}
                            <motion.h1
                                className="text-4xl sm:text-5xl lg:text-8xl font-black text-white leading-tight tracking-tight"
                                variants={itemVariants}
                            >
                                Wear the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Culture.</span>
                                <br />
                                Own the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Streets.</span>
                            </motion.h1>

                            {/* Subheading */}
                            <motion.p
                                className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md font-medium"
                                variants={itemVariants}
                            >
                                Bold designs. Premium quality. Streetwear that speaks.
                                <br />
                                Elevate your style with pieces made to stand out.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-wrap items-center gap-4 pt-4"
                                variants={itemVariants}
                            >
                                <a href="#products">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-white text-black text-sm font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
                                    >
                                        Shop Now
                                        <span className="text-lg">→</span>
                                    </motion.button>
                                </a>
                                <a href="#products">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-transparent text-white text-sm font-bold rounded-full border border-white/30 backdrop-blur-sm"
                                    >
                                        Explore Collection
                                    </motion.button>
                                </a>
                            </motion.div>
                        </div>

                        {/* Bottom Section - Feature Cards */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-auto"
                            variants={containerVariants}
                        >
                            {/* Comfort Card */}
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <h3 className="text-white font-semibold mt-6 text-lg border-l-2 border-white pl-3">Comfort</h3>
                                <p className="text-gray-400 text-xs leading-relaxed pl-3">
                                    Designed for all-day wear. Because style should never come at the cost of comfort.
                                </p>
                            </motion.div>

                            {/* Style Card */}
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <h3 className="text-white font-semibold mt-6 text-lg border-l-2 border-white pl-3">Style</h3>
                                <p className="text-gray-400 text-xs leading-relaxed pl-3">
                                    Bold, effortless, and made to stand out. Our pieces turn heads while staying true to the culture.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
