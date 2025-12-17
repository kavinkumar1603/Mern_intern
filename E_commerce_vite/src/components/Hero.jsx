import hero1 from "../assets/hero1.jpg";
import { motion, useScroll, useTransform, useSpring } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useRef } from "react";

const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Smooth spring physics for parallax
    const scrollYSpring = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Parallax transformations
    const y = useTransform(scrollYSpring, [0, 1000], [0, 400]);
    const scale = useTransform(scrollYSpring, [0, 1000], [1, 1.15]);
    const textY = useTransform(scrollYSpring, [0, 500], [0, 200]);
    const opacity = useTransform(scrollYSpring, [0, 400], [1, 0]);

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    return (
        <section ref={containerRef} id="home" className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black">
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{ y, scale }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hero1})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            </motion.div>

            {/* Content */}
            <motion.div
                className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center pt-24"
                style={{ y: textY, opacity }}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-4xl space-y-2">
                    <div className="overflow-hidden">
                        <motion.span
                            className="inline-block text-sm md:text-base font-bold tracking-[0.2em] text-gray-300 uppercase mb-4"
                            variants={fadeInUpVariants}
                        >
                            Establish Your Presence
                        </motion.span>
                    </div>

                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9]"
                            variants={fadeInUpVariants}
                        >
                            WEAR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">CULTURE.</span>
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-white tracking-tighter leading-[0.9]"
                            variants={fadeInUpVariants}
                        >
                            OWN THE STREETS.
                        </motion.h1>
                    </div>

                    <div className="max-w-xl mt-8 overflow-hidden">
                        <motion.p
                            className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed"
                            variants={fadeInUpVariants}
                        >
                            Bold designs. Premium materials. Meticulous craftsmanship.
                            Step into a world where fashion meets function in the most sophisticated way.
                        </motion.p>
                    </div>

                    <motion.div
                        className="flex flex-wrap items-center gap-6 pt-10"
                        variants={fadeInUpVariants}
                    >
                        <a href="#products">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-white text-black text-sm font-bold tracking-widest uppercase rounded-none transition-colors duration-300"
                            >
                                Shop Collection
                            </motion.button>
                        </a>
                        <a href="#products">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-transparent text-white text-sm font-bold tracking-widest uppercase rounded-none border border-white/40 backdrop-blur-sm hover:border-white transition-colors duration-300"
                            >
                                View Lookbook
                            </motion.button>
                        </a>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ opacity }}
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
            </motion.div>
        </section>
    );
};

export default Hero;
