/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: template-generator, July, 2025
|-----------------------------------------
*/

import JsonEditor from './components/JsonEditor';

const Page = () => {
  return (
    <main className="md:min-w-7xl mx-auto max-w-7xl">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 -z-10" />
      <JsonEditor />
    </main>
  );
};
export default Page;
