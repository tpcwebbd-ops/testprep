'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, MapPin, BookOpen, GraduationCap, User, FileText, Globe, ChevronRight, Loader2, Send, AlertCircle } from 'lucide-react';

interface CourseDetails {
  subject: string;
  courseName: string;
  tuitionFee: string;
}

interface University {
  id: number;
  name: string;
  courses: CourseDetails[];
}

interface City {
  name: string;
  universities: University[];
}

interface CountryData {
  id: number;
  country: string;
  cities: City[];
}

const UNIVERSITY_DATA: CountryData[] = [
  {
    id: 1,
    country: 'USA',
    cities: [
      {
        name: 'New York',
        universities: [
          {
            id: 101,
            name: 'New York University',
            courses: [
              { subject: 'Computer Science', courseName: 'B.Sc in CS', tuitionFee: '$55,000/yr' },
              { subject: 'Business', courseName: 'MBA Finance', tuitionFee: '$80,000/yr' },
            ],
          },
          {
            id: 102,
            name: 'Columbia University',
            courses: [{ subject: 'Law', courseName: 'Juris Doctor', tuitionFee: '$75,000/yr' }],
          },
        ],
      },
      {
        name: 'Boston',
        universities: [
          {
            id: 103,
            name: 'Harvard University',
            courses: [{ subject: 'Medicine', courseName: 'MD', tuitionFee: '$65,000/yr' }],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    country: 'UK',
    cities: [
      {
        name: 'London',
        universities: [
          {
            id: 201,
            name: 'Imperial College London',
            courses: [{ subject: 'Engineering', courseName: 'M.Eng Civil', tuitionFee: '£32,000/yr' }],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    country: 'Canada',
    cities: [
      {
        name: 'Toronto',
        universities: [
          {
            id: 301,
            name: 'University of Toronto',
            courses: [
              { subject: 'Arts', courseName: 'BA History', tuitionFee: 'CAD 45,000/yr' },
              { subject: 'Science', courseName: 'B.Sc Biology', tuitionFee: 'CAD 50,000/yr' },
            ],
          },
        ],
      },
    ],
  },
];

interface FormDataState {
  fullName: string;
  age: string;
  fatherName: string;
  motherName: string;
  englishProficiency: string;
  englishScore: string;
  passport?: File | null;
  sscCertificate?: File | null;
  hscCertificate?: File | null;
  bscCertificate?: File | null;
  mscCertificate?: File | null;
  otherCurriculum: string;
  selectedCountry: string;
  selectedCity: string;
  selectedUniversity: string;
  selectedCourseIndex: string;
}

const inputClasses =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm hover:bg-white/10';
const labelClasses = 'block text-sm font-medium text-gray-300 mb-2 ml-1';
const sectionTitleClasses = 'text-xl font-semibold text-white mb-6 flex items-center gap-2';

export default function StudentApplicationForm() {
  const [formData, setFormData] = useState<FormDataState>({
    fullName: '',
    age: '',
    fatherName: '',
    motherName: '',
    englishProficiency: '',
    englishScore: '',
    otherCurriculum: '',
    selectedCountry: '',
    selectedCity: '',
    selectedUniversity: '',
    selectedCourseIndex: '',
    passport: null,
    sscCertificate: null,
    hscCertificate: null,
    bscCertificate: null,
    mscCertificate: null,
  });

  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [availableUniversities, setAvailableUniversities] = useState<University[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseDetails[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (formData.selectedCountry) {
      const country = UNIVERSITY_DATA.find(c => c.country === formData.selectedCountry);
      setAvailableCities(country ? country.cities : []);
      setFormData(prev => ({ ...prev, selectedCity: '', selectedUniversity: '', selectedCourseIndex: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [formData.selectedCountry]);

  useEffect(() => {
    if (formData.selectedCity) {
      const city = availableCities.find(c => c.name === formData.selectedCity);
      setAvailableUniversities(city ? city.universities : []);
      setFormData(prev => ({ ...prev, selectedUniversity: '', selectedCourseIndex: '' }));
    } else {
      setAvailableUniversities([]);
    }
  }, [formData.selectedCity, availableCities]);

  useEffect(() => {
    if (formData.selectedUniversity) {
      const uni = availableUniversities.find(u => u.name === formData.selectedUniversity);
      setAvailableCourses(uni ? uni.courses : []);
      setFormData(prev => ({ ...prev, selectedCourseIndex: '' }));
    } else {
      setAvailableCourses([]);
    }
  }, [formData.selectedUniversity, availableUniversities]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof FormDataState) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('age', formData.age);
      data.append('fatherName', formData.fatherName);
      data.append('motherName', formData.motherName);
      data.append('englishProficiency', formData.englishProficiency);
      data.append('englishScore', formData.englishScore);
      data.append('otherCurriculum', formData.otherCurriculum);
      data.append('selectedCountry', formData.selectedCountry);
      data.append('selectedCity', formData.selectedCity);
      data.append('selectedUniversity', formData.selectedUniversity);

      if (formData.selectedCourseIndex !== '') {
        const courseIdx = parseInt(formData.selectedCourseIndex);
        if (availableCourses[courseIdx]) {
          data.append('selectedCourseName', availableCourses[courseIdx].courseName);
          data.append('selectedCourseSubject', availableCourses[courseIdx].subject);
        }
      }

      if (formData.passport) data.append('passport', formData.passport);
      if (formData.sscCertificate) data.append('sscCertificate', formData.sscCertificate);
      if (formData.hscCertificate) data.append('hscCertificate', formData.hscCertificate);
      if (formData.bscCertificate) data.append('bscCertificate', formData.bscCertificate);
      if (formData.mscCertificate) data.append('mscCertificate', formData.mscCertificate);

      const response = await fetch('/api/application', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      setStatus('success');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#111] p-8 rounded-3xl border border-green-500/20 shadow-2xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Application Received!</h2>
          <p className="text-gray-400 mb-8">Your application and documents have been successfully sent to our admission team.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[65px] bg-[#050505] text-white selection:bg-purple-500 selection:text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-full h-96 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-4">
            University Application Portal
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Begin your journey to higher education. Fill out the details below to apply to top universities worldwide.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#111]/50 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl"
          >
            <h2 className={sectionTitleClasses}>
              <User className="w-5 h-5 text-purple-400" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className={labelClasses}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Age</label>
                <input type="number" name="age" required value={formData.age} onChange={handleInputChange} placeholder="24" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Language Test</label>
                <select name="englishProficiency" value={formData.englishProficiency} onChange={handleInputChange} className={inputClasses} required>
                  <option value="" className="bg-gray-900">
                    Select Test
                  </option>
                  <option value="IELTS" className="bg-gray-900">
                    IELTS
                  </option>
                  <option value="PTE" className="bg-gray-900">
                    PTE
                  </option>
                  <option value="TOEFL" className="bg-gray-900">
                    TOEFL
                  </option>
                  <option value="Duolingo" className="bg-gray-900">
                    Duolingo
                  </option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className={labelClasses}>Father&apos;s Name</label>
                <input
                  type="text"
                  name="fatherName"
                  required
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Father's Full Name"
                  className={inputClasses}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelClasses}>Mother&apos;s Name</label>
                <input
                  type="text"
                  name="motherName"
                  required
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Mother's Full Name"
                  className={inputClasses}
                />
              </div>
              <div className="lg:col-span-4">
                <label className={labelClasses}>Test Score ({formData.englishProficiency || 'IELTS/PTE'})</label>
                <input
                  type="text"
                  name="englishScore"
                  required
                  value={formData.englishScore}
                  onChange={handleInputChange}
                  placeholder="e.g. 7.5 or 65"
                  className={inputClasses}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111]/50 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl"
          >
            <h2 className={sectionTitleClasses}>
              <FileText className="w-5 h-5 text-purple-400" />
              Documents & Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Passport (Optional)', key: 'passport' },
                { label: 'SSC Certificate', key: 'sscCertificate' },
                { label: 'HSC Certificate', key: 'hscCertificate' },
                { label: 'B.Sc Certificate (Optional)', key: 'bscCertificate' },
                { label: 'M.Sc Certificate (Optional)', key: 'mscCertificate' },
              ].map(doc => (
                <div key={doc.key} className="relative group">
                  <label className={labelClasses}>{doc.label}</label>
                  <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => handleFileChange(e, doc.key as keyof FormDataState)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
                        <Upload size={18} />
                      </div>
                      <span className="text-sm text-gray-400 truncate">{(formData[doc.key as keyof FormDataState] as File)?.name || 'Upload PDF/Image'}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="lg:col-span-3">
                <label className={labelClasses}>Other Curriculum Activity</label>
                <textarea
                  name="otherCurriculum"
                  value={formData.otherCurriculum}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Sports, Volunteering, Awards..."
                  className={inputClasses}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#111]/50 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl"
          >
            <h2 className={sectionTitleClasses}>
              <Globe className="w-5 h-5 text-purple-400" />
              Study Destination
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Select Country</label>
                <div className="relative">
                  <select
                    name="selectedCountry"
                    value={formData.selectedCountry}
                    onChange={handleInputChange}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                    required
                  >
                    <option value="" className="bg-gray-900">
                      Choose a country...
                    </option>
                    {UNIVERSITY_DATA.map(c => (
                      <option key={c.id} value={c.country} className="bg-gray-900">
                        {c.country}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Select City</label>
                <div className="relative">
                  <select
                    name="selectedCity"
                    value={formData.selectedCity}
                    onChange={handleInputChange}
                    className={`${inputClasses} appearance-none cursor-pointer disabled:opacity-50`}
                    disabled={!formData.selectedCountry}
                    required
                  >
                    <option value="" className="bg-gray-900">
                      {formData.selectedCountry ? 'Choose a city...' : 'Select Country First'}
                    </option>
                    {availableCities.map((city, idx) => (
                      <option key={idx} value={city.name} className="bg-gray-900">
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Select University</label>
                <div className="relative">
                  <select
                    name="selectedUniversity"
                    value={formData.selectedUniversity}
                    onChange={handleInputChange}
                    className={`${inputClasses} appearance-none cursor-pointer disabled:opacity-50`}
                    disabled={!formData.selectedCity}
                    required
                  >
                    <option value="" className="bg-gray-900">
                      {formData.selectedCity ? 'Choose a university...' : 'Select City First'}
                    </option>
                    {availableUniversities.map(uni => (
                      <option key={uni.id} value={uni.name} className="bg-gray-900">
                        {uni.name}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {formData.selectedUniversity && (
                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className={labelClasses}>Select Program</label>
                  <div className="grid gap-4">
                    {availableCourses.map((course, idx) => (
                      <label
                        key={idx}
                        className={`
                          relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300
                          ${
                            formData.selectedCourseIndex === idx.toString()
                              ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="selectedCourseIndex"
                          value={idx}
                          checked={formData.selectedCourseIndex === idx.toString()}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-white">{course.courseName}</h3>
                            <span className="text-sm font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">{course.subject}</span>
                          </div>
                          <p className="text-sm text-gray-400 flex items-center gap-1.5">
                            <BookOpen size={14} />
                            Tuition: <span className="text-gray-200">{course.tuitionFee}</span>
                          </p>
                        </div>
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 ml-4 flex items-center justify-center
                          ${formData.selectedCourseIndex === idx.toString() ? 'border-purple-500' : 'border-gray-500'}
                        `}
                        >
                          {formData.selectedCourseIndex === idx.toString() && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200"
            >
              <AlertCircle size={20} />
              <p>{errorMessage}</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end pt-4 pb-20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg
                hover:bg-purple-50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]
                flex items-center gap-3 overflow-hidden
              "
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    Processing <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Submit Application <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
