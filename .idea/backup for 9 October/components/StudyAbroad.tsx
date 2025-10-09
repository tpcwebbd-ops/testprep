import React from 'react';
import { MapPin, Users, Award, BookOpen, Plane, Globe } from 'lucide-react';

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StudyAbroad: React.FC = () => {
  const features: ServiceFeature[] = [
    {
      icon: <Users className="w-8 h-8 text-red-500" />,
      title: 'Expert Guidance',
      description: 'Get personalized support from experienced counselors who understand your goals and help you achieve them.',
    },
    {
      icon: <Award className="w-8 h-8 text-red-500" />,
      title: 'High Success Rate',
      description: 'From applications to visas, our proven process ensures a smooth and successful journey.',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-red-500" />,
      title: 'Tailored Solutions',
      description: 'We provide customized advice based on your needs, budget, and career aspirations.',
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-md mb-6">
            <span className="text-red-500 font-semibold text-sm">★ We Are Also Providing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            The Best{' '}
            <span className="text-red-500 relative">
              Study Abroad
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-500 rounded"></div>
            </span>{' '}
            Services
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-red-50 rounded-xl p-3">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <div className="pt-6">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>Book Free Consultation</span>
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-4 right-4 opacity-10">
                <Globe className="w-24 h-24 text-gray-400" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-10">
                <Plane className="w-20 h-20 text-gray-400" />
              </div>

              {/* Main Content */}
              <div className="relative z-10">
                {/* Header Badge */}
                <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  ★ Testprep center & Immigration Center
                </div>

                {/* Central Illustration */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    {/* Airplane */}
                    <div className="bg-orange-500 rounded-full p-4 mb-4 shadow-lg transform rotate-12">
                      <Plane className="w-12 h-12 text-white" />
                    </div>

                    {/* Student Character */}
                    <div className="bg-gradient-to-b from-orange-400 to-red-500 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <div className="text-white text-2xl">👨‍🎓</div>
                    </div>

                    {/* Passport */}
                    <div className="bg-amber-800 rounded-lg p-2 inline-block shadow-md transform -rotate-6">
                      <div className="text-white text-xs font-bold">PASSPORT</div>
                      <Globe className="w-4 h-4 text-white mx-auto mt-1" />
                    </div>
                  </div>
                </div>

                {/* Location Pins */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Your Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Dream Destination</span>
                  </div>
                </div>

                {/* Decorative Path */}
                <div className="mt-4 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-red-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-500 rounded-full p-3 shadow-lg animate-pulse">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '5000+', label: 'Students Placed' },
            { number: '50+', label: 'Universities' },
            { number: '15+', label: 'Countries' },
            { number: '98%', label: 'Success Rate' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudyAbroad;
