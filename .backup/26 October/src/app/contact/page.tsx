'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, PhoneCall, MessageCircle, Send } from 'lucide-react';
import MainFooter from '@/components/common/MainFooter';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      // Replace with your API endpoint (e.g., /api/send-email)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('✅ Message sent successfully!');
      setFormData({ name: '', email: '', mobile: '', message: '' });
    } catch {
      setStatus('❌ Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800 relative overflow-hidden">
      {/* Glass Background */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-0" />

      {/* Contact Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Get in Touch</h1>
        <p className="text-center text-gray-700 mb-6">We’d love to hear from you! Fill out the form below, and our team will get back to you soon.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
              placeholder="example@email.com"
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
              placeholder="Write your message here..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-70"
          >
            {isSending ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </button>
        </form>

        {/* Status Message */}
        {status && <p className={`mt-4 text-center font-medium ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
      </motion.div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/30 backdrop-blur-md border-t border-white/40 flex md:hidden justify-around py-3 z-50">
        <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <Home size={22} />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="https://wa.me/8801700123456"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-gray-700 hover:text-green-600"
        >
          <MessageCircle size={22} />
          <span className="text-xs">WhatsApp</span>
        </Link>

        <Link href="tel:+8801991075127" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <PhoneCall size={22} />
          <span className="text-xs">Contact</span>
        </Link>
      </nav>
      <MainFooter />
    </div>
  );
};

export default Contact;
