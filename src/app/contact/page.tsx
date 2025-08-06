'use client';

import { useState, FormEvent } from 'react';
import { Phone, MapPin, Mail, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || mobile.trim().length < 3 || message.trim().length < 3) {
      setError('Name, Mobile, and Message fields must have at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate form submission
    setTimeout(() => {
      console.log({ name, mobile, email, message });
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after success animation
      setTimeout(() => {
        setName('');
        setMobile('');
        setEmail('');
        setMessage('');
        setIsSubmitted(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl animate-float-medium"></div>

        {/* Animated Particles */}
        {Array.from({ length: 80 }, (_, i) => {
          const size = Math.random() * 3 + 1; // Random size between 1-4px
          const opacity = Math.random() * 0.6 + 0.2; // Random opacity between 0.2-0.8
          const animationType = Math.floor(Math.random() * 4); // 4 different animation types

          return (
            <div
              key={i}
              className={`absolute bg-white rounded-full animate-particle-${animationType}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: opacity,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          );
        })}

        {/* Floating Constellation Dots */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={`constellation-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-constellation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-down">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-glow">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Ready to start something amazing together? We'd love to hear from you and bring your ideas to life.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-right">
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center animate-spin-slow">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Contact Number</h3>
                    <p className="text-gray-300 text-lg hover:text-blue-400 transition-colors cursor-pointer">+880 1786 558855</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Address</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      স্থান: টেস্টপ্রেপ সেন্টার, মিরপুর-১০, <br />
                      সেন্ট্রাল প্লাজা, লিফট-৮, (মেট্রো পিলার নং ২৫৩) <br />
                      মোবাইল: 01912 236 108, 01786 558855
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.3659034224215!2d90.3669119758983!3d23.80558428665453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c105166e51f5%3A0xefcdb085c2b1352b!2sCentral%20Plaza!5e0!3m2!1sen!2sbd!4v1754464936991!5m2!1sen!2sbd"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-left">
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl hover:shadow-pink-500/25 transition-all duration-500">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center animate-pulse">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Send us a Message
              </h2>

              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-100 px-6 py-4 rounded-xl mb-6 animate-shake">
                  <strong className="font-bold">Error! </strong>
                  <span>{error}</span>
                </div>
              )}

              {isSubmitted && (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/50 text-green-100 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 animate-success">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Message sent successfully!</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="group">
                  <label htmlFor="name" className="block text-lg font-medium text-gray-200 mb-2 group-focus-within:text-blue-400 transition-colors">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="mobile" className="block text-lg font-medium text-gray-200 mb-2 group-focus-within:text-purple-400 transition-colors">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                    placeholder="+880 1XXX XXXXXX"
                    required
                  />
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-lg font-medium text-gray-200 mb-2 group-focus-within:text-pink-400 transition-colors">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-lg font-medium text-gray-200 mb-2 group-focus-within:text-cyan-400 transition-colors">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 hover:bg-white/8 resize-none"
                    placeholder="Tell us about your project or inquiry..."
                    required
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(90deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(147, 51, 234, 0.8), 0 0 40px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes success {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes particle-0 {
          0% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px) translateX(20px) scale(1.2);
            opacity: 0.5;
          }
          75% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-60px) translateX(-10px) scale(0.8);
            opacity: 0.1;
          }
        }

        @keyframes particle-1 {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          33% {
            transform: translateY(20px) translateX(-25px) rotate(120deg);
            opacity: 0.7;
          }
          66% {
            transform: translateY(-15px) translateX(15px) rotate(240deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-40px) translateX(30px) rotate(360deg);
            opacity: 0.2;
          }
        }

        @keyframes particle-2 {
          0% {
            transform: scale(0.5) translateY(0px);
            opacity: 0.1;
          }
          20% {
            transform: scale(1.5) translateY(-10px);
            opacity: 0.6;
          }
          40% {
            transform: scale(1) translateY(-25px);
            opacity: 0.8;
          }
          60% {
            transform: scale(1.3) translateY(-35px);
            opacity: 0.4;
          }
          80% {
            transform: scale(0.8) translateY(-45px);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.3) translateY(-70px);
            opacity: 0.1;
          }
        }

        @keyframes particle-3 {
          0% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translateX(-20px) translateY(15px) rotate(90deg) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translateX(25px) translateY(-20px) rotate(180deg) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translateX(-15px) translateY(-40px) rotate(270deg) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translateX(10px) translateY(-60px) rotate(360deg) scale(0.7);
            opacity: 0.2;
          }
        }

        @keyframes constellation {
          0% {
            transform: translateY(0px) scale(0.8);
            opacity: 0.3;
            box-shadow: 0 0 0px rgba(59, 130, 246, 0.5);
          }
          25% {
            transform: translateY(-15px) scale(1.2);
            opacity: 0.8;
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.7);
          }
          50% {
            transform: translateY(-30px) scale(1);
            opacity: 1;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.9);
          }
          75% {
            transform: translateY(-45px) scale(1.1);
            opacity: 0.6;
            box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
          }
          100% {
            transform: translateY(-60px) scale(0.5);
            opacity: 0.2;
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 7s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-success {
          animation: success 0.6s ease-out;
        }

        .animate-particle-0 {
          animation: particle-0 infinite ease-in-out;
        }

        .animate-particle-1 {
          animation: particle-1 infinite ease-in-out;
        }

        .animate-particle-2 {
          animation: particle-2 infinite ease-in-out;
        }

        .animate-particle-3 {
          animation: particle-3 infinite ease-in-out;
        }

        .animate-constellation {
          animation: constellation infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;
