/*
|-----------------------------------------
| setting up NextButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const NextButton = () => {
  const onNext = () => {};
  return (
    <Button onClick={onNext} className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
      Next
      <ArrowRight size={16} />
    </Button>
  );
};
export default NextButton;
