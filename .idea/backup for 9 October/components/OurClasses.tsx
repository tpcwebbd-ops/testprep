'use client';
import React, { useState, useEffect } from 'react';
import { Check, Clock, Users, BookOpen, Award, Calendar, MapPin, Star, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  title: string;
  level: string;
  levelColor: string;
  description: string;
  features: string[];
  duration: string;
  classes: string;
  price?: string;
  popular?: boolean;
  schedule?: string[];
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  level,
  levelColor,
  description,
  features,
  duration,
  classes,
  price,
  popular = false,
  schedule = [],
}) => (
  <div
    className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border ${
      popular ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">🔥 Most Popular</div>
      </div>
    )}

    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${levelColor}`}>{level}</span>
        </div>
      </div>
      {price && (
        <div className="text-right">
          <div className="text-3xl font-bold text-red-500">{price}</div>
          <div className="text-gray-500 text-sm">per course</div>
        </div>
      )}
    </div>

    {/* Description */}
    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

    {/* Schedule */}
    {schedule.length > 0 && (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-red-500" />
          Class Schedule
        </h4>
        <div className="space-y-2">
          {schedule.map((time, index) => (
            <div key={index} className="flex items-center text-gray-600 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              {time}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Features */}
    <div className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-gray-700 text-sm">{feature}</span>
        </div>
      ))}
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <div className="text-xl font-bold text-gray-900 mb-1">{duration}</div>
        <div className="text-gray-500 text-xs">Duration</div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <div className="text-xl font-bold text-gray-900 mb-1">{classes}</div>
        <div className="text-gray-500 text-xs">Classes</div>
      </div>
    </div>

    {/* CTA Button */}
    <Button
      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center group ${
        popular
          ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
          : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
      }`}
    >
      + Enroll Now
      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
);

const TestPrepClasses: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('offline');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const courses = [
    {
      title: 'IELTS Comprehensive',
      level: 'Beginner Level',
      levelColor: 'bg-blue-100 text-blue-700',
      description: 'Perfect for beginners who want to build strong English fundamentals before taking IELTS. Comprehensive coverage of all four skills.',
      features: [
        'Language Club & Student Lounge',
        '3 Mock Tests with Teacher Feedback',
        'No Extra Charge for Course Materials',
        'Small Batch Size (Max 12 Students)',
        'Weekend Practice Sessions',
      ],
      duration: '4.5 Months',
      classes: '50+ Classes',
      price: '৳15,000',
    },
    {
      title: 'IELTS Focus',
      level: 'Intermediate Level',
      levelColor: 'bg-green-100 text-green-700',
      description: 'Designed for students with basic English knowledge. Focus on developing IELTS-specific skills and achieving band 6.0-7.0.',
      features: [
        'Language Club & Student Lounge',
        '3 Mock Tests with Teacher Feedback',
        'No Extra Charge for Course Materials',
        'Speaking Practice Sessions',
        'Writing Task Correction',
      ],
      duration: '3 Months',
      classes: '30+ Classes',
      price: '৳12,000',
      popular: true,
    },
    {
      title: 'IELTS Crash',
      level: 'Intensive',
      levelColor: 'bg-red-100 text-red-700',
      description: 'Fast-track intensive course for students who need to prepare quickly. Focused exam strategies and daily practice sessions.',
      features: [
        '3 Mock Tests with Personalized Teacher',
        'No Extra Charge for Course Materials',
        'Daily Practice Sessions',
        'One-on-One Speaking Practice',
        'Express Score Improvement',
      ],
      duration: '1.5 Months',
      classes: '30+ Classes',
      price: '৳18,000',
      schedule: ['Morning Batch: 10:00 AM - 1:30 PM', 'Evening Batch: 5:00 PM - 8:30 PM'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 py-16">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MapPin className="w-4 h-4 mr-2" />
            Available in Dhaka & Chittagong
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Join Our <span className="text-red-500">Offline IELTS</span> Classes
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">For Personalized Learning Experience</p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
              <button
                onClick={() => setActiveTab('offline')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'offline' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Offline Classes
              </button>
              <button
                onClick={() => setActiveTab('online')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'online' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Online Classes
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {courses.map((course, index) => (
            <div
              key={course.title}
              className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CourseCard {...course} />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Classes?</h2>
            <p className="text-gray-600 text-lg">Experience the difference with our proven teaching methodology</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Small Batches</h3>
              <p className="text-gray-600 text-sm">Maximum 12 students per batch for personalized attention</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Expert Teachers</h3>
              <p className="text-gray-600 text-sm">IELTS certified instructors with 8+ band scores</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Free Materials</h3>
              <p className="text-gray-600 text-sm">All course materials and books included at no extra cost</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mock Tests</h3>
              <p className="text-gray-600 text-sm">Regular practice tests with detailed feedback</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your IELTS Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful students who achieved their target band scores</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-red-500 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center group">
              Book Free Consultation
              <Calendar className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 transition-all duration-300 flex items-center group">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Class Demo
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="opacity-90 mb-2">Call us now for immediate enrollment</p>
            <div className="text-2xl font-bold">📞 +880 1XXX-XXXXXX</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPrepClasses;
