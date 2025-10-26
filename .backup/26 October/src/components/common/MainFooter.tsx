/*
|-----------------------------------------
| English Centre - Main Footer
| Author: Toufiquer Rahman <toufiquer.0@gmail.com>
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BiLogoFacebookCircle, BiLogoLinkedin } from 'react-icons/bi';
import { BsTwitter } from 'react-icons/bs';

const MainFooter = () => {
  const quickLinks = [
    { id: 1, title: 'About Us', link: '/about' },
    { id: 2, title: 'Our Services', link: '/service' },
    { id: 3, title: 'Contact', link: '/contact' },
    { id: 4, title: 'FAQ', link: '/faq' },
    { id: 5, title: 'Privacy Policy', link: '/privacy-and-policy' },
    { id: 6, title: 'Terms & Conditions', link: '/terms-and-condition' },
  ];

  const socialLinks = [
    { id: 1, icon: <BiLogoFacebookCircle size={22} />, link: '#' },
    { id: 2, icon: <BsTwitter size={20} />, link: '#' },
    { id: 3, icon: <BiLogoLinkedin size={22} />, link: '#' },
  ];

  return (
    <footer className="relative mt-16 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-white/30 backdrop-blur-2xl border-t border-white/40 text-gray-700 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        {/* Top Section */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Logo & Info */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="https://i.ibb.co/pzsn8MG/english-logo.png" alt="English Centre Logo" width={40} height={40} className="rounded-lg shadow-sm" />
              <span className="text-xl font-semibold text-blue-700">English Centre</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Empowering learners with strong English communication skills for global success. Our commitment is to excellence, growth, and confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <motion.li key={link.id} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <Link href={link.link} className="text-gray-700 hover:text-blue-600 transition-colors text-sm">
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>📍 English Centre, 2nd Floor, Green Plaza, Dhanmondi, Dhaka – 1209</li>
              <li>📞 +880 1700-123456</li>
              <li>✉️ info@englishcentre.com</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Follow Us</h3>
            <div className="flex items-center gap-4">
              {socialLinks.map(social => (
                <Link
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  className="p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/30 hover:bg-blue-100 transition"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/40" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} English Centre. All rights reserved.</p>
          <p className="text-gray-500">
            Designed with ❤️ by <span className="text-blue-600 font-semibold">Toufiquer</span>
          </p>
        </div>
      </motion.div>

      {/* Floating Gradient Blur Effects */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-300/20 blur-3xl rounded-full animate-pulse" />
    </footer>
  );
};

export default MainFooter;
