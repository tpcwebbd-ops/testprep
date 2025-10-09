/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, August, 2025
|-----------------------------------------
*/

import MainFooter from '@/components/common/MainFooter';
import HeroSection from '../../.idea/backup for 9 October/components/Hero';
import TestPrepHero from '../../.idea/backup for 9 October/components/Hero2';
import TestPrepClasses from '../../.idea/backup for 9 October/components/OurClasses';
import StudyAbroad from '../../.idea/backup for 9 October/components/StudyAbroad';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TestPrepHero />
      <TestPrepClasses />
      <StudyAbroad />
      <MainFooter />
    </>
  );
}
