export const generateDeleteComponentFile = (inputJsonFile: string): string => {
  const config = JSON.parse(inputJsonFile);
  const { schema, namingConvention, isPersonal } = config;

  const pluralPascalCase = namingConvention.Users_1_000___; // e.g., "Posts"
  const singularPascalCase = namingConvention.User_3_000___; // e.g., "Post"
  const pluralLowerCase = namingConvention.users_2_000___; // e.g., "posts"
  const interfaceName = `I${pluralPascalCase}`;

  // 1. Determine Component Name
  const componentName = isPersonal ? `PersonalDeleteNextComponents` : `DeleteNextComponents`;

  // 2. Determine Redux Hook & Path
  // Note: Standard uses Plural in input template (useDeletePostsMutation), 
  // but Personal expected output uses Singular (useDeletePersonalPostMutation).
  const mutationHookName = isPersonal 
    ? `useDeletePersonal${singularPascalCase}Mutation` 
    : `useDelete${pluralPascalCase}Mutation`;

  const isUsedGenerateFolder = namingConvention.use_generate_folder;
  const reduxPath = isPersonal
    ? `@/redux/features/${pluralLowerCase}/personal${pluralPascalCase}Slice`
    : (isUsedGenerateFolder ? `../redux/rtk-api` : `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`);

  // 3. Determine Payload Arguments
  const deletePayload = isPersonal
    ? `{ id: selected${pluralPascalCase}._id, 'author-email': selected${pluralPascalCase}['author-email'] }`
    : `{ id: selected${pluralPascalCase}._id }`;

  // 4. Schema Helper for Display Key
  const schemaKeys = Object.keys(schema || {});
  const displayKey =
    schemaKeys.find(k => k.toLowerCase() === 'name') ||
    schemaKeys.find(k => k.toLowerCase() === 'title') ||
    schemaKeys.find(k => schema[k] === 'STRING') ||
    '_id';

  return `'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ${interfaceName}, default${pluralPascalCase} } from '../store/data/data';
import { use${pluralPascalCase}Store } from '../store/store';
import { ${mutationHookName} } from '${reduxPath}';
import { handleSuccess, handleError } from './utils';

const ${componentName}: React.FC = () => {
  const {
    toggleDeleteModal,
    isDeleteModalOpen,
    selected${pluralPascalCase},
    setSelected${pluralPascalCase},
  } = use${pluralPascalCase}Store();

  const [delete${singularPascalCase}, { isLoading }] =
    ${mutationHookName}();

  const handleDelete = async () => {
    if (!selected${pluralPascalCase}) return;

    try {
      await delete${singularPascalCase}(${deletePayload}).unwrap();
      handleSuccess('Delete Successful');
      toggleDeleteModal(false);
      setSelected${pluralPascalCase}(default${pluralPascalCase} as ${interfaceName});
    } catch (error) {
      console.error('Failed to delete ${singularPascalCase}:', error);
      handleError('Failed to delete item. Please try again.');
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelected${pluralPascalCase}(default${pluralPascalCase} as ${interfaceName});
  };

  const displayName = selected${pluralPascalCase}?.['${displayKey}'] || 'this item';

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-red-200">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        <p className="text-white/80 py-3">
          Are you sure you want to delete:&nbsp;
          <strong className="text-white">{displayName}</strong> ?
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outlineWater" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="outlineFire"
            size="sm"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ${componentName};`;
};