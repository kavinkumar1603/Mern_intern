import linkedin from '../assets/li.png';
import git from '../assets/git1.png';
import instagram from '../assets/insta.png';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Footer = () => {
    return (
        <motion.footer
            className="bg-black text-white py-12 mt-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Left text */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-2xl font-black tracking-tighter uppercase">Aurevia</span>
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        © 2025 Aurevia Inc. All Rights Reserved.
                    </span>
                </div>

                {/* Center Navigation */}
                <nav className="flex flex-wrap justify-center gap-8">
                    {['Cookies', 'Privacy Policy', 'Terms', 'Sitemap'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Right icons */}
                <div className="flex items-center gap-6">
                    {[linkedin, git, instagram].map((icon, index) => (
                        <motion.img
                            key={index}
                            whileHover={{ scale: 1.1, opacity: 1 }}
                            src={icon}
                            alt="Social"
                            className="w-5 h-5 opacity-50 cursor-pointer invert filter"
                        />
                    ))}
                </div>

            </div>
        </motion.footer>
    );
};
export default Footer;
