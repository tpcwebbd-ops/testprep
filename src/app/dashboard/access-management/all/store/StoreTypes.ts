// import { IUsers_access } from '@/app/api/v1/users_1_000___/filename7Model';
import { IUsers_access } from '../api/v1/model';

export interface Users_1_000___Store {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  users_2_000___: IUsers_access[];
  selectedUsers_1_000___: IUsers_access | null;
  newUsers_1_000___: Partial<IUsers_access>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewUsers_1_000___: React.Dispatch<React.SetStateAction<Partial<IUsers_access>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IUsers_access[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setUsers_1_000___: (users_1_000___: IUsers_access[]) => void;
  setSelectedUsers_1_000___: (Users_1_000___: IUsers_access | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Users_1_000___: boolean) => void;
  toggleBulkUpdateModal: (Users_1_000___: boolean) => void;
  toggleBulkDynamicUpdateModal: (Users_1_000___: boolean) => void;
  toggleBulkDeleteModal: (Users_1_000___: boolean) => void;
  setBulkData: (bulkData: IUsers_access[]) => void;
}
