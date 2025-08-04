/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, August, 2025
|-----------------------------------------
*/

import FooterSectionComponents from './components/Footer';
import HeroSection from './components/Hero';
import TestPrepHero from './components/Hero2';
import TestPrepClasses from './components/OurClasses';
import StudyAbroad from './components/StudyAbroad';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TestPrepHero />
      <TestPrepClasses />
      <StudyAbroad />
      <FooterSectionComponents />
    </>
  );
}
