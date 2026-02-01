import { iconMap } from '@/components/all-icons/all-icons-jsx';
import { defaultDataSection30, IDefaultDataSection30Props } from './data';

const QuerySection30 = ({ data }: IDefaultDataSection30Props) => {
  // 1. Safe Parse
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing QuerySection30 data', error);
    }
  }

  // 2. Merge Defaults
  const { iconName } = {
    ...defaultDataSection30,
    ...(typeof parsedData === 'object' ? parsedData : {}),
  };

  // 3. Get Component
  const IconComponent = iconName ? iconMap[iconName] : null;

  if (!IconComponent) {
    return <div className="hidden" />; // Render nothing if invalid
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Dynamic Sizing handled by parent container via CSS or props if needed */}
      <IconComponent className="w-full h-full object-contain text-inherit" />
    </div>
  );
};

export default QuerySection30;
