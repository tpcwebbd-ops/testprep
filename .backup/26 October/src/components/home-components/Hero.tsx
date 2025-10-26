'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Users, Award, TrendingUp, Play, Star } from 'lucide-react';

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/20">
    <div className="flex justify-center mb-3 text-white">{icon}</div>
    <div className="text-3xl font-bold text-white mb-2">{number}</div>
    <div className="text-white/80 text-sm">{label}</div>
  </div>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const TestPrepHero: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    { name: 'Sarah Ahmed', score: 'Band 8.5', text: 'Achieved my dream IELTS score!' },
    { name: 'Mohammad Rahman', score: 'Band 7.5', text: 'Excellent preparation materials and guidance.' },
    { name: 'Fatima Khan', score: 'Band 8.0', text: 'The best test prep experience I have had.' },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}

        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 min-h-[80vh]">
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            {/* Top Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white/90 text-sm">Bangladesh&apos;s Top Test Prep Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Master Your
              <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent"> IELTS </span>
              Journey
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Join thousands of successful students who achieved their dream scores with our expert guidance, comprehensive materials, and proven strategies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center group transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold border border-white/30 flex items-center justify-center group transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Testimonial Carousel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  <span className="pl-3">{testimonials[currentTestimonial].score}</span>
                </div>
                <div>
                  <p className="text-white/90 font-medium">{testimonials[currentTestimonial].text}</p>
                  <p className="text-white/60 text-sm">- {testimonials[currentTestimonial].name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Grid */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="grid grid-cols-2 gap-6">
              <StatCard number="50K+" label="Successful Students" icon={<Users className="w-8 h-8" />} />
              <StatCard number="8.5" label="Average Band Score" icon={<TrendingUp className="w-8 h-8" />} />
              <StatCard number="95%" label="Success Rate" icon={<Award className="w-8 h-8" />} />
              <StatCard number="24/7" label="Expert Support" icon={<BookOpen className="w-8 h-8" />} />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Reading Mastery"
            description="Advanced reading techniques and strategies to achieve Band 8+ scores with expert guidance."
            icon={<BookOpen className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-red-500 to-pink-500"
          />
          <FeatureCard
            title="Listening Excellence"
            description="Expert listening skills development with comprehensive practice materials and techniques."
            icon={<Play className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />
          <FeatureCard
            title="Writing Perfection"
            description="Task 1 & 2 writing strategies with high band score techniques and personalized feedback."
            icon={<Award className="w-6 h-6 text-white" />}
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
          />
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-4">Join thousands who achieved their dreams</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
              ))}
            </div>
            <span className="text-white/80">+50,000 students</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPrepHero;
