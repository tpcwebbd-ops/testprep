export const generateViewTableComponentFile = (inputJsonFile: string): string => {
  const { schema, namingConvention } = JSON.parse(inputJsonFile);

  const pluralPascalCase = namingConvention.Users_1_000___;
  const pluralLowerCase = namingConvention.users_2_000___;
  const interfaceName = `I${pluralPascalCase}`;
  const displayableKeysTypeName = `Displayable${pluralPascalCase}Keys`;
  const isUsedGenerateFolder = namingConvention.use_generate_folder;

  let reduxPath = '';
  if (isUsedGenerateFolder) {
    reduxPath = `../redux/rtk-api`;
  } else {
    reduxPath = `@/redux/features/${pluralLowerCase}/${pluralLowerCase}Slice`;
  }

  const suitableTypes = ['STRING', 'EMAIL', 'SELECT', 'RADIOBUTTON', 'INTNUMBER', 'FLOATNUMBER', 'BOOLEAN', 'CHECKBOX', 'DATE', 'TIME'];
  const excludedKeys = ['password', 'passcode', 'description', 'richtext', 'image', 'images'];

  // helper: normalize key for V2-style (roleName -> name, authorEmail -> email)
  const normalizeKey = (key: string) => {
    const k = key.trim().toLowerCase();
    if (k.includes('role') || k.includes('name')) return 'name';
    if (k.includes('email')) return 'email';
    // remove spaces and convert eventual "createdat" to createdAt
    return key.replace(/\s+/g, '_');
  };

  // helper: humanize label
  const humanizeLabel = (key: string) =>
    key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();

  const rawHeaders = Object.entries(schema)
    .filter(
      ([key, type]) =>
        typeof type === 'string' && !key.includes('-') && suitableTypes.includes(type.toUpperCase()) && !excludedKeys.includes(key.toLowerCase()),
    )
    .slice(0, 7)
    .map(([key]) => ({
      origKey: key,
      key: normalizeKey(key),
      label: humanizeLabel(key),
    }));

  // ensure unique keys (in case normalization produced duplicates)
  const seen = new Set<string>();
  const tableHeaders = rawHeaders.filter(h => {
    if (seen.has(h.key)) return false;
    seen.add(h.key);
    return true;
  });

  // always ensure createdAt exists at end
  if (!tableHeaders.some(h => h.key === 'createdAt')) {
    tableHeaders.push({
      origKey: 'createdAt',
      key: 'createdAt',
      label: 'Created At',
    });
  }

  const displayableKeys = tableHeaders.map(h => h.key);

  const displayableKeysType = `type ${displayableKeysTypeName} = \n    | '${displayableKeys.map(k => k).join("'\n    | '")}'`;

  const columnVisibilityStateType = `type ColumnVisibilityState = Record<${displayableKeysTypeName}, boolean>`;

  return `\`use client\`;

import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { MoreHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, DownloadIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { ${interfaceName} } from '../store/data/data';
import { pageLimitArr } from '../store/store-constant';
import { use${pluralPascalCase}Store } from '../store/store';
import { useGet${pluralPascalCase}Query } from '${reduxPath}';
import Pagination from './Pagination';
import ExportDialog from './ExportDialog';

${displayableKeysType}
${columnVisibilityStateType}

const ViewTableNextComponents: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: ${displayableKeysTypeName};
    direction: 'asc' | 'desc';
  } | null>(null);

  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    setSelected${pluralPascalCase},
    toggleBulkEditModal,
    toggleBulkUpdateModal,
    toggleViewModal,
    queryPramsLimit,
    queryPramsPage,
    queryPramsQ,
    toggleEditModal,
    toggleDeleteModal,
    bulkData,
    setBulkData,
    setQueryPramsLimit,
    setQueryPramsPage,
    toggleBulkDeleteModal,
  } = use${pluralPascalCase}Store();

    const {
        data: getResponseData,
        isLoading,
        isError,
        error,
    } = useGet${pluralPascalCase}Query({
        q: queryPramsQ,
        limit: queryPramsLimit,
        page: queryPramsPage,
    })

    const allData = useMemo(
        () => getResponseData?.data?.${pluralLowerCase} || [],
        [getResponseData]
    )

    const tableHeaders: { key: ${displayableKeysTypeName}; label: string }[] = useMemo(()=>[
        ${tableHeaders.map(h => `{ key: '${h.key}', label: '${h.label}' }`).join(',\n        ')}
    ],[]);

    const [columnVisibility, setColumnVisibility] =
        useState<ColumnVisibilityState>(() => {
            const initialState = {} as ColumnVisibilityState
            let counter = 0
            for (const header of tableHeaders) {
                if (counter > 3) {
                    initialState[header.key] = false
                } else {
                    initialState[header.key] = true
                }
                counter++
            }
            return initialState
        })
            
    const visibleHeaders = useMemo(
        () => tableHeaders.filter(header => columnVisibility[header.key]),
        [columnVisibility, tableHeaders]
    );

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSort = (key: ${displayableKeysTypeName}) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return allData;
    return [...allData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allData, sortConfig]);

  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? allData : []);
  const handleSelectRow = (isChecked: boolean, item: ${interfaceName}) => setBulkData(isChecked ? [...bulkData, item] : bulkData.filter(i => i._id !== item._id));

  const renderActions = (item: ${interfaceName}) => {
    return (
      <div className="flex justify-end items-center">
        {/* ===== Desktop Actions ===== */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outlineWater"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelected${pluralPascalCase}(item);
              toggleViewModal(true);
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outlineWater"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelected${pluralPascalCase}(item);
              toggleEditModal(true);
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            className="min-w-[8px]"
            size="sm"
            onClick={() => {
              setSelected${pluralPascalCase}(item);
              toggleDeleteModal(true);
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* ===== Mobile Actions (Sheet popup) ===== */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
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
                  setSelected${pluralPascalCase}(item);
                  toggleViewModal(true);
                  setOpen(false);
                }}
              >
                <EyeIcon className="w-4 h-4 mr-2" /> View
              </Button>

              <Button
                variant="outlineWater"
                size="sm"
                onClick={() => {
                  setSelected${pluralPascalCase}(item);
                  toggleEditModal(true);
                  setOpen(false);
                }}
              >
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelected${pluralPascalCase}(item);
                  toggleDeleteModal(true);
                  setOpen(false);
                }}
              >
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  };

  const renderTableRows = () =>
    sortedData.map((item: ${interfaceName}) => (
      <TableRow key={item._id}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, item)} checked={bulkData.some(i => i._id === item._id)} />
        </TableCell>
        {visibleHeaders.map(header => (
          <TableCell key={header.key}>{header.key === 'createdAt' ? formatDate(item.createdAt) : String(item[header.key] ?? '')}</TableCell>
        ))}
        <TableCell className="text-right max-w-[10px]">{renderActions(item)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error?.toString() || 'An error occurred'} />;

  return (
    <div className="w-full flex flex-col">
      {/* Toolbar Section */}
      <div className="w-full my-4">
        <div className="w-full flex md:flex-row items-center justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-2 justify-start w-full">
            <Label>Selected:</Label>
            <span className="text-sm text-slate-300">({bulkData.length})</span>
          </div>

          {/* ===== Desktop Toolbar ===== */}
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
                    onCheckedChange={value =>
                      setColumnVisibility(prev => ({
                        ...prev,
                        [header.key]: !!value,
                      }))
                    }
                  >
                    {header.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={bulkData.length === 0}>
              <DownloadIcon className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B.Update
            </Button>
            <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
            </Button>
          </div>

          {/* ===== Mobile Toolbar (Sheet) ===== */}
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
                        onCheckedChange={value =>
                          setColumnVisibility(prev => ({
                            ...prev,
                            [header.key]: !!value,
                          }))
                        }
                      >
                        {header.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="outlineWater" onClick={() => setExportDialogOpen(true)} disabled={bulkData.length === 0}>
                  <DownloadIcon className="w-4 h-4 mr-1" /> Export
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Update
                </Button>
                <Button size="sm" variant="outlineWater" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
                  <PencilIcon className="w-4 h-4 mr-1" /> B.Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
                  <TrashIcon className="w-4 h-4 mr-1" /> B.Delete
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ===== Responsive Scrollable Table ===== */}
      {allData.length === 0 ? (
        <div className="py-12 text-center text-2xl text-slate-300">Ops! Nothing was found.</div>
      ) : (
        <Table className="min-w-max border">
          <>
            <TableHeader>
              <TableRow className="bg-blue-300/40 text-white font-bold">
                <TableHead>
                  <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === allData.length && allData.length > 0} />
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
            <TableBody>{renderTableRows()}</TableBody>
          </>
        </Table>
      )}

            <Pagination
                currentPage={queryPramsPage}
                itemsPerPage={queryPramsLimit}
                onPageChange={(page) => setQueryPramsPage(page)}
                totalItems={getResponseData?.data?.total || 0}
            />

             <div className="max-w-xs flex items-center self-center justify-between pl-2 gap-4 border rounded-lg w-full mx-auto mt-8">
                <Label htmlFor="set-limit" className="text-right text-slate-500 font-normal pl-3">
                    ${pluralPascalCase} per page
                </Label>
                <Select
                    onValueChange={(value) => { setQueryPramsLimit(Number(value)); setQueryPramsPage(1); }}
                    defaultValue={queryPramsLimit.toString()}
                >
                    <SelectTrigger className="border-0">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageLimitArr.map((i) => (
                            <SelectItem key={i} value={i.toString()} className="cursor-pointer">
                                {i}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Render the ExportDialog and pass it the required props */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onOpenChange={setExportDialogOpen}
                headers={tableHeaders}
                data={bulkData}
                fileName={\`Exported_${pluralPascalCase}_\${new Date().toISOString()}.xlsx\`}
            />
        </div>
    )
}
    export default ViewTableNextComponents
`;
};
