/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, August, 2025
|-----------------------------------------
*/

import MainFooter from '@/components/common/MainFooter';
import HeroSection from '@/components/home-components/Hero';
import TestPrepHero from '@/components/home-components/Hero2';
// import TestPrepClasses from '@/components/home-components/OurClasses';
import StudyAbroad from '@/components/home-components/StudyAbroad';

export default function Home() {
  return (
    <>
      <div className="mt-[-65px]" />
      <HeroSection />
      <TestPrepHero />
      {/* <TestPrepClasses /> */}
      <StudyAbroad />
      <MainFooter />
    </>
  );
}
