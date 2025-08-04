// import { IGAuthUsers } from '@/app/api/v1/GAuthUsers/filename7Model';
import { IGAuthUsers } from '../api/v1/Model';

export interface GAuthUsersStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  gAuthUsers: IGAuthUsers[];
  selectedGAuthUsers: IGAuthUsers | null;
  newGAuthUsers: Partial<IGAuthUsers>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewGAuthUsers: React.Dispatch<React.SetStateAction<Partial<IGAuthUsers>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IGAuthUsers[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setGAuthUsers: (GAuthUsers: IGAuthUsers[]) => void;
  setSelectedGAuthUsers: (GAuthUsers: IGAuthUsers | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (GAuthUsers: boolean) => void;
  toggleBulkUpdateModal: (GAuthUsers: boolean) => void;
  toggleBulkDynamicUpdateModal: (GAuthUsers: boolean) => void;
  toggleBulkDeleteModal: (GAuthUsers: boolean) => void;
  setBulkData: (bulkData: IGAuthUsers[]) => void;
}
