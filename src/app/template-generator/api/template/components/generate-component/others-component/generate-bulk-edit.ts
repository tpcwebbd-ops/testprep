export const generateBulkEditComponentFile = (inputJsonFile: string): string => {
  const { schema, namingConvention } = JSON.parse(inputJsonFile);

  // Names
  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = namingConvention.users_2_000___;
  const singularPascalCase = namingConvention.User_3_000___;

  const isUsedGenerateFolder = namingConvention.use_generate_folder;
  const reduxPath = isUsedGenerateFolder ? `../redux/rtk-api` : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;

  // Determine display key
  const schemaKeys = Object.keys(schema || {});
  const displayKey =
    schemaKeys.find(key => key.toLowerCase() === 'name') ||
    schemaKeys.find(key => key.toLowerCase() === 'title') ||
    schemaKeys.find(key => schema[key] === 'STRING') ||
    '_id';

  // Build dynamic field blocks (SELECT / RADIOBUTTON)
  const dynamicSelectBlocks = Object.entries(schema || {})
    .map(([key, value]) => {
      if (typeof value !== 'string') return ''; // skip nested/non-string
      const parts = value.split('#');
      const base = parts[0]?.toUpperCase();
      if (!['SELECT', 'RADIOBUTTON'].includes(base)) return '';

      // Option B: if no options provided -> default placeholders
      const rawOptions = parts[1] || 'Option 1, Option 2, Option 3';
      const options = rawOptions
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);

      const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      return `
                <div className="flex items-center gap-3">
                  <Label className="min-w-[120px] text-white">${label}</Label>
                  <Select
                    onValueChange={v => handleFieldChange(item._id as string, '${key}', v)}
                    defaultValue={String(item['${key}'] ?? '')}
                  >
                    <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                      ${options.map(opt => `<SelectItem value="${opt}">${opt}</SelectItem>`).join('')}
                    </SelectContent>
                  </Select>
                </div>`;
    })
    .filter(Boolean)
    .join('\n');

  return `'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { use${pluralPascalCase}Store } from '../store/store';
import { useBulkUpdate${pluralPascalCase}Mutation } from '${reduxPath}';
import { handleSuccess, handleError } from './utils';

const BulkEditNextComponents: React.FC = () => {
  const { isBulkEditModalOpen, toggleBulkEditModal, bulkData, setBulkData } = use${pluralPascalCase}Store();

  const [bulkUpdate${pluralPascalCase}, { isLoading }] = useBulkUpdate${pluralPascalCase}Mutation();

  // Use current state directly (matches expected output)
  const handleFieldChange = (id: string, key: string, value: string) => {
    const updatedData = bulkData.map(item => (item._id === id ? { ...item, [key]: value } : item));
    setBulkData(updatedData);
  };

  const handleBulkEdit = async () => {
    if (!bulkData.length) return;
    try {
      const formatted = bulkData.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      }));
      await bulkUpdate${pluralPascalCase}(formatted).unwrap();

      toggleBulkEditModal(false);
      setBulkData([]);
      handleSuccess('Bulk Update Successful');
    } catch (error) {
      console.error('Bulk Update Failed:', error);
      handleError('Failed to update selected items.');
    }
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={toggleBulkEditModal}>
      <DialogContent className="sm:max-w-xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text bg-gradient-to-r from-white to-blue-200 text-white">Bulk Edit ${pluralPascalCase}</DialogTitle>
        </DialogHeader>

        {bulkData.length > 0 && (
          <p className="text-white/80">
            Editing <strong>{bulkData.length}</strong> selected ${pluralLowerCase}.
          </p>
        )}

        <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
          <div className="flex flex-col gap-3">
            {bulkData.map((item, idx) => (
              <div key={item._id || idx} className="p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg flex flex-col gap-3">
                <span className="font-medium text-white">
                  {idx + 1}. {String(item['${displayKey}'] || '')}
                </span>

${dynamicSelectBlocks}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={() => toggleBulkEditModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleBulkEdit} variant="outlineWater" size="sm">
            {isLoading ? 'Updating…' : 'Update Selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditNextComponents;`;
};
