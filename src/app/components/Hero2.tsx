'use client'
import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, Clock, Target, Users, Star, CheckCircle, PlayCircle, BookOpen, Award, TrendingUp } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface StatItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => (
  <div className="text-center group">
    <div className="flex justify-center mb-3 text-red-500 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-red-100 text-sm">{label}</div>
  </div>
);

const TestPrepHero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    "Real Test Format",
    "Instant Results", 
    "Detailed Explanations",
    "Expert Guidance"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
 
      {/* Main Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          {/* Animated Badge */}
          <div className={`inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Star className="w-4 h-4 mr-2 text-red-500" />
            Bangladesh's #1 IELTS Preparation Platform
          </div>

          {/* Main Headline */}
          <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Free Online <span className="text-red-500">IELTS</span><br />
            Real Mock Tests With<br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Explanations
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            Master your IELTS with authentic practice tests, instant results, and detailed explanations. 
            Join thousands of successful students who achieved their target band scores.
          </p>

          {/* Animated Features */}
          <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {features.map((feature, index) => (
              <div 
                key={feature}
                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                  index === currentFeature 
                    ? 'bg-red-500 text-white border-red-500 shadow-lg scale-105' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                }`}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16 border border-gray-100">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left - Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real Test Format</h3>
                  <p className="text-gray-600 text-sm">Authentic IELTS exam experience</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Results</h3>
                  <p className="text-gray-600 text-sm">Get your scores immediately</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Detailed Explanation</h3>
                  <p className="text-gray-600 text-sm">Learn from every question</p>
                </div>
              </div>
            </div>

            {/* Center - CTA */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer group">
                <PlayCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center mx-auto group transition-all duration-300 shadow-lg hover:shadow-xl">
                TAKE A TEST
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right - Stats */}
            <div className="space-y-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-red-500 mb-1">50K+</div>
                <div className="text-gray-600 text-sm">Students Tested</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-500 mb-1">8.5</div>
                <div className="text-gray-600 text-sm">Average Band Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-green-500 mb-1">95%</div>
                <div className="text-gray-600 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-white" />}
            title="Authentic Practice Tests"
            description="Experience real IELTS exam conditions with our carefully crafted mock tests that mirror the actual exam format and difficulty level."
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-white" />}
            title="Instant Score Analysis"
            description="Get immediate feedback with detailed band score breakdown and performance analytics to track your progress effectively."
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-white" />}
            title="Expert Explanations"
            description="Learn from comprehensive explanations for every question, written by IELTS experts to help you understand concepts deeply."
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        {/* Bottom Stats Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Join Our Success Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem
              value="50K+"
              label="Students Helped"
              icon={<Users className="w-8 h-8" />}
            />
            <StatItem
              value="8.5"
              label="Average Band Score"
              icon={<TrendingUp className="w-8 h-8" />}
            />
            <StatItem
              value="95%"
              label="Success Rate"
              icon={<Award className="w-8 h-8" />}
            />
            <StatItem
              value="24/7"
              label="Expert Support"
              icon={<CheckCircle className="w-8 h-8" />}
            />
          </div>
          
          <div className="mt-8">
            <button className="bg-white text-red-500 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPrepHero;