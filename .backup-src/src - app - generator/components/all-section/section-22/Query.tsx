import { defaultDataDescription, IDescriptionData, DescriptionProps, paddingClasses, alignClasses, sizeClasses } from './data';
import { cn } from '@/lib/utils';

const QuerySection22 = ({ data }: DescriptionProps) => {
  let descData = defaultDataDescription;

  if (data && typeof data === 'string') {
    descData = JSON.parse(data) as IDescriptionData;
  } else if (data) {
    descData = data as IDescriptionData;
  }

  return (
    <div
      className={cn(
        'w-full transition-all duration-300 ease-in-out',
        paddingClasses[descData.padding] || 'p-6',
        alignClasses[descData.textAlign] || 'text-left',
      )}
    >
      <div
        className={cn(
          'text-gray-200 leading-relaxed break-words',
          // Base Size
          sizeClasses[descData.textSize] || 'text-base',
          // Global Underline Override
          descData.isGlobalUnderline && 'underline decoration-blue-500/30 underline-offset-4',
          // Rich Text Styling Resets/Defaults for HTML Content
          '[&_b]:font-bold [&_b]:text-white',
          '[&_strong]:font-bold [&_strong]:text-white',
          '[&_i]:italic [&_i]:text-blue-200',
          '[&_em]:italic [&_em]:text-blue-200',
          '[&_u]:underline [&_u]:decoration-white/50 [&_u]:underline-offset-2',
          '[&_p]:mb-4 [&_p:last-child]:mb-0',
          // List Styles
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1',
          // Link Styles in Rich Text
          '[&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-400/50 [&_a:hover]:text-blue-300',
        )}
        dangerouslySetInnerHTML={{ __html: descData.content }}
      />
    </div>
  );
};

export default QuerySection22;
