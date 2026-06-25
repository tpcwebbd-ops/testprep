'use client';

import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import Image from 'next/image';
import * as XLSX from 'xlsx';
import {
  DownloadIcon,
  EyeIcon,
  Filter,
  ImageIcon,
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontalIcon,
  PencilIcon,
  BarChart3,
  PieChart,
  Plus,
  PlusIcon,
  RefreshCcw,
  Search,
  Settings2,
  TrashIcon,
  Activity,
  X,
  TrendingUp,
  XIcon,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { v4 as uuidv4 } from 'uuid';
import ErrorMessageComponent from '@/components/common/Error';
import LoadingComponent from '@/components/common/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AutocompleteField from '@/components/dashboard-ui/AutocompleteField';
import ColorPickerField from '@/components/dashboard-ui/ColorPickerField';
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField';
import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField';
import ImageUploadManager from '@/components/dashboard-ui/imageBB/ImageUploadManager';
import ImageUploadManagerSingle from '@/components/dashboard-ui/imageBB/ImageUploadManagerSingle';
import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';
import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode';
import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword';
import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';
import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField';
import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField';
import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField';
import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat';
import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger';
import PhoneInputField from '@/components/dashboard-ui/PhoneInputField';
import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';
import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription';
import TimeField from '@/components/dashboard-ui/TimeField';
import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField';
import UrlInputField from '@/components/dashboard-ui/UrlInputField';
import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';
import { CheckboxField } from '@/components/dashboard-ui/CheckboxField';
import { DateField } from '@/components/dashboard-ui/DateField';
import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField';
import { SelectField } from '@/components/dashboard-ui/SelectField';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  PieLabelRenderProps,
} from 'recharts';
import {
  useAddNewsMutation,
  useBulkDeleteNewsMutation,
  useBulkUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetNewsQuery,
  useGetNewsSummaryQuery,
  useUpdateNewsMutation,
} from '@/redux/features/news/newsSlice';
import { FaTrash } from 'react-icons/fa';

