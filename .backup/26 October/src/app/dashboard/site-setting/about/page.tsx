'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle';
import { logger } from 'better-auth';

// ----------------------
// 🧩 Type Definitions
// ----------------------
interface ChildData {
  id?: number | string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
}

interface AboutItem {
  id?: number | string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: ChildData[];
}

// ----------------------
// 🧱 Default Data (used if no DB data found)
// ----------------------
const defaultData: AboutItem[] = [
  {
    id: 1,
    name: 'Our Mission',
    path: '/about/mission',
    icon: '<Globe2 />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/mission.svg',
    description:
      'At TestPrep Centre, our mission is to empower ambitious students across Bangladesh to achieve global academic success. We strive to provide world-class test preparation, scholarship guidance, and mentorship to help our students secure fully funded opportunities at top universities in the USA, UK, and Canada.',
  },
  {
    id: 2,
    name: 'About Our Centre',
    path: '/about/centre',
    icon: '<BookOpen />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/centre.svg',
    description:
      'Founded with the vision to bridge the gap between Bangladeshi students and international education, TestPrep Centre offers comprehensive online and hybrid learning programs. Our experienced instructors and personalized learning system ensure that each student reaches their highest potential in IELTS, GRE, and GMAT preparation.',
  },
  {
    id: 3,
    name: 'Courses We Offer',
    path: '/about/courses',
    icon: '<GraduationCap />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/courses.svg',
    description:
      'We offer expertly designed online courses that prepare students to excel in standardized tests required for global admission and scholarships. Each course is structured for maximum flexibility and real results.',
    childData: [
      {
        id: '3.1',
        name: 'IELTS Preparation',
        path: '/courses/ielts',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/ielts.svg',
        description:
          'Our IELTS course focuses on improving your listening, reading, writing, and speaking skills with intensive practice sessions and expert feedback to help you achieve your target band score.',
      },
      {
        id: '3.2',
        name: 'GRE Preparation',
        path: '/courses/gre',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/gre.svg',
        description:
          'Get ready for graduate studies abroad with our GRE course. We provide comprehensive coverage of quantitative reasoning, verbal reasoning, and analytical writing — with proven strategies for high scores.',
      },
      {
        id: '3.3',
        name: 'GMAT Preparation',
        path: '/courses/gmat',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/gmat.svg',
        description:
          'Designed for MBA aspirants, our GMAT course offers structured lessons, mock tests, and performance tracking to help you stand out in competitive business school applications.',
      },
    ],
  },
  {
    id: 4,
    name: 'Scholarship Support',
    path: '/about/scholarship-support',
    icon: '<Medal />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/scholarship.svg',
    description:
      'We go beyond test preparation by helping students craft strong Statements of Purpose (SOPs), recommendation letters, and scholarship essays. Our experts provide step-by-step guidance to find and apply for full-funding opportunities, including TA, GA, and research assistantships.',
  },
  {
    id: 5,
    name: 'Why Choose Us',
    path: '/about/why-choose-us',
    icon: '<Star />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/why-choose-us.svg',
    description:
      "With our proven success record and student-centered teaching approach, TestPrep Centre is trusted by learners nationwide. We combine expert mentorship, modern online tools, and data-driven learning insights to maximize each student's success rate in both tests and scholarship applications.",
  },
  {
    id: 6,
    name: 'Our Approach',
    path: '/about/our-approach',
    icon: '<Target />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/approach.svg',
    description:
      'Our teaching philosophy blends personalized mentorship with adaptive technology. Every course is data-driven — tracking progress, identifying weaknesses, and continuously improving performance through feedback and simulation-based learning.',
  },
  {
    id: 7,
    name: 'Contact & Location',
    path: '/about/contact',
    icon: '<MapPin />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/contact.svg',
    description:
      "TestPrep Centre is based in Bangladesh and proudly serves students nationwide through our online learning platform. Whether you're in Dhaka, Chittagong, or anywhere else, our instructors and counselors are available online to guide you toward your study abroad dream.",
    childData: [
      {
        id: '7.1',
        name: 'Head Office',
        path: '/contact/head-office',
        icon: '<Building2 />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/head-office.svg',
        description:
          'Our main office operates in Dhaka, providing both in-person and online counseling sessions for students preparing for their next academic journey abroad.',
      },
      {
        id: '7.2',
        name: 'Get in Touch',
        path: '/contact/get-in-touch',
        icon: '<Phone />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/get-in-touch.svg',
        description:
          "Reach out to us anytime through our website or social channels for free counseling sessions and course information. We're here to help you every step of the way.",
      },
    ],
  },
];

