// import { IUsers_access } from '@/app/api/v1/UsersAccess/filename7Model';
import { IUsers_access } from '../api/v1/model';

export interface UsersAccessStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  usersAccess: IUsers_access[];
  selectedUsersAccess: IUsers_access | null;
  newUsersAccess: Partial<IUsers_access>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewUsersAccess: React.Dispatch<React.SetStateAction<Partial<IUsers_access>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IUsers_access[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setUsersAccess: (UsersAccess: IUsers_access[]) => void;
  setSelectedUsersAccess: (UsersAccess: IUsers_access | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (UsersAccess: boolean) => void;
  toggleBulkUpdateModal: (UsersAccess: boolean) => void;
  toggleBulkDynamicUpdateModal: (UsersAccess: boolean) => void;
  toggleBulkDeleteModal: (UsersAccess: boolean) => void;
  setBulkData: (bulkData: IUsers_access[]) => void;
}
