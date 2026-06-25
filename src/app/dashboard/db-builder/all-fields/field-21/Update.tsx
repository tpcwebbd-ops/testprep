/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import AutocompleteField from '@/components/dashboard-ui/AutocompleteField';

import { field21Props, Ifield21Data } from './data';

interface UpdateProps extends field21Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield21Data = {
  fieldName: 'Autocomplete Field',
  fieldData: '',
  fieldPlaceHolder: 'Search or enter value',
  fieldType: 'AUTOCOMPLETE',
};

const resolveData = (data?: Ifield21Data | string): Ifield21Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield21Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Update = ({ data, value = '' }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <AutocompleteField
      id={fieldId}
      value={value}
    />
  );
};
export default Update;


