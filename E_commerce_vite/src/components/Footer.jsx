import linkedin from '../assets/li.png';
import git from '../assets/git1.png';
import instagram from '../assets/insta.png';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer
            className="bg-white py-4 border-t border-gray-700 mt-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">

                {/* Left text */}
                <div className="text-sm font-serif text-black whitespace-nowrap">
                    © 2025 Pantaloon.com Pvt Ltd. All Rights Reserved.
                </div>

                {/* Center Navigation */}
                <nav className="flex gap-8 text-sm">
                    <p className="text-black font-serif hover:text-gray-300 cursor-pointer">Cookies</p>
                    <p className="text-black font-serif hover:text-gray-300 cursor-pointer">Privacy Policy</p>
                    <p className="text-black font-serif hover:text-gray-300 cursor-pointer">Terms and Conditions</p>
                    <p className="text-black font-serif hover:text-gray-300 cursor-pointer">Sitemap</p>
                </nav>

                {/* Right icons */}
                <div className="flex items-center gap-6">
                    <motion.img whileHover={{ scale: 1.2 }} src={linkedin} alt="LinkedIn" className="w-6 h-6 hover:opacity-80 cursor-pointer grayscale" />
                    <motion.img whileHover={{ scale: 1.2 }} src={git} alt="GitHub" className="w-6 h-6 hover:opacity-80 cursor-pointer grayscale" />
                    <motion.img whileHover={{ scale: 1.2 }} src={instagram} alt="Instagram" className="w-6 h-6 hover:opacity-80 cursor-pointer grayscale" />
                </div>

            </div>
        </motion.footer>
    );
};
export default Footer;
