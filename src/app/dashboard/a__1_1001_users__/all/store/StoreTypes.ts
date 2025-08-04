// import { IUsers_1_000___ } from '@/app/api/v1/users_1_000___/filename7Model';
import { IUsers_1_000___ } from '../api/v1/Model';

export interface Users_1_000___Store {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  users_2_000___: IUsers_1_000___[];
  selectedUsers_1_000___: IUsers_1_000___ | null;
  newUsers_1_000___: Partial<IUsers_1_000___>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewUsers_1_000___: React.Dispatch<React.SetStateAction<Partial<IUsers_1_000___>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IUsers_1_000___[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setUsers_1_000___: (users_1_000___: IUsers_1_000___[]) => void;
  setSelectedUsers_1_000___: (Users_1_000___: IUsers_1_000___ | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Users_1_000___: boolean) => void;
  toggleBulkUpdateModal: (Users_1_000___: boolean) => void;
  toggleBulkDynamicUpdateModal: (Users_1_000___: boolean) => void;
  toggleBulkDeleteModal: (Users_1_000___: boolean) => void;
  setBulkData: (bulkData: IUsers_1_000___[]) => void;
}