// ----------------------
// 🧠 Component
// ----------------------
export default function AboutAdminPage() {
  const [aboutList, setAboutList] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productionEnabled, setProductionEnabled] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [isExistingData, setIsExistingData] = useState(false);

  // ----------------------
  // 📦 Fetch Data
  // ----------------------
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/site-setting/about');
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to fetch data.');
        logger.error(`Backend Error: ${data.message}`);
        setAboutList(defaultData);
        setIsExistingData(false);
        return;
      }

      if (Array.isArray(data.data) && data.data.length > 0) {
        setAboutList(data.data);
        setIsExistingData(true);
      } else {
        toast.info('No data found. Loaded default content.');
        setAboutList(defaultData);
        setIsExistingData(false);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unexpected error occurred.';
      setError(message);
      logger.error(`Frontend Error: ${message}`);
      toast.error('Connection error. Loaded default content.');
      setAboutList(defaultData);
      setIsExistingData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------
  // 💾 Save All Changes
  // ----------------------
  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const res = await fetch('/api/site-setting/about', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutList),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(isExistingData ? 'About data updated successfully!' : 'About data created successfully!');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to save changes.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save data.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // 🚀 Publish / Path Validation
  // ----------------------
  const handlePublish = async () => {
    try {
      const paths = aboutList.map(item => item.path);

      const res = await fetch('/api/pathValidation/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Path validation failed.');
        if (data.invalidPaths && data.invalidPaths.length > 0) {
          console.warn('Invalid paths:', data.invalidPaths);
        }
        return;
      }

      toast.success('All paths are valid. Production mode enabled for 10 minutes.');
      setProductionEnabled(true);
      setTimer(600);

      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setProductionEnabled(false);
            toast.info('Production mode expired.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Path Validation Error:', error);
      toast.error('Error occurred while validating paths.');
    }
  };

  const formatTimer = (t: number) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // ----------------------
  // 🧱 UI
  // ----------------------
  return (
    <main className="min-h-screen p-8 text-white relative overflow-hidden">
      {/* Background blur effect, now using a more neutral/subtle gradient */}
      <div className="absolute inset-0  blur-3xl opacity-60 -z-10" />
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text drop-shadow-lg">About Page Management</h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center mt-20">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchData} className=" text-white">
            Retry Loading Data
          </Button>
        </div>
      )}

      {/* Data Editor */}
      {!loading && !error && aboutList.length > 0 && (
        <div className="flex flex-col gap-8">
          {aboutList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className=" backdrop-blur-md p-6 rounded-2xl border  shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex flex-col gap-3">
                <Input
                  value={item.name}
                  onChange={e => setAboutList(prev => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
                  placeholder="Name"
                  className=" text-white border-white/30 focus:border-white/60 placeholder-gray-300"
                />

                <Input
                  value={item.path}
                  onChange={e => setAboutList(prev => prev.map((x, i) => (i === idx ? { ...x, path: e.target.value } : x)))}
                  placeholder="Path"
                  className=" text-white border-white/30 focus:border-white/60 placeholder-gray-300"
                />

                <Textarea
                  value={item.description}
                  onChange={e => setAboutList(prev => prev.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))}
                  placeholder="Description"
                  rows={4}
                  className=" text-white border-white/30 focus:border-white/60 placeholder-gray-300"
                />

                <ImageUploadFieldSingle
                  label="About Image"
                  value={item.image || null}
                  onChange={url => setAboutList(prev => prev.map((x, i) => (i === idx ? { ...x, image: url || '' } : x)))}
                />
              </div>

              {/* Child Data */}
              {item.childData && (
                <div className="mt-4 border-t border-white/20 pt-4 space-y-3">
                  <h3 className="text-lg font-semibold mb-2 text-gray-200">Sub-sections</h3>
                  {item.childData.map((child, childIdx) => (
                    <div key={`${child.id}-${childIdx}`} className="p-3 rounded-xl  border border-white/20 backdrop-blur-md">
                      <Input
                        value={child.name}
                        onChange={e => {
                          setAboutList(prev =>
                            prev.map((aboutItem, aboutItemIdx) =>
                              aboutItemIdx === idx
                                ? {
                                    ...aboutItem,
                                    childData: aboutItem.childData?.map((c, cIdx) => (cIdx === childIdx ? { ...c, name: e.target.value } : c)),
                                  }
                                : aboutItem,
                            ),
                          );
                        }}
                        className=" text-white border-white/30 focus:border-white/60 placeholder-gray-300"
                      />
                      <Textarea
                        value={child.description}
                        onChange={e => {
                          setAboutList(prev =>
                            prev.map((aboutItem, aboutItemIdx) =>
                              aboutItemIdx === idx
                                ? {
                                    ...aboutItem,
                                    childData: aboutItem.childData?.map((c, cIdx) => (cIdx === childIdx ? { ...c, description: e.target.value } : c)),
                                  }
                                : aboutItem,
                            ),
                          );
                        }}
                        className="mt-2  text-white border-white/30 focus:border-white/60 placeholder-gray-300"
                        rows={2}
                      />
                      <ImageUploadFieldSingle
                        label="Sub-section Image"
                        value={child.image || null}
                        onChange={url =>
                          setAboutList(prev =>
                            prev.map((aboutItem, aboutItemIdx) =>
                              aboutItemIdx === idx
                                ? {
                                    ...aboutItem,
                                    childData: aboutItem.childData?.map((c, cIdx) => (cIdx === childIdx ? { ...c, image: url || '' } : c)),
                                  }
                                : aboutItem,
                            ),
                          )
                        }
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Global Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
            <Button disabled={loading} onClick={handleSaveAll} variant="outlineWater" size="sm">
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>

            <Button disabled={productionEnabled} onClick={handlePublish} variant="outlineWater" size="sm">
              {productionEnabled ? `Production Active (${formatTimer(timer)})` : 'Activate Production Mode'}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
