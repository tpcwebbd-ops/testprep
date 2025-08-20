// import { ICourses } from '@/app/api/v1/Courses/filename7Model';
import { IELTScourse } from '../api/v1/model';

export interface CoursesStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  courses: IELTScourse[];
  selectedCourses: IELTScourse | null;
  newCourses: Partial<IELTScourse>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewCourses: React.Dispatch<React.SetStateAction<Partial<IELTScourse>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IELTScourse[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setCourses: (Courses: IELTScourse[]) => void;
  setSelectedCourses: (Courses: IELTScourse | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Courses: boolean) => void;
  toggleBulkUpdateModal: (Courses: boolean) => void;
  toggleBulkDynamicUpdateModal: (Courses: boolean) => void;
  toggleBulkDeleteModal: (Courses: boolean) => void;
  setBulkData: (bulkData: IELTScourse[]) => void;
}
