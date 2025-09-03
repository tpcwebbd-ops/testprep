/*
|-----------------------------------------
| setting up PreviousButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PreviousButton = () => {
  const onPrevious = () => {
    console.log('Previous button clicked');
  };
  return (
    <Button
      disabled
      onClick={onPrevious}
      className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
    >
      <ArrowLeft size={16} />
      Previous
    </Button>
  );
};
export default PreviousButton;