const StringArrayField: React.FC<StringArrayFieldProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editList, setEditList] = useState<StringArrayData[]>(value);

  React.useEffect(() => {
    setEditList(value);
  }, [value]);

  const handleNameChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Name: newTitle } : item)));
  };

  const handleClassChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newClass = e.target.value;
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Class: newClass } : item)));
  };

  const handleRollChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const newRoll = parseInt(e.target.value, 10);
    setEditList(prev => prev.map(item => (item._id === id ? { ...item, Roll: isNaN(newRoll) ? 0 : newRoll } : item)));
  };

  const handleAddListItem = () => {
    const nextId = uuidv4();
    const newItem: StringArrayData = {
      _id: nextId.toString(),
      Name: '',
      Class: '',
      Roll: 0,
    };
    setEditList([...editList, newItem]);
  };

  const handleDeleteListItem = (id: string) => {
    setEditList(prev => prev.filter(item => item._id !== id));
  };

  const handleSubmit = () => {
    onChange(editList);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditList(value);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
      <h2 className="text-white text-lg md:text-xl mb-3 font-semibold text-center drop-shadow-sm">Students List</h2>

      {/* ✅ List View */}
      {!isEditing && (
        <div className="w-full space-y-3">
          {value?.length === 0 ? (
            <p className="text-white/60 text-sm text-center">Nothing found.</p>
          ) : (
            value?.map(item => (
              <div key={item._id} className="flex justify-between items-center p-3 rounded-lg bg-white/10 backdrop-blur-lg border border-white/10 shadow-md">
                <span className="text-white text-sm">{item.Name || 'Untitled'}</span>
                <span className="text-white/70 text-sm">
                  Class: {item.Class || '—'} • Roll: {item.Roll || '—'}
                </span>
              </div>
            ))
          )}

          <div className="w-full flex items-center justify-center">
            <Button variant="outlineGarden" onClick={() => setIsEditing(true)} size="sm">
              Update
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Edit Mode */}
      {isEditing && (
        <div className="flex flex-col gap-3 w-full mt-2">
          {editList?.length === 0 && <p className="text-white/60 text-sm text-center">No students yet — add some below.</p>}

          {editList?.map(item => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white/10 border border-white/20 backdrop-blur-xl rounded-lg shadow-md"
            >
              {/* 🏷 Name Input */}
              <Input type="text" value={item.Name} onChange={e => handleNameChange(item._id!, e)} placeholder="Student Name" />

              {/* 🏫 Class Input */}
              <Input type="text" value={item.Class} onChange={e => handleClassChange(item._id!, e)} placeholder="Class" />

              {/* 🎯 Roll Input */}
              <Input type="number" value={item.Roll} onChange={e => handleRollChange(item._id!, e)} placeholder="Roll" />

              {/* 🗑 Trash Icon Button */}
              <FaTrash
                size={14}
                onClick={() => handleDeleteListItem(item._id!)}
                className="cursor-pointer text-rose-400 hover:text-rose-300 duration-300 min-w-[12px]"
              />
            </div>
          ))}

          {/* ✅ Action Buttons */}
          <div className="flex gap-2 mt-2">
            <Button variant="outlineWater" onClick={handleAddListItem} size="sm">
              + Add
            </Button>
            <Button variant="outlineWater" onClick={handleSubmit} size="sm">
              Submit
            </Button>
            <Button variant="outlineFire" onClick={handleCancel} size="sm" className="text-white">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface StringArrayData {
  _id?: string;
  Name: string;
  Class: string;
  Roll: number;
}
interface StringArrayFieldProps {
  value: StringArrayData[];
  onChange: (newValue: StringArrayData[]) => void;
}
type ImageValue = { url: string; name: string };
type StudentValue = { Name: string; Class: string; Roll: number; _id?: string };
type Primitive = string | number | boolean | null | undefined;
type Arrayish = Array<string | number | boolean>;
type JSONLike = string | number | boolean | null | undefined | Record<string, unknown> | StudentValue[];
interface ApiErrorDataPayload {
  data: null;
  message: string;
  status: number;
}

interface ApiErrorResponse {
  status: number;
  data: ApiErrorDataPayload;
}

type FilterPayload = { type: 'month'; value: { start: string; end: string } } | { type: 'range'; value: { start: string; end: string } };
interface NewsSummaryData {
  overall: {
    totalRecords: number;
    recordsLast24Hours: number;
    recordsLastMonth?: number;
  };
  monthlyTable?: Array<Record<string, string | number>>;
  tableSummary?: {
    totalMonths: number;
    [key: string]: number;
  };
  pagination?: {
    currentPage: number;
    limit: number;
    totalMonths: number;
    totalPages: number;
  };
}
type NewsItem = {
  _id?: string;
  title: string;
  email: string;
  'author-email': string;
  password: string;
  passcode: string;
  area: string;
  'sub-area': string[];
  'products-images': ImageValue[];
  'personal-image': ImageValue;
  description: string;
  age: number;
  amount: number;
  isActive: boolean;
  'start-date': string;
  'start-time': string;
  'schedule-date': { from: Date; to?: Date };
  'schedule-time': { start: string; end: string };
  'favorite-color': string;
  number: string;
  profile: string;
  test: string;
  info: string;
  shift: string;
  policy: boolean;
  hobbies: string[];
  ideas: string[];
  students: StudentValue[];
  complexValue: {
    id: string;
    title: string;
    parent: {
      id: string;
      title: string;
      child: { id: string; title: string; child: string; note: string };
      note: string;
    };
    note: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

const emptyNews = (): NewsItem => ({
  title: '',
  email: '',
  'author-email': '',
  password: '',
  passcode: '',
  area: '',
  'sub-area': [],
  'products-images': [],
  'personal-image': { name: '', url: '' },
  description: '',
  age: 0,
  amount: 0,
  isActive: false,
  'start-date': new Date().toISOString().slice(0, 10),
  'start-time': '',
  'schedule-date': { from: new Date(), to: new Date() },
  'schedule-time': { start: '', end: '' },
  'favorite-color': '',
  number: '',
  profile: '',
  test: '',
  info: '',
  shift: '',
  policy: false,
  hobbies: [],
  ideas: [],
  students: [],
  complexValue: {
    id: '',
    title: '',
    parent: {
      id: '',
      title: '',
      child: { id: '', title: '', child: '', note: '' },
      note: '',
    },
    note: '',
  },
});

const areas = ['Bangladesh', 'India', 'Pakistan', 'Canada'];
const ideas = ['O 1', 'O 2', 'O 3', 'O 4'];
const areaOptions = areas.map(area => ({ label: area, value: area }));
const ideasOptions = ideas.map(idea => ({ label: idea, value: idea }));
const shiftOptions = [
  { label: 'OP 1', value: 'OP 1' },
  { label: 'OP 2', value: 'OP 2' },
  { label: 'OP 3', value: 'OP 3' },
  { label: 'OP 4', value: 'OP 4' },
];
const pageLimits = [10, 20, 30, 50, 100];
const summaryColors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#06b6d4'];
type DisplayableNewsKeys = 'title' | 'email' | 'age' | 'amount' | 'isActive' | 'policy' | 'createdAt';
type NewsColumnVisibilityState = Record<DisplayableNewsKeys, boolean>;
const tableHeaders: { key: DisplayableNewsKeys; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Email' },
  { key: 'age', label: 'Age' },
  { key: 'amount', label: 'Amount' },
  { key: 'isActive', label: 'Is Active' },
  { key: 'policy', label: 'Policy' },
  { key: 'createdAt', label: 'Created At' },
];

const formatDate = (value?: unknown) => (value ? new Date(String(value)).toLocaleDateString() : '');

const downloadXlsx = (data: Record<string, unknown>[], fileName: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, fileName);
};

const sanitizeNewsPayload = (payload: NewsItem) => {
  const updateData: Partial<NewsItem> = { ...payload };
  delete updateData._id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  if (updateData.students) {
    updateData.students = updateData.students.map(student => {
      const nextStudent = { ...student };
      delete nextStudent._id;
      return nextStudent;
    });
  }

  return updateData;
};

const handleSuccess = (message: string) => {
  toast.success(message, {
    toastId: (Math.random() * 1000).toFixed(0),
    position: 'top-center',
  });
};

const handleError = (str: string) => {
  toast.error(str, {
    toastId: (Math.random() * 1000).toFixed(0),
    position: 'top-center',
  });
};

const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as ApiErrorResponse).status === 'number' &&
    'data' in error &&
    typeof (error as ApiErrorResponse).data === 'object' &&
    (error as ApiErrorResponse).data !== null &&
    'message' in (error as ApiErrorResponse).data &&
    typeof (error as ApiErrorResponse).data.message === 'string' &&
    'status' in (error as ApiErrorResponse).data &&
    typeof (error as ApiErrorResponse).data.status === 'number'
  );
};

const formatDuplicateKeyError = (errorString: string) => {
  const jsonMatch = errorString.match(/{.*}/);

  if (!jsonMatch || !jsonMatch[0]) {
    console.warn('Could not find JSON part in error string:', errorString);
    return errorString || 'Please check your input.';
  }

  const jsonString = jsonMatch[0];
  let parsedData;

  try {
    parsedData = JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON from error string:', jsonString, error);
    return 'Error processing duplicate key information. The data might be malformed.';
  }

  const keys = Object.keys(parsedData);

  if (keys.length === 0) {
    console.warn('No key found in parsed duplicate error data:', parsedData);
    return 'A duplicate entry error occurred, but the specific field is unknown.';
  }

  const keyName = keys[0];
  const keyValue = parsedData[keyName];

  return `Please change ${keyName} "${String(keyValue)}" already exist.`;
};

interface NewsDynamicDataSelectProps {
  newItemTags: string[];
  setNewItemTags: (payload: string[]) => void;
  label?: string;
  placeholder?: string;
}

interface MultiSelectResponseData {
  id: number | string;
  name: string;
  [key: string]: unknown;
}

interface NewsMultiSelectProps {
  label?: string;
  placeholder?: string;
  defaultSelected?: string[];
  apiUrl?: string;
  onSelectionChange?: (selectedItems: string[]) => void;
  readOnly?: boolean;
}

const NewsMultiSelect = ({
  label = 'Select Data',
  placeholder = 'Select an option',
  defaultSelected = [],
  apiUrl = 'https://jsonplaceholder.typicode.com/users',
  onSelectionChange,
  readOnly = false,
}: NewsMultiSelectProps) => {
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>(defaultSelected);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [selectError, setSelectError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingOptions(true);
      setSelectError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const json = await response.json();
        const names = (json.data || json).map((item: MultiSelectResponseData) => item.name);
        setAvailableData(names);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setSelectError(errorMessage);
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    if (JSON.stringify(defaultSelected) !== JSON.stringify(selectedItems)) {
      setSelectedItems(defaultSelected);
    }
  }, [defaultSelected, selectedItems]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  const handleSelect = (value: string) => {
    if (!readOnly && !selectedItems.includes(value)) {
      setSelectedItems(prev => [...prev, value]);
    }
  };

  const handleRemove = (itemToRemove: string) => {
    if (!readOnly) {
      setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
    }
  };

  const availableOptions = availableData.filter(item => !selectedItems.includes(item));

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="multiselect" className="text-right">
          {label}
        </Label>
        <div className="col-span-3">
          <Select onValueChange={handleSelect} disabled={readOnly || isLoadingOptions || availableOptions.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoadingOptions ? (
                  <SelectLabel className="p-2 text-center text-gray-500">Loading...</SelectLabel>
                ) : selectError ? (
                  <SelectLabel className="p-2 text-center text-red-500">{selectError}</SelectLabel>
                ) : availableOptions.length === 0 ? (
                  <SelectLabel className="p-2 text-center text-gray-500">No options left</SelectLabel>
                ) : (
                  availableOptions.map((item, index) => (
                    <SelectItem key={`${item}-${index}`} className="cursor-pointer" value={item}>
                      {item}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="grid grid-cols-4 items-start gap-4">
          <div className="col-start-2 col-span-3 flex flex-wrap gap-2">
            {selectedItems.map((item, index) => (
              <Badge key={`selected-${item}-${index}`} variant="secondary" className="flex items-center gap-1">
                {item}
                {!readOnly && (
                  <button type="button" className="p-0.5 rounded-full hover:bg-gray-300" onClick={() => handleRemove(item)} aria-label={`Remove ${item}`}>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NewsDataSelect = ({ newItemTags, setNewItemTags, label = 'Select Tags', placeholder = 'Choose tags for your item' }: NewsDynamicDataSelectProps) => {
  const [currentSelection, setCurrentSelection] = useState<string[]>(newItemTags);

  useEffect(() => {
    if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newItemTags);
    }
  }, [newItemTags, currentSelection]);

  const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
    if (JSON.stringify(newSelectionFromMultiSelect) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newSelectionFromMultiSelect);
      setNewItemTags(newSelectionFromMultiSelect);
    } else if (newSelectionFromMultiSelect !== currentSelection) {
      setCurrentSelection(newSelectionFromMultiSelect);
    }
  };

  return (
    <div className="w-full">
      <form id="data-select-form" className="space-y-4">
        <NewsMultiSelect
          label={label}
          placeholder={placeholder || 'Select options'}
          defaultSelected={currentSelection}
          onSelectionChange={handleSelectionChange}
        />
      </form>
    </div>
  );
};

const NewsDynamicDataSelect = ({ newItemTags, setNewItemTags, label, placeholder }: NewsDynamicDataSelectProps) => {
  const [currentSelection, setCurrentSelection] = useState<string[]>(newItemTags);

  useEffect(() => {
    if (JSON.stringify(newItemTags) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newItemTags);
    }
  }, [newItemTags, currentSelection]);

  const handleSelectionChange = (newSelectionFromMultiSelect: string[]) => {
    if (JSON.stringify(newSelectionFromMultiSelect) !== JSON.stringify(currentSelection)) {
      setCurrentSelection(newSelectionFromMultiSelect);
      setNewItemTags(newSelectionFromMultiSelect);
    }
  };

  return (
    <div className="w-full">
      <form id="dynamic-data-select-form" className="space-y-4">
        <NewsMultiSelect
          label={label}
          placeholder={placeholder || 'Select options...'}
          defaultSelected={currentSelection}
          onSelectionChange={handleSelectionChange}
        />
      </form>
    </div>
  );
};

interface NewsPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const NewsPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }: NewsPaginationProps) => {
  if (totalItems <= itemsPerPage) return null;

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > pageCount) {
      endPage = pageCount;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  const renderPageButton = (pageNumber: number, isCurrent: boolean) => (
    <button
      key={`page-${pageNumber}`}
      onClick={() => onPageChange(pageNumber)}
      disabled={isCurrent}
      className={`
                flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground cursor-default'
                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
            `}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {pageNumber}
    </button>
  );

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < pageCount - 1;

  return (
    <div className="flex items-center justify-center w-full py-4">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {pageNumbers[0] > 1 && renderPageButton(1, false)}

        {showStartEllipsis && <span className="flex items-center justify-center h-9 w-9 text-muted-foreground">...</span>}

        {pageNumbers.map(pageNumber => renderPageButton(pageNumber, currentPage === pageNumber))}

        {showEndEllipsis && <span className="flex items-center justify-center h-9 w-9 text-muted-foreground">...</span>}

        {pageNumbers[pageNumbers.length - 1] < pageCount && renderPageButton(pageCount, false)}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

interface NewsSearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceTime?: number;
}

const NewsSearchBox = ({ onSearch, placeholder = 'Search...', autoFocus = false, debounceTime = 500 }: NewsSearchBoxProps) => {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsTyping(true);
    debounceTimerRef.current = setTimeout(() => {
      onSearch(query);
      setIsTyping(false);
    }, debounceTime);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceTime, onSearch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch(query);
      setIsTyping(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full mb-4">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {query.length > 0 && (
          <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3" aria-label="Clear search">
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {isTyping && query.length > 0 && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-3">
            <div className="w-4 h-4 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const NewsPage = () => {
  const session = useSession();
  const authorEmail = session?.data?.user?.email || '---';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryViewMode, setSummaryViewMode] = useState<'table' | 'bar' | 'pie'>('table');
  const summaryLimit = 10;
  const [q, setQ] = useState('');
  const [filterActiveTab, setFilterActiveTab] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>();
  const [draft, setDraft] = useState<NewsItem>(emptyNews);
  const [selected, setSelected] = useState<NewsItem[]>([]);
  const [rowActionOpen, setRowActionOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: DisplayableNewsKeys; direction: 'asc' | 'desc' } | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<NewsColumnVisibilityState>(() => {
    const initialState = {} as NewsColumnVisibilityState;
    let counter = 0;
    for (const header of tableHeaders) {
      initialState[header.key] = counter <= 3;
      counter++;
    }
    return initialState;
  });
  const [viewing, setViewing] = useState<NewsItem | null>(null);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState<NewsItem | null>(null);
  const [personalEditing, setPersonalEditing] = useState<NewsItem | null>(null);
  const [imageEditing, setImageEditing] = useState<NewsItem | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectImg, setSelectImg] = useState('');
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const [dataSelectTags, setDataSelectTags] = useState<string[]>([]);
  const [selectedExportColumns, setSelectedExportColumns] = useState<Record<string, boolean>>({});
  const [openDialog, setOpenDialog] = useState<
    | 'add'
    | 'personal-add'
    | 'filter'
    | 'summary'
    | 'export'
    | 'bulk-edit'
    | 'bulk-update'
    | 'dynamic-update'
    | 'data-select'
    | 'bulk-delete'
    | 'personal-bulk-delete'
    | null
  >(null);

  const { data, isLoading, isError, error, refetch, status } = useGetNewsQuery(
    { page, limit, q },
    {
      selectFromResult: ({ data, isLoading, isError, error, status }) => ({
        data,
        isLoading,
        isError,
        error,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status,
      }),
    },
  );
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    isFetching: isSummaryFetching,
  } = useGetNewsSummaryQuery({ page: summaryPage, limit: summaryLimit }, { skip: openDialog !== 'summary' });

  const [addNews, { isLoading: isAdding }] = useAddNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();
  const [bulkUpdateNews] = useBulkUpdateNewsMutation();
  const [bulkDeleteNews, { isLoading: isBulkDeleting }] = useBulkDeleteNewsMutation();

  const rows: NewsItem[] = useMemo(() => data?.data?.news || [], [data]);
  const total = data?.data?.total || 0;
  const activeFilter = q.startsWith('createdAt:range:') ? q.replace('createdAt:range:', '').replace('_', ' to ') : '';
  const visibleHeaders = useMemo(() => tableHeaders.filter(header => columnVisibility[header.key]), [columnVisibility]);
  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);
  const newsSummaryData: NewsSummaryData | undefined = summaryResponse?.data;
  const summaryTableHeaders = newsSummaryData?.monthlyTable?.[0] ? Object.keys(newsSummaryData.monthlyTable[0]) : [];
  const summaryKeys = newsSummaryData?.tableSummary ? Object.keys(newsSummaryData.tableSummary).filter(key => key !== 'totalMonths') : [];
  const summaryBarChartData =
    newsSummaryData?.monthlyTable?.map(row => {
      const formattedRow: Record<string, number | string> = {};
      Object.keys(row).forEach(key => {
        formattedRow[key] = typeof row[key] === 'number' ? row[key] : row[key];
      });
      return formattedRow;
    }) || [];
  const summaryPieChartData = newsSummaryData?.tableSummary
    ? summaryKeys.map(key => ({
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: newsSummaryData.tableSummary![key] as number,
      }))
    : [];
  const summaryOverallStatsData = [
    { name: 'Total Records', value: newsSummaryData?.overall.totalRecords || 0 },
    { name: 'Last 24 Hours', value: newsSummaryData?.overall.recordsLast24Hours || 0 },
    { name: 'Last Month', value: newsSummaryData?.overall.recordsLastMonth || 0 },
  ];

  const initialFilter = useMemo<FilterPayload | undefined>(() => {
    if (!q.startsWith('createdAt:range:')) return undefined;
    const datePart = q.split(':')[2];
    const [start, end] = datePart.split('_');
    if (!start || !end) return undefined;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const isFullMonth =
      format(startOfMonth(startDate), 'yyyy-MM-dd') === start &&
      format(endOfMonth(startDate), 'yyyy-MM-dd') === end &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();

    return {
      type: isFullMonth ? 'month' : 'range',
      value: { start, end },
    };
  }, [q]);

  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i);
      options.push({
        label: format(date, 'MMMM yyyy'),
        value: format(date, 'yyyy-MM'),
      });
    }
    return options;
  }, []);

  useEffect(() => {
    if (openDialog === 'export') {
      const allSelected = tableHeaders.reduce(
        (acc, header) => {
          acc[String(header.key)] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setSelectedExportColumns(allSelected);
    }
  }, [openDialog]);

  useEffect(() => {
    if (openDialog === 'filter') {
      if (initialFilter) {
        if (initialFilter.type === 'month') {
          setFilterActiveTab('month');
          setSelectedMonth(format(new Date(initialFilter.value.start), 'yyyy-MM'));
          setDateRange(undefined);
          setTempDateRange(undefined);
        } else {
          const nextRange = {
            from: new Date(initialFilter.value.start),
            to: new Date(initialFilter.value.end),
          };
          setFilterActiveTab('range');
          setDateRange(nextRange);
          setTempDateRange(nextRange);
          setSelectedMonth('');
        }
      } else {
        setSelectedMonth('');
        setDateRange(undefined);
        setTempDateRange(undefined);
      }
    }
  }, [initialFilter, openDialog]);

  useEffect(() => {
    if (isCalendarOpen) {
      setTempDateRange(dateRange);
    }
  }, [isCalendarOpen, dateRange]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!imageEditing) return;
      try {
        const response = await fetch('/api/media/v1');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const lstImage: string[] = data?.data.map((item: { url: string }) => item.url);
        setAllImages(lstImage);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, [imageEditing]);

  const setField = (setter: React.Dispatch<React.SetStateAction<NewsItem>>, key: keyof NewsItem, value: unknown) => {
    setter(prev => ({ ...prev, [key]: value }));
  };

  const submitAdd = async (payload: NewsItem) => {
    try {
      await addNews({ ...sanitizeNewsPayload(payload), 'author-email': authorEmail }).unwrap();
      setDraft(emptyNews());
      setOpenDialog(null);
      handleSuccess('Added Successfully');
    } catch (error) {
      const message = isApiErrorResponse(error)
        ? formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
        : error instanceof Error
          ? error.message
          : 'An unknown error occurred.';
      handleError(message);
    }
  };

  const submitEdit = async (payload: NewsItem | null) => {
    if (!payload?._id) return;
    try {
      await updateNews({
        id: payload._id,
        ...sanitizeNewsPayload(payload),
      }).unwrap();
      setEditing(null);
      setPersonalEditing(null);
      setImageEditing(null);
      handleSuccess('Edit Successful');
    } catch (error) {
      const message = isApiErrorResponse(error)
        ? formatDuplicateKeyError(error.data.message) || 'An API error occurred.'
        : error instanceof Error
          ? error.message
          : 'An unknown error occurred.';
      handleError(message);
    }
  };

  const submitDelete = async () => {
    if (!deleting?._id) return;
    try {
      await deleteNews({ id: deleting._id }).unwrap();
      setDeleting(null);
      handleSuccess('Delete Successful');
    } catch {
      handleError('Failed to delete item. Please try again.');
    }
  };

  const handleAddImages = (newImage: string) => {
    setImageEditing(prev =>
      prev
        ? {
            ...prev,
            'personal-image': { name: newImage.split('/').pop() || 'image', url: newImage },
            'products-images': (prev['products-images'] || []).some(image => image.url === newImage)
              ? prev['products-images']
              : [{ name: newImage.split('/').pop() || 'image', url: newImage }, ...(prev['products-images'] || [])],
          }
        : prev,
    );
  };

  const handleRemoveImages = (imageToRemove: string) => {
    setImageEditing(prev =>
      prev
        ? {
            ...prev,
            'products-images': (prev['products-images'] || []).filter(image => image.url !== imageToRemove),
          }
        : prev,
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImageUploadLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const saveResponse = await fetch('/api/media/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: data.data.url,
            display_url: data.data.display_url,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error('Error! Cannot save the image.');
        }
        setAllImages([data?.data?.url, ...allImages]);
        handleSuccess('Image uploaded successfully!');
        setShowUploadModal(false);
      } else {
        handleError('Error! Cannot upload the image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      handleError('Error! Cannot upload the image');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleSelectImage = (url: string) => {
    if (selectImg === url) {
      setSelectImg('');
    } else {
      handleAddImages(url);
      setSelectImg(url);
    }
  };

  const handleBulkUpdateFieldChangeForAll = (value: string) => {
    setSelected(prev => prev.map(item => ({ ...item, area: value })));
  };

  const submitBulkUpdateSelected = async () => {
    if (!selected.length) return;
    await bulkUpdateNews(
      selected.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      })),
    ).unwrap();
    setSelected([]);
    setOpenDialog(null);
  };

  const handleBulkEditFieldChange = (id: string, key: keyof NewsItem, value: string) => {
    setSelected(prev => prev.map(item => (item._id === id ? { ...item, [key]: value } : item)));
  };

  const submitBulkEdit = async () => {
    if (!selected.length) return;
    await bulkUpdateNews(
      selected.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: rest,
      })),
    ).unwrap();
    setSelected([]);
    setOpenDialog(null);
  };

  const submitBulkDynamicUpdate = async () => {
    await bulkUpdateNews(
      selected.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: { ...rest, dataArr: newItemTags },
      })),
    ).unwrap();
    setSelected([]);
    setNewItemTags([]);
    setOpenDialog(null);
  };

  const submitDataSelectUpdate = async () => {
    await bulkUpdateNews(
      selected.map(({ _id, ...rest }) => ({
        id: _id,
        updateData: { ...rest, dataArr: dataSelectTags },
      })),
    ).unwrap();
    setSelected([]);
    setDataSelectTags([]);
    setOpenDialog(null);
  };

  const handleExportCheckedChange = (key: string, isChecked: boolean) => {
    const currentlyCheckedCount = Object.values(selectedExportColumns).filter(Boolean).length;
    if (currentlyCheckedCount === 1 && !isChecked) return;

    setSelectedExportColumns(prev => ({
      ...prev,
      [key]: isChecked,
    }));
  };

  const submitExport = () => {
    const activeHeaders = tableHeaders.filter(header => selectedExportColumns[String(header.key)]);
    const processedData = selected.map(row =>
      activeHeaders.reduce(
        (acc, header) => {
          acc[header.label] = header.key === 'createdAt' ? formatDate(row.createdAt) : row[header.key];
          return acc;
        },
        {} as Record<string, unknown>,
      ),
    );

    downloadXlsx(processedData, `Exported_News_${new Date().toISOString()}.xlsx`);
    setOpenDialog(null);
  };

  const applyFilter = () => {
    if (filterActiveTab === 'month' && selectedMonth) {
      const monthDate = new Date(selectedMonth);
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      setQ(`createdAt:range:${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`);
      setPage(1);
    } else if (filterActiveTab === 'range' && dateRange?.from && dateRange?.to) {
      setQ(`createdAt:range:${format(dateRange.from, 'yyyy-MM-dd')}_${format(dateRange.to, 'yyyy-MM-dd')}`);
      setPage(1);
    }
    setOpenDialog(null);
  };

  const clearFilter = () => {
    setQ('');
    setSelectedMonth('');
    setDateRange(undefined);
    setTempDateRange(undefined);
    setOpenDialog(null);
  };

  const updateCalendarRange = () => {
    setDateRange(tempDateRange);
    setIsCalendarOpen(false);
  };

  const closeCalendarRange = () => {
    setTempDateRange(dateRange);
    setIsCalendarOpen(false);
  };

  const isFilterApplyDisabled = (filterActiveTab === 'month' && !selectedMonth) || (filterActiveTab === 'range' && (!dateRange?.from || !dateRange?.to));
  const isCalendarUpdateDisabled = !tempDateRange?.from || !tempDateRange?.to;

  const handleSearch = useCallback((query: string) => {
    setQ(query);
    setPage(1);
  }, []);

  const handleSort = (key: DisplayableNewsKeys) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const handleSelectAll = (isChecked: boolean) => setSelected(isChecked ? rows : []);
  const handleSelectRow = (isChecked: boolean, item: NewsItem) => setSelected(isChecked ? [...selected, item] : selected.filter(row => row._id !== item._id));

  const handleSummaryPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (newsSummaryData?.pagination?.totalPages || 1)) {
      setSummaryPage(newPage);
    }
  };

  const submitBulkDelete = async () => {
    await bulkDeleteNews({ ids: selected.map(item => item._id).filter(Boolean) }).unwrap();
    setSelected([]);
    setOpenDialog(null);
  };

  const renderFieldRow = (id: string, label: string, control: React.ReactNode, align: 'center' | 'start' = 'center') => (
    <div className={`grid grid-cols-1 md:grid-cols-4 items-${align} gap-4 pr-1`}>
      <Label htmlFor={id} className={`text-right ${align === 'start' ? 'pt-3' : ''}`}>
        {label}
      </Label>
      <div className="col-span-3">{control}</div>
    </div>
  );

  const renderCoreForm = (value: NewsItem, onChange: (key: keyof NewsItem, value: unknown) => void) => (
    <div className="grid gap-4 py-4 px-6 text-white">
      {renderFieldRow(
        'title',
        'Title',
        <InputFieldForString className="text-white" id="title" placeholder="Title" value={value.title} onChange={next => onChange('title', next as string)} />,
      )}
      {renderFieldRow(
        'email',
        'Email',
        <InputFieldForEmail className="text-white" id="email" value={value.email} onChange={next => onChange('email', next as string)} />,
      )}
      {renderFieldRow(
        'author-email',
        'Author Email',
        <InputFieldForEmail
          readonly
          className="text-white"
          id="author-email"
          value={value['author-email'] || authorEmail}
          onChange={next => onChange('author-email', next as string)}
        />,
      )}
      {renderFieldRow(
        'password',
        'Password',
        <InputFieldForPassword id="password" value={value.password} onChange={next => onChange('password', next as string)} />,
      )}
      {renderFieldRow(
        'passcode',
        'Passcode',
        <InputFieldForPasscode id="passcode" value={value.passcode} onChange={next => onChange('passcode', next as string)} />,
      )}
      {renderFieldRow('area', 'Area', <SelectField options={areaOptions} value={value.area} onValueChange={next => onChange('area', next)} />)}
      {renderFieldRow(
        'sub-area',
        'Sub Area',
        <DynamicSelectField value={value['sub-area']} apiUrl="https://jsonplaceholder.typicode.com/users" onChange={next => onChange('sub-area', next)} />,
        'start',
      )}
      {renderFieldRow(
        'products-images',
        'Products Images',
        <ImageUploadManager value={value['products-images']} onChange={next => onChange('products-images', next)} />,
      )}
      {renderFieldRow(
        'personal-image',
        'Personal Image',
        <ImageUploadManagerSingle value={value['personal-image']} onChange={next => onChange('personal-image', next)} />,
      )}
      {renderFieldRow(
        'description',
        'Description',
        <TextareaFieldForDescription
          className="text-white"
          id="description"
          value={value.description}
          onChange={e => onChange('description', e.target.value)}
        />,
        'start',
      )}
      {renderFieldRow('age', 'Age', <NumberInputFieldInteger id="age" value={value.age} onChange={next => onChange('age', next as number)} />)}
      {renderFieldRow('amount', 'Amount', <NumberInputFieldFloat id="amount" value={value.amount} onChange={next => onChange('amount', next as number)} />)}
      {renderFieldRow(
        'isActive',
        'IsActive',
        <BooleanInputField id="isActive" checked={value.isActive} onCheckedChange={next => onChange('isActive', next)} />,
      )}
      {renderFieldRow(
        'start-date',
        'Start Date',
        <DateField id="start-date" value={value['start-date'] as unknown as Date} onChange={next => onChange('start-date', next)} />,
      )}
      {renderFieldRow('start-time', 'Start Time', <TimeField id="start-time" value={value['start-time']} onChange={next => onChange('start-time', next)} />)}
      {renderFieldRow(
        'schedule-date',
        'Schedule Date',
        <DateRangePickerField id="schedule-date" value={value['schedule-date']} onChange={next => onChange('schedule-date', next)} />,
      )}
      {renderFieldRow(
        'schedule-time',
        'Schedule Time',
        <TimeRangePickerField id="schedule-time" value={value['schedule-time']} onChange={next => onChange('schedule-time', next)} />,
      )}
      {renderFieldRow(
        'favorite-color',
        'Favorite Color',
        <ColorPickerField id="favorite-color" value={value['favorite-color']} onChange={next => onChange('favorite-color', next as string)} />,
      )}
      {renderFieldRow('number', 'Number', <PhoneInputField id="number" value={value.number} onChange={next => onChange('number', next)} />)}
      {renderFieldRow('profile', 'Profile', <UrlInputField id="profile" value={value.profile} onChange={next => onChange('profile', next as string)} />)}
      {renderFieldRow('test', 'Test', <RichTextEditorField id="test" value={value.test} onChange={next => onChange('test', next)} />, 'start')}
      {renderFieldRow('info', 'Info', <AutocompleteField id="info" value={value.info} />)}
      {renderFieldRow('shift', 'Shift', <RadioButtonGroupField options={shiftOptions} value={value.shift} onChange={next => onChange('shift', next)} />)}
      {renderFieldRow('policy', 'Policy', <CheckboxField id="policy" checked={value.policy} onCheckedChange={next => onChange('policy', next)} />)}
      {renderFieldRow('hobbies', 'Hobbies', <MultiCheckboxGroupField value={value.hobbies} onChange={next => onChange('hobbies', next)} />, 'start')}
      {renderFieldRow('ideas', 'Ideas', <MultiOptionsField options={ideasOptions} value={value.ideas} onChange={next => onChange('ideas', next)} />)}
      {renderFieldRow('students', 'Students', <StringArrayField value={value.students} onChange={next => onChange('students', next)} />, 'start')}
      {renderFieldRow(
        'complexValue',
        'ComplexValue',
        <JsonTextareaField id="complexValue" value={JSON.stringify(value.complexValue, null, 2) || ''} onChange={next => onChange('complexValue', next)} />,
        'start',
      )}
    </div>
  );

  const renderActions = (item: NewsItem) => (
    <div className="flex justify-end items-center">
      <div className="hidden md:flex gap-2">
        <Button variant="outlineWater" className="min-w-[8px]" size="sm" onClick={() => setViewing(item)}>
          <EyeIcon className="w-4 h-4" />
        </Button>
        <Button variant="outlineWater" className="min-w-[8px]" size="sm" onClick={() => setEditing(item)}>
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button variant="outlineWater" className="min-w-[8px]" size="sm" onClick={() => setPersonalEditing(item)}>
          <Settings2 className="w-4 h-4" />
        </Button>
        <Button variant="outlineWater" className="min-w-[8px]" size="sm" onClick={() => setImageEditing(item)}>
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button variant="destructive" className="min-w-[8px]" size="sm" onClick={() => setDeleting(item)}>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="md:hidden">
        <Sheet open={rowActionOpen} onOpenChange={setRowActionOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outlineWater" className="min-w-[8px] rounded-full border-none">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className={cn(
              'w-full backdrop-blur-xl bg-white/10 border-t border-white/20 text-white shadow-2xl',
              'rounded-t-2xl p-4 flex flex-col space-y-4 animate-in slide-in-from-bottom',
            )}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-semibold text-white/90">Actions</h2>
            </div>

            <Button
              variant="outlineWater"
              size="sm"
              onClick={() => {
                setViewing(item);
                setRowActionOpen(false);
              }}
            >
              <EyeIcon className="w-4 h-4 mr-2" /> View
            </Button>
            <Button
              variant="outlineWater"
              size="sm"
              onClick={() => {
                setEditing(item);
                setRowActionOpen(false);
              }}
            >
              <PencilIcon className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button
              variant="outlineWater"
              size="sm"
              onClick={() => {
                setPersonalEditing(item);
                setRowActionOpen(false);
              }}
            >
              <Settings2 className="w-4 h-4 mr-2" /> Personal Edit
            </Button>
            <Button
              variant="outlineWater"
              size="sm"
              onClick={() => {
                setImageEditing(item);
                setRowActionOpen(false);
              }}
            >
              <ImageIcon className="w-4 h-4 mr-2" /> Images
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeleting(item);
                setRowActionOpen(false);
              }}
            >
              <TrashIcon className="w-4 h-4 mr-2" /> Delete
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  const formatViewDate = (date?: string | Date): string => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error: unknown) {
      let errMessage = 'Invalid Date';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      console.warn(errMessage);
      return 'Invalid';
    }
  };

  const formatBoolean = (value?: boolean): string => (value ? 'Yes' : 'No');

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <span className="text-sm text-white/80">{label}</span>
      <span className="col-span-2 text-sm text-white">{(value ?? 'N/A') as Primitive}</span>
    </div>
  );

  const DetailRowArray = ({ label, values }: { label: string; values?: Arrayish | null }) => <DetailRow label={label} value={values?.join(', ') || 'N/A'} />;

  const DetailRowJson = ({ label, value }: { label: string; value?: JSONLike }) => (
    <div className="py-2 border-b border-white/10">
      <div className="text-sm text-white/80">{label}</div>
      <pre className="text-[11px] text-white/90 bg-white/5 rounded-md p-2 mt-1 overflow-auto">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
    </div>
  );

  if (status === 429) return <div className="p-8 text-center text-white">Too many requests. Please try again later.</div>;
  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />;

  return (
    <div className="container mx-auto text-white md:p-4">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="h2 w-full">
          News Management <sup className="text-xs text-gray-300">(total:{total || '00'})</sup>
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outlineGlassy" onClick={() => setOpenDialog('summary')}>
            <TrendingUp className="mr-2 h-4 w-4" /> Summary
          </Button>
          <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('filter')}>
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button size="sm" variant="outlineWater" onClick={() => refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Reload
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => setOpenDialog('add')}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add News
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => setOpenDialog('personal-add')}>
            <PlusIcon className="mr-2 h-4 w-4" /> Personal Add
          </Button>
        </div>
      </div>

      <NewsSearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />

      {activeFilter && (
        <Badge variant="secondary" className="mb-4 gap-2 bg-white/10 text-white">
          Filtering from {activeFilter}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQ('')}>
            <XIcon className="h-4 w-4" />
          </Button>
        </Badge>
      )}

      <div className="w-full flex flex-col">
        <div className="w-full my-4">
          <div className="w-full flex md:flex-row items-center justify-between gap-4 pb-2 border-b">
            <div className="flex items-center gap-2 justify-start w-full">
              <Label>Selected:</Label>
              <span className="text-sm text-slate-300">({selected.length})</span>
            </div>

            <div className="hidden md:flex items-center justify-end w-full gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outlineWater" size="sm">
                    <MoreHorizontalIcon className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tableHeaders.map(header => (
                    <DropdownMenuCheckboxItem
                      key={header.key}
                      className="capitalize"
                      checked={columnVisibility[header.key]}
                      onCheckedChange={value => setColumnVisibility(prev => ({ ...prev, [header.key]: !!value }))}
                    >
                      {header.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('export')} disabled={selected.length === 0}>
                <DownloadIcon className="w-4 h-4 mr-1" /> Export
              </Button>
              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-update')} disabled={selected.length === 0}>
                <PencilIcon className="w-4 h-4 mr-1" /> B.Update
              </Button>
              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-edit')} disabled={selected.length === 0}>
                <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
              </Button>
              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('data-select')} disabled={selected.length === 0}>
                <Settings2 className="w-4 h-4 mr-1" /> Data
              </Button>
              <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('dynamic-update')} disabled={selected.length === 0}>
                <Settings2 className="w-4 h-4 mr-1" /> Dynamic
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setOpenDialog('bulk-delete')} disabled={selected.length === 0}>
                <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
              </Button>
            </div>

            <div className="flex md:hidden justify-end w-full">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outlineWater" className="rounded-full backdrop-blur-md bg-white/10 border-white/20 min-w-[8px]">
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className={cn(
                    'w-64 sm:w-72 backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl',
                    'rounded-l-2xl p-4 flex flex-col space-y-4',
                  )}
                >
                  <SheetHeader className="flex justify-between items-center">
                    <SheetTitle className="text-lg font-semibold text-white/90"></SheetTitle>
                  </SheetHeader>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outlineWater" size="sm" className="justify-start">
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {tableHeaders.map(header => (
                        <DropdownMenuCheckboxItem
                          key={header.key}
                          className="capitalize"
                          checked={columnVisibility[header.key]}
                          onCheckedChange={value => setColumnVisibility(prev => ({ ...prev, [header.key]: !!value }))}
                        >
                          {header.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('export')} disabled={selected.length === 0}>
                    <DownloadIcon className="w-4 h-4 mr-1" /> Export
                  </Button>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-update')} disabled={selected.length === 0}>
                    <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                  </Button>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('bulk-edit')} disabled={selected.length === 0}>
                    <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                  </Button>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('data-select')} disabled={selected.length === 0}>
                    <Settings2 className="w-4 h-4 mr-1" /> Data
                  </Button>
                  <Button size="sm" variant="outlineWater" onClick={() => setOpenDialog('dynamic-update')} disabled={selected.length === 0}>
                    <Settings2 className="w-4 h-4 mr-1" /> Dynamic
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setOpenDialog('bulk-delete')} disabled={selected.length === 0}>
                    <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                  </Button>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="py-12 text-center text-2xl text-slate-300">Ops! Nothing was found.</div>
        ) : (
          <Table className="min-w-max border">
            <TableHeader>
              <TableRow className="bg-blue-300/40 text-white font-bold">
                <TableHead>
                  <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={selected.length === rows.length && rows.length > 0} />
                </TableHead>
                {visibleHeaders.map(({ key, label }) => (
                  <TableHead key={key} className="cursor-pointer bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap" onClick={() => handleSort(key)}>
                    {label}
                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                ))}
                <TableHead className="text-right bg-accent-100/60 text-slate-50 font-bold whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map(item => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={selected.some(row => row._id === item._id)} />
                  </TableCell>
                  {visibleHeaders.map(header => (
                    <TableCell key={header.key}>{header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}</TableCell>
                  ))}
                  <TableCell className="text-right max-w-[10px]">{renderActions(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <NewsPagination currentPage={page} totalItems={total} itemsPerPage={limit} onPageChange={nextPage => setPage(nextPage)} />

      <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-50 font-normal pl-3">
          News per page
        </Label>
        <Select
          value={String(limit)}
          onValueChange={next => {
            setLimit(Number(next));
            setPage(1);
          }}
        >
          <SelectTrigger className="border-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {pageLimits.map(item => (
              <SelectItem key={item} value={String(item)} className="cursor-pointer">
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={openDialog === 'add' || openDialog === 'personal-add'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0">
          <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
            <DialogHeader className="p-6 pb-3">
              <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
                {openDialog === 'personal-add' ? 'Personal Add News' : 'Add New News'}
              </DialogTitle>
            </DialogHeader>
            {renderCoreForm(draft, (key, value) => setField(setDraft, key, value))}
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 gap-3">
            <Button variant="outlineWater" onClick={() => setOpenDialog(null)} size="sm">
              Cancel
            </Button>
            <Button onClick={() => submitAdd(draft)} disabled={isAdding} variant="outlineGarden" size="sm">
              {isAdding ? 'Adding...' : 'Add News'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing || !!personalEditing}
        onOpenChange={open => {
          if (!open) {
            setEditing(null);
            setPersonalEditing(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[825px] rounded-xl border mt-[35px] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 p-0">
          <ScrollArea className="h-[75vh] max-h-[calc(100vh-2rem)] rounded-xl">
            <DialogHeader className="p-6 pb-3">
              <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200 drop-shadow-md">
                {personalEditing ? 'Personal Edit News' : 'Edit News'}
              </DialogTitle>
            </DialogHeader>
            {editing && renderCoreForm(editing, (key, value) => setEditing(prev => (prev ? { ...prev, [key]: value } : prev)))}
            {personalEditing && renderCoreForm(personalEditing, (key, value) => setPersonalEditing(prev => (prev ? { ...prev, [key]: value } : prev)))}
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 gap-3">
            <Button
              variant="outlineWater"
              onClick={() => {
                setEditing(null);
                setPersonalEditing(null);
              }}
              size="sm"
            >
              Cancel
            </Button>
            <Button onClick={() => submitEdit(editing || personalEditing)} disabled={isUpdating} variant="outlineGarden" size="sm">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={open => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-2xl mt-8 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">News Details</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
            {viewing && (
              <>
                <DetailRow label="Title" value={viewing.title} />
                <DetailRow label="Email" value={viewing.email} />
                <DetailRow label="Author Email" value={viewing['author-email']} />
                <DetailRow label="Password" value={viewing.password} />
                <DetailRow label="Passcode" value={viewing.passcode} />
                <DetailRow label="Area" value={viewing.area} />
                <DetailRowArray label="Sub Area" values={viewing['sub-area']} />
                <DetailRow label="Description" value={viewing.description} />
                <DetailRow label="Age" value={viewing.age} />
                <DetailRow label="Amount" value={viewing.amount} />
                <DetailRow label="IsActive" value={formatBoolean(viewing.isActive)} />
                <DetailRow label="Start Date" value={formatViewDate(viewing['start-date'])} />
                <DetailRow label="Start Time" value={viewing['start-time']} />
                <DetailRow
                  label="Schedule Date"
                  value={`${formatViewDate(viewing['schedule-date']?.from)} - ${formatViewDate(viewing['schedule-date']?.to)}`}
                />
                <DetailRow label="Schedule Time" value={`${viewing['schedule-time']?.start || 'N/A'} - ${viewing['schedule-time']?.end || 'N/A'}`} />
                <DetailRow
                  label="Favorite Color"
                  value={
                    <div className="flex items-center gap-2">
                      <span>{viewing['favorite-color']}</span>
                      <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: viewing['favorite-color'] }} />
                    </div>
                  }
                />
                <DetailRow label="Number" value={viewing.number} />
                <DetailRow label="Profile" value={viewing.profile} />
                <DetailRow label="Test" value={viewing.test} />
                <DetailRow label="Info" value={viewing.info} />
                <DetailRow label="Shift" value={viewing.shift} />
                <DetailRow label="Policy" value={formatBoolean(viewing.policy)} />
                <DetailRowArray label="Hobbies" values={viewing.hobbies} />
                <DetailRowArray label="Ideas" values={viewing.ideas} />
                <DetailRowJson label="Students" value={viewing.students} />
                <DetailRowJson label="ComplexValue" value={viewing.complexValue} />
                <DetailRow label="Created At" value={formatViewDate(viewing.createdAt)} />
                <DetailRow label="Updated At" value={formatViewDate(viewing.updatedAt)} />

                <div className="mt-6">
                  <h3 className="text-white font-medium mb-2">Products Images</h3>
                  {Array.isArray(viewing['products-images']) && viewing['products-images'].length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {viewing['products-images'].map((val, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                          <Image src={val.url} fill className="object-cover" alt={val.name || `Products Images ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/70 text-sm">No images.</p>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-white font-medium mb-2">Personal Image</h3>
                  {viewing['personal-image']?.url ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
                      <Image src={viewing['personal-image'].url} fill className="object-cover" alt="Personal Image" />
                    </div>
                  ) : (
                    <p className="text-white/70 text-sm">No image.</p>
                  )}
                </div>
              </>
            )}
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button variant="outlineWater" onClick={() => setViewing(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={open => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
          </DialogHeader>

          <p className="text-white/80 py-3">
            Are you sure you want to delete:&nbsp;
            <strong className="text-white">{deleting?.title || 'this item'}</strong> ?
          </p>

          <DialogFooter className="gap-2">
            <Button variant="outlineWater" size="sm" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="outlineFire" size="sm" disabled={isDeleting} onClick={submitDelete}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!imageEditing} onOpenChange={open => !open && setImageEditing(null)}>
        <DialogContent className="sm:max-w-4xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Image Dialog</DialogTitle>
          </DialogHeader>

          {imageEditing && (
            <div className="w-full flex flex-col gap-2 p-2 border rounded-md">
              <div className="w-full flex items-center justify-between">
                <h2 className="font-semibold text-sm">Selected Images</h2>
                <Button size="sm" variant="outline" onClick={() => setShowUploadModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Image
                </Button>
              </div>
              <div className="w-full min-h-[150px] p-2 bg-slate-50 rounded-lg flex items-center justify-center">
                {imageEditing['products-images'] && imageEditing['products-images'].length > 0 ? (
                  <div className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {imageEditing['products-images'].map((imageValue, index) => (
                      <div key={index + imageValue.url} className="relative w-full aspect-square border border-slate-200 rounded-lg overflow-hidden group">
                        <Image src={imageValue.url} alt="Selected Media" fill className="object-cover" />
                        <div
                          onClick={() => handleRemoveImages(imageValue.url)}
                          className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="text-white h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col w-full items-center justify-center text-slate-500 text-sm">
                    <p>No images selected.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <ScrollArea className="w-full h-[60vh] p-1 pr-2 border rounded-md">
            <main className="w-full min-h-[60vh] flex flex-col">
              <div className="flex justify-between items-center border-b p-2 mb-2">
                <h1 className="text-lg font-semibold w-full">Select an Image or Upload</h1>
                <Button size="sm" variant="outline" onClick={() => setShowUploadModal(true)}>
                  Upload New
                </Button>
              </div>
              {showUploadModal ? (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-slate-900">
                    <h3 className="text-xl font-semibold mb-4">Upload Image</h3>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploadLoading} />
                    {imageUploadLoading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {allImages.length > 0 ? (
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {allImages.map((imageUrl, index) => (
                        <div
                          onClick={() => handleSelectImage(imageUrl)}
                          key={index + imageUrl}
                          className={`relative w-full aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${selectImg === imageUrl ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-300 hover:border-slate-500'}`}
                        >
                          <Image src={imageUrl} fill alt="Media" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full items-center justify-center mt-10 text-gray-500">
                      <p>No images found.</p>
                      <p className="text-sm">Try uploading one!</p>
                    </div>
                  )}
                </div>
              )}
            </main>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button variant="outlineWater" size="sm" onClick={() => setImageEditing(null)}>
              Cancel
            </Button>
            <Button variant="outlineGarden" size="sm" onClick={() => submitEdit(imageEditing)}>
              Save Images
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'filter'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-blue-200">Filter News</DialogTitle>
            <DialogDescription className="text-white/70">Select a filter option to narrow down data.</DialogDescription>
          </DialogHeader>

          <Tabs value={filterActiveTab} onValueChange={setFilterActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20">
              <TabsTrigger value="month" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Month
              </TabsTrigger>
              <TabsTrigger value="range" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-none text-white">
                By Date Range
              </TabsTrigger>
            </TabsList>

            <TabsContent value="month" className="py-4">
              <div className="grid gap-2">
                <Label htmlFor="month-select" className="text-white">
                  Select Month
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select" className="text-white border border-white/20 bg-white/5">
                    <SelectValue placeholder="Choose a month" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/20 backdrop-blur-xl text-white border border-white/20">
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-white/30">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="range" className="py-4">
              <div className="grid gap-2">
                <Label className="text-white">Select Date Range</Label>
                <Button id="date" variant="outlineGlassy" onClick={() => setIsCalendarOpen(true)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 gap-2">
            <Button size="sm" variant="outlineFire" onClick={clearFilter}>
              Clear Filter
            </Button>
            <Button size="sm" variant="outlineGarden" disabled={isFilterApplyDisabled} onClick={applyFilter}>
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCalendarOpen} onOpenChange={closeCalendarRange}>
        <DialogContent className="p-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg md:p-4 max-w-[608px] min-w-[608px] w-[608px] text-white">
          <DialogTitle className="text-white">Select Date Range</DialogTitle>
          <Calendar mode="range" selected={tempDateRange} onSelect={setTempDateRange} numberOfMonths={2} />

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outlineWater" size="sm" onClick={closeCalendarRange}>
              Close
            </Button>
            <Button variant="outlineGarden" size="sm" disabled={isCalendarUpdateDisabled} onClick={updateCalendarRange}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'summary'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-7xl max-h-[90vh] mt-4 overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-3xl shadow-2xl text-white">
          <DialogHeader className="space-y-3 pb-4 border-b border-white/10">
            <DialogTitle className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              News Analytics Dashboard
            </DialogTitle>
            <DialogDescription className="text-white/60 text-base">Comprehensive overview of your news data with interactive visualizations</DialogDescription>
          </DialogHeader>

          {isSummaryLoading && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
                <p className="text-white/70">Loading analytics...</p>
              </div>
            </div>
          )}

          {isSummaryError && (
            <div className="text-center p-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                <Activity className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-300 text-lg">Failed to load summary data.</p>
            </div>
          )}

          {!isSummaryLoading && !isSummaryError && newsSummaryData && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Total Records</p>
                        <p className="text-3xl font-bold">{newsSummaryData.overall.totalRecords ?? 'N/A'}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                        <CalendarDays className="h-6 w-6 text-blue-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Last 24 Hours</p>
                        <p className="text-3xl font-bold">{newsSummaryData.overall.recordsLast24Hours ?? 'N/A'}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/30 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl shadow-lg text-white hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Last Month</p>
                        <p className="text-3xl font-bold">{newsSummaryData.overall.recordsLastMonth ?? 'N/A'}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-purple-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Overall Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={summaryOverallStatsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }}
                        />
                        <Bar dataKey="value" fill="url(#newsColorGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="newsColorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {newsSummaryData.tableSummary && (
                  <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-400" />
                        Grand Total Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white/60 text-xs mb-1">Total Months</p>
                            <p className="text-2xl font-bold">{newsSummaryData.tableSummary.totalMonths}</p>
                          </div>
                          {summaryKeys.map((key, index) => (
                            <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                              <p className="text-white/60 text-xs mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-xl font-bold" style={{ color: summaryColors[index % summaryColors.length] }}>
                                {newsSummaryData.tableSummary![key].toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPieChart>
                            <Pie
                              data={summaryPieChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(props: PieLabelRenderProps) => `${(((props.percent as number) || 0) * 100).toFixed(0)}%`}
                              outerRadius={85}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {summaryPieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={summaryColors[index % summaryColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: 'white',
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {newsSummaryData.monthlyTable && (
                <Card className="border-white/20 bg-white/5 backdrop-blur-xl shadow-lg text-white">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <CardTitle className="text-xl">Monthly Data Breakdown</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={summaryViewMode === 'table' ? 'default' : 'ghost'}
                          onClick={() => setSummaryViewMode('table')}
                          className={cn(
                            'h-9 px-4 transition-all duration-200',
                            summaryViewMode === 'table' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                          )}
                        >
                          Table
                        </Button>
                        <Button
                          size="sm"
                          variant={summaryViewMode === 'bar' ? 'default' : 'ghost'}
                          onClick={() => setSummaryViewMode('bar')}
                          className={cn(
                            'h-9 px-4 transition-all duration-200',
                            summaryViewMode === 'bar' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                          )}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Bar
                        </Button>
                        <Button
                          size="sm"
                          variant={summaryViewMode === 'pie' ? 'default' : 'ghost'}
                          onClick={() => setSummaryViewMode('pie')}
                          className={cn(
                            'h-9 px-4 transition-all duration-200',
                            summaryViewMode === 'pie' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10',
                          )}
                        >
                          <PieChart className="h-4 w-4 mr-1" />
                          Pie
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`relative transition-opacity duration-200 ${isSummaryFetching ? 'opacity-50' : ''}`}>
                      {isSummaryFetching && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm z-10">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}

                      {summaryViewMode === 'table' && (
                        <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden">
                          <Table className="text-white">
                            <TableHeader className="bg-linear-to-r from-blue-500/20 to-purple-500/20">
                              <TableRow className="border-white/10 hover:bg-transparent">
                                {summaryTableHeaders.map(header => (
                                  <TableHead key={header} className="text-white font-semibold whitespace-nowrap">
                                    {header.charAt(0).toUpperCase() +
                                      header
                                        .slice(1)
                                        .replace(/([A-Z])/g, ' $1')
                                        .trim()}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {newsSummaryData.monthlyTable.length > 0 ? (
                                newsSummaryData.monthlyTable.map((row, index) => (
                                  <TableRow key={index} className="hover:bg-white/10 transition-colors border-white/5">
                                    {summaryTableHeaders.map(header => (
                                      <TableCell key={header} className="text-white/90">
                                        {row[header]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={summaryTableHeaders.length} className="h-32 text-center text-white/70">
                                    No monthly data to display.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {summaryViewMode === 'bar' && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={summaryBarChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey={summaryTableHeaders[0]} stroke="rgba(255,255,255,0.7)" angle={-45} textAnchor="end" height={80} />
                              <YAxis stroke="rgba(255,255,255,0.7)" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(0,0,0,0.9)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '12px',
                                  color: 'white',
                                }}
                              />
                              <Legend />
                              {summaryTableHeaders.slice(1).map((header, index) => (
                                <Bar key={header} dataKey={header} fill={summaryColors[index % summaryColors.length]} radius={[8, 8, 0, 0]} />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {summaryViewMode === 'pie' && summaryBarChartData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {summaryTableHeaders.slice(1).map((header, idx) => {
                            const chartData = summaryBarChartData
                              .map(row => ({ name: String(row[summaryTableHeaders[0]]), value: Number(row[header]) || 0 }))
                              .filter(item => item.value > 0);
                            return (
                              <div
                                key={header}
                                className="border border-white/20 rounded-xl p-5 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]"
                              >
                                <h3 className="text-base font-semibold mb-4 text-center text-white/90 pb-2 border-b border-white/10">
                                  {header.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                  <RechartsPieChart>
                                    <Pie
                                      data={chartData}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      label={(props: PieLabelRenderProps) => {
                                        const value = props.value as number;
                                        return value && value > 0 ? String(value) : '';
                                      }}
                                      outerRadius={70}
                                      fill="#8884d8"
                                      dataKey="value"
                                    >
                                      {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={summaryColors[(index + idx) % summaryColors.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px',
                                        color: 'white',
                                      }}
                                    />
                                  </RechartsPieChart>
                                </ResponsiveContainer>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-white/10 pt-4 mt-2">
            {newsSummaryData?.pagination && newsSummaryData.pagination.totalPages > 1 && (
              <Pagination className="text-white w-full justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        handleSummaryPageChange(summaryPage - 1);
                      }}
                      className={cn(
                        'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-200',
                        summaryPage <= 1 && 'pointer-events-none opacity-40',
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      isActive
                      className="border-white/30 bg-blue-500/30 backdrop-blur-xl text-white hover:bg-blue-500/40 transition-all duration-200"
                    >
                      Page {summaryPage} of {newsSummaryData.pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        handleSummaryPageChange(summaryPage + 1);
                      }}
                      className={cn(
                        'border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-all duration-200',
                        summaryPage >= newsSummaryData.pagination.totalPages && 'pointer-events-none opacity-40',
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'export'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-2xl shadow-xl transition-all">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Customize Your Export</DialogTitle>
            <DialogDescription className="text-white/70">Select the columns you want to include in your XLSX file.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-60 overflow-y-auto pr-2 backdrop-blur-md p-2">
            {tableHeaders.map(header => (
              <div key={String(header.key)} className="flex items-center space-x-2">
                <Checkbox
                  id={`col-${String(header.key)}`}
                  checked={!!selectedExportColumns[String(header.key)]}
                  onCheckedChange={checked => handleExportCheckedChange(String(header.key), !!checked)}
                  className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"
                />
                <Label htmlFor={`col-${String(header.key)}`} className="font-normal text-white/90">
                  {header.label}
                </Label>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button onClick={() => setOpenDialog(null)} variant="outlineWater" size="sm">
              Cancel
            </Button>
            <Button onClick={submitExport} variant="outlineWater" size="sm">
              Export Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'bulk-delete' || openDialog === 'personal-bulk-delete'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-md rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="text-white bg-clip-text bg-linear-to-r from-white to-red-200">Confirm Deletion</DialogTitle>
          </DialogHeader>

          {selected.length > 0 && (
            <p className="text-white/80 mt-2">
              You are deleting&nbsp;
              <strong>({selected.length})</strong> news.
            </p>
          )}

          <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <span key={`${item._id || 'news'}-${idx}`} className="text-sm text-white/90">
                  {idx + 1}. {String(item.title || '')}
                </span>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 mt-3">
            <Button variant="outlineWater" size="sm" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button variant="outlineFire" size="sm" disabled={isBulkDeleting} onClick={submitBulkDelete}>
              {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'bulk-edit'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Bulk Edit News</DialogTitle>
          </DialogHeader>

          {selected.length > 0 && (
            <p className="text-white/80">
              Editing <strong>{selected.length}</strong> selected news.
            </p>
          )}

          <ScrollArea className="h-[420px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-3">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="p-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-lg flex flex-col gap-3">
                  <span className="font-medium text-white">
                    {idx + 1}. {String(item.title || '')}
                  </span>

                  <div className="flex items-center gap-3">
                    <Label className="min-w-[120px] text-white">Area</Label>
                    <Select onValueChange={value => handleBulkEditFieldChange(item._id as string, 'area', value)} defaultValue={String(item.area ?? '')}>
                      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                        <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Pakistan">Pakistan</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="min-w-[120px] text-white">Shift</Label>
                    <Select onValueChange={value => handleBulkEditFieldChange(item._id as string, 'shift', value)} defaultValue={String(item.shift ?? '')}>
                      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                        <SelectItem value="OP 1">OP 1</SelectItem>
                        <SelectItem value="OP 2">OP 2</SelectItem>
                        <SelectItem value="OP 3">OP 3</SelectItem>
                        <SelectItem value="OP 4">OP 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button variant="outlineWater" size="sm" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button disabled={isUpdating} onClick={submitBulkEdit} variant="outlineWater" size="sm">
              {isUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'bulk-update'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-lg rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Confirm Bulk Update</DialogTitle>
          </DialogHeader>

          {selected.length > 0 && (
            <div className="space-y-3">
              <p className="pt-2 text-white/80">
                You are about to update <span className="font-semibold text-white">({selected.length})</span> news.
              </p>

              <div className="flex items-center justify-between rounded-lg p-3 bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-white/90">
                  Set all <span className="font-semibold text-blue-300">Area</span> to
                </p>

                <Select onValueChange={handleBulkUpdateFieldChangeForAll} defaultValue={areas[0] || ''}>
                  <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white backdrop-blur-md">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 bg-white/10 backdrop-blur-xl text-white">
                    {areas.map((option, index) => (
                      <SelectItem key={option + index} value={option} className="cursor-pointer hover:bg-white/20 text-white">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <ScrollArea className="h-[300px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="flex justify-between items-center text-white/90 rounded-md p-2 bg-white/5 border border-white/10">
                  <span>
                    {idx + 1}. {String(item.title || '')}
                  </span>
                  <span className="text-blue-300">{String(item.title || '')}</span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outlineWater" className="text-white hover:text-white" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button
              disabled={isUpdating}
              onClick={submitBulkUpdateSelected}
              className="px-6 py-2 bg-green-600/80 hover:bg-green-600 border border-green-400 text-white hover:shadow-md backdrop-blur-xl"
            >
              {isUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'data-select'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-lg rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl transition-all text-white">
          <DialogHeader>
            <DialogTitle className="bg-clip-text bg-linear-to-r from-white to-blue-200 text-white">Data Select</DialogTitle>
          </DialogHeader>

          {selected.length > 0 && (
            <p className="pt-2 text-white/80">
              Select tags for <span className="font-semibold text-white">({selected.length})</span> news records.
            </p>
          )}

          <div className="rounded-lg p-3 bg-white/5 border border-white/10 backdrop-blur-md">
            <NewsDataSelect newItemTags={dataSelectTags} setNewItemTags={setDataSelectTags} />
          </div>

          <ScrollArea className="h-[240px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mt-3">
            <div className="flex flex-col gap-2">
              {selected.map((item, idx) => (
                <div key={item._id || idx} className="flex justify-between items-center text-white/90 rounded-md p-2 bg-white/5 border border-white/10">
                  <span>
                    {idx + 1}. {String(item.title || '')}
                  </span>
                  <span className="text-blue-300">{dataSelectTags.join(', ') || 'N/A'}</span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outlineWater" className="text-white hover:text-white" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button
              disabled={isUpdating}
              onClick={submitDataSelectUpdate}
              className="px-6 py-2 bg-green-600/80 hover:bg-green-600 border border-green-400 text-white hover:shadow-md backdrop-blur-xl"
            >
              {isUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'dynamic-update'} onOpenChange={open => !open && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Dynamic Update</DialogTitle>
          </DialogHeader>
          {selected.length > 0 && (
            <div>
              <p className="pt-2">
                You are about to update <span className="font-semibold">({selected.length})</span> news.
              </p>
              <div className="w-full flex items-center justify-between pt-2">
                <NewsDynamicDataSelect label="Update all data as" newItemTags={newItemTags} setNewItemTags={setNewItemTags} />
              </div>
            </div>
          )}
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="flex flex-col gap-2">
              {selected.map((news, idx) => (
                <div key={news._id || idx} className="flex items-start mb-2 justify-between flex-col">
                  <div className="flex flex-col">
                    <span>
                      {idx + 1}. {String(news.title || '')}
                    </span>
                    <span className="text-xs mt-0 text-blue-500">Will be updated to: {newItemTags.join(', ') || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)} className="cursor-pointer border-slate-400 hover:border-slate-500">
              Cancel
            </Button>
            <Button
              disabled={isUpdating}
              variant="outline"
              onClick={submitBulkDynamicUpdate}
              className="text-green-500 hover:text-green-600 cursor-pointer bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400"
            >
              {isUpdating ? 'Updating...' : 'Update Selected'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsPage;
