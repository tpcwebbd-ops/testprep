import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, Award, Users, BookOpen } from 'lucide-react';
import SocialIcon from './Social-icon';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const FooterSectionComponents: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections: FooterSection[] = [
    {
      title: 'Popular Categories',
      links: [
        { label: 'Private Batch Admission', href: '/private-batch' },
        { label: 'Real Mock Test', href: '/mock-test' },
        { label: 'Offline Batch', href: '/offline-batch' },
        { label: 'Blog & News', href: '/blog' },
        { label: 'IELTS Preparation', href: '/ielts' },
        { label: 'TOEFL Preparation', href: '/toefl' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact us', href: '/contact' },
        { label: 'Forum', href: '/forum' },
        { label: 'Live Chat', href: '/chat' },
        { label: 'Study Materials', href: '/materials' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Rashed Hossain', href: '/founder' },
        { label: 'About us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Success Stories', href: '/success' },
        { label: 'Our Team', href: '/team' },
        { label: 'Press', href: '/press' },
      ],
    },
  ];

  const legalLinks: FooterLink[] = [
    { label: 'Term of use', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: '10,000+', label: 'Students' },
    { icon: <Award className="w-5 h-5" />, value: '95%', label: 'Success Rate' },
    { icon: <BookOpen className="w-5 h-5" />, value: '50+', label: 'Courses' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 rounded-full p-3">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Test <span className="text-red-500">Prep</span>
                </h2>
                <p className="text-sm text-gray-400">TestPrep Center</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Testprep Center: Your trusted partner for simple, effective, and affordable IELTS preparation. Start your success journey today!
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-red-500" />
                <a href="tel:+8801786558855">+880 1786 558855</a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-red-500" />
                <span>ctestprep@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Clock className="w-4 h-4 text-red-500" />
                <span>9:00 AM - 9:00 PM</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <SocialIcon />
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-white relative">
                {section.title}
                <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-red-500"></div>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-gray-400 hover:text-red-500 transition-colors duration-300 hover:translate-x-1 transform inline-block">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-center space-x-2 text-red-500 mb-2">
                  {stat.icon}
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">© {currentYear} TestPrep Center. All rights reserved.</div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6">
              {legalLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-gray-400 hover:text-red-500 text-sm transition-colors duration-300">
                  {link.label}
                </a>
              ))}
            </div>

            {/* Additional Info */}
            <div className="text-gray-400 text-sm">Made with ❤️ in Bangladesh</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSectionComponents;
