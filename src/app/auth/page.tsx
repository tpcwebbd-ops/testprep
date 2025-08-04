/*
|-----------------------------------------
| setting up \Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2025
|-----------------------------------------
*/

import AuthManagement from './components/AuthManagement';

const Page = () => {
  return (
    <main className="bg-slate-800 text-white flex items-center justify-center w-full min-h-screen flex-col p-12">
      <AuthManagement />
    </main>
  );
};
export default Page;
