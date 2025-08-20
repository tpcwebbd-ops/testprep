// import { ICourses } from '@/app/api/v1/Courses/filename7Model';
import { SpokenCourse } from '../api/v1/model';

export interface CoursesStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  courses: SpokenCourse[];
  selectedCourses: SpokenCourse | null;
  newCourses: Partial<SpokenCourse>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewCourses: React.Dispatch<React.SetStateAction<Partial<SpokenCourse>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: SpokenCourse[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setCourses: (Courses: SpokenCourse[]) => void;
  setSelectedCourses: (Courses: SpokenCourse | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Courses: boolean) => void;
  toggleBulkUpdateModal: (Courses: boolean) => void;
  toggleBulkDynamicUpdateModal: (Courses: boolean) => void;
  toggleBulkDeleteModal: (Courses: boolean) => void;
  setBulkData: (bulkData: SpokenCourse[]) => void;
}
