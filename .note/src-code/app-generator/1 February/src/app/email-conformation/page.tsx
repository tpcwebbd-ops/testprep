/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App Generator, November, 2025
|-----------------------------------------
*/

import { Suspense } from 'react';
import EmailConfirmationPage from './email-component';
import LoadingServerComponent from '@/components/common/LoadingServerSkeleton';

const Page = () => {
  return (
    <Suspense fallback={<LoadingServerComponent />}>
      <EmailConfirmationPage />
    </Suspense>
  );
};
export default Page;
