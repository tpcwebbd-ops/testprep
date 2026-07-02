/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Plus, Save, Trash2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddSidebarMutation, useGetSidebarsQuery } from '@/redux/features/sidebars/sidebarsSlice';

type SidebarChildInput = {
  name: string;
  path: string;
  iconName: string;
};

type SidebarParentInput = SidebarChildInput & {
  children: SidebarChildInput[];
};

type SidebarPayload = SidebarChildInput & {
  sl_no: number;
  children: (SidebarChildInput & { sl_no: number })[];
};

type ExistingSidebarResponse = {
  data?: {
    sidebars?: SidebarPayload[];
  };
};

const defaultSidebarData: SidebarParentInput[] = [
  {
    name: 'Credential',
    path: '/dashboard',
    iconName: 'ShieldCheck',
    children: [
      { name: 'Account', path: '/dashboard/credential/account', iconName: 'UserRound' },
      { name: 'Session', path: '/dashboard/credential/session', iconName: 'KeyRound' },
      { name: 'Verification', path: '/dashboard/credential/verification', iconName: 'BadgeCheck' },
    ],
  },
  {
    name: 'Admin',
    path: '/dashboard',
    iconName: 'Settings',
    children: [
      { name: 'Access', path: '/dashboard/admin/access', iconName: 'LockKeyhole' },
      { name: 'Footer Editor', path: '/dashboard/admin/footer-editor', iconName: 'PanelBottom' },
      { name: 'Install Popup', path: '/dashboard/admin/install-popup', iconName: 'MessageSquarePlus' },
      { name: 'Menu Editor', path: '/dashboard/admin/menu-editor', iconName: 'Menu' },
      { name: 'Role', path: '/dashboard/admin/role', iconName: 'Shield' },
      { name: 'Sidebar', path: '/dashboard/admin/sidebar', iconName: 'PanelLeft' },
      { name: 'Users', path: '/dashboard/admin/users', iconName: 'Users' },
      { name: 'Page Builder', path: '/dashboard/admin/page-builder', iconName: 'FilePenLine' },
    ],
  },
  {
    name: 'Raw Path',
    path: '/dashboard',
    iconName: 'Route',
    children: [],
  },
  {
    name: 'Media',
    path: '/dashboard/media',
    iconName: 'Images',
    children: [],
  },
  {
    name: 'Profile',
    path: '/dashboard/profile',
    iconName: 'CircleUserRound',
    children: [],
  },
];

const childLabel = (index: number) => String.fromCharCode(97 + index);

const normalizeSidebarData = (items: SidebarParentInput[]): SidebarPayload[] => {
  return items.map((item, parentIndex) => ({
    sl_no: parentIndex + 1,
    name: item.name.trim(),
    path: item.path.trim(),
    iconName: item.iconName.trim() || 'Menu',
    children: item.children.map((child, childIndex) => ({
      sl_no: childIndex + 1,
      name: child.name.trim(),
      path: child.path.trim(),
      iconName: child.iconName.trim() || 'Menu',
    })),
  }));
};

const validateSidebarData = (items: SidebarParentInput[]) => {
  const errors: string[] = [];

  items.forEach((item, parentIndex) => {
    const parentLabel = parentIndex + 1;
    if (!item.name.trim()) errors.push(`Parent ${parentLabel}: name is required.`);
    if (!item.path.trim()) errors.push(`Parent ${parentLabel}: path is required.`);
    if (item.children.length > 26) errors.push(`Parent ${parentLabel}: sub sidebar can use a-z only, so keep children within 26.`);

    item.children.forEach((child, childIndex) => {
      const label = `${parentLabel}${childLabel(childIndex)}`;
      if (!child.name.trim()) errors.push(`Sub sidebar ${label}: name is required.`);
      if (!child.path.trim()) errors.push(`Sub sidebar ${label}: path is required.`);
    });
  });

  return errors;
};

const cloneDefaultSidebarData = () => JSON.parse(JSON.stringify(defaultSidebarData)) as SidebarParentInput[];

const sidebarKey = (item: Pick<SidebarChildInput, 'name' | 'path'>) => `${item.name.trim().toLowerCase()}::${item.path.trim().toLowerCase()}`;

const Page = () => {
  const [sidebarItems, setSidebarItems] = useState<SidebarParentInput[]>(cloneDefaultSidebarData);
  const [accordionValue, setAccordionValue] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; title: string; details: string[] } | null>(null);
  const [addSidebar, { isLoading }] = useAddSidebarMutation();
  const { data: existingSidebarData, isFetching: isCheckingExisting, refetch: refetchSidebars } = useGetSidebarsQuery({ page: 1, limit: 1000 });

  const existingSidebarKeys = useMemo(() => {
    const sidebars = (existingSidebarData as ExistingSidebarResponse | undefined)?.data?.sidebars || [];
    return new Set(sidebars.map(sidebarKey));
  }, [existingSidebarData]);

  const updateParent = (parentIndex: number, field: keyof SidebarChildInput, value: string) => {
    setSidebarItems(prev => prev.map((item, index) => (index === parentIndex ? { ...item, [field]: value } : item)));
  };

  const updateChild = (parentIndex: number, childIndex: number, field: keyof SidebarChildInput, value: string) => {
    setSidebarItems(prev =>
      prev.map((item, index) =>
        index === parentIndex
          ? {
              ...item,
              children: item.children.map((child, currentChildIndex) => (currentChildIndex === childIndex ? { ...child, [field]: value } : child)),
            }
          : item,
      ),
    );
  };

  const addParent = () => {
    setSidebarItems(prev => [...prev, { name: '', path: '/dashboard', iconName: 'Menu', children: [] }]);
  };

  const removeParent = (parentIndex: number) => {
    setSidebarItems(prev => prev.filter((_, index) => index !== parentIndex));
  };

  const addChild = (parentIndex: number) => {
    setSidebarItems(prev =>
      prev.map((item, index) =>
        index === parentIndex && item.children.length < 26
          ? {
              ...item,
              children: [...item.children, { name: '', path: item.path || '/dashboard', iconName: 'Menu' }],
            }
          : item,
      ),
    );
  };

  const removeChild = (parentIndex: number, childIndex: number) => {
    setSidebarItems(prev =>
      prev.map((item, index) =>
        index === parentIndex
          ? {
              ...item,
              children: item.children.filter((_, currentChildIndex) => currentChildIndex !== childIndex),
            }
          : item,
      ),
    );
  };

  const handleUpdateSidebarData = () => {
    const validationErrors = validateSidebarData(sidebarItems);
    if (validationErrors.length) {
      setMessage({ type: 'error', title: 'Sidebar data needs attention', details: validationErrors });
      return;
    }

    setSidebarItems(normalizeSidebarData(sidebarItems));
    setMessage({
      type: 'success',
      title: 'Sidebar demo data updated',
      details: ['Parent serials are normalized from 1 onward and sub sidebar serials are normalized from a-z order.'],
    });
  };

  const handleOpenConfirm = () => {
    const validationErrors = validateSidebarData(sidebarItems);
    if (validationErrors.length) {
      setMessage({ type: 'error', title: 'Sidebar data needs attention', details: validationErrors });
      return;
    }

    setMessage(null);
    setConfirmOpen(true);
  };

  const handleAddSidebars = async () => {
    const payload = normalizeSidebarData(sidebarItems);
    const posted: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];
    const currentExistingKeys = new Set(existingSidebarKeys);

    for (const item of payload) {
      const key = sidebarKey(item);
      if (currentExistingKeys.has(key)) {
        skipped.push(`${item.sl_no}. ${item.name}`);
        continue;
      }

      try {
        await addSidebar(item).unwrap();
        posted.push(`${item.sl_no}. ${item.name}`);
        currentExistingKeys.add(key);
      } catch (error) {
        const apiError = error as { data?: { message?: string }; error?: string; status?: number };
        failed.push(
          `${item.sl_no}. ${item.name}: ${apiError.data?.message || apiError.error || `Request failed${apiError.status ? ` (${apiError.status})` : ''}`}`,
        );
      }
    }

    if (posted.length) {
      refetchSidebars();
    }

    if (failed.length) {
      setMessage({
        type: 'error',
        title: 'Some sidebar data was not added',
        details: [
          ...(posted.length ? [`Added: ${posted.join(', ')}`] : []),
          ...(skipped.length ? [`Skipped because already exists: ${skipped.join(', ')}`] : []),
          ...failed,
        ],
      });
      return;
    }

    setMessage({
      type: 'success',
      title: posted.length ? 'Sidebar data added successfully' : 'No new sidebar data needed',
      details: [
        ...(posted.length ? [`Added: ${posted.join(', ')}`] : []),
        ...(skipped.length ? [`Skipped because already exists: ${skipped.join(', ')}`] : []),
      ],
    });
  };

  return (
    <main className="min-h-screen p-4 text-slate-100 md:p-8 mt-20">
      <section className="mx-auto max-w-6xl space-y-4">
        <Accordion type="single" collapsible value={accordionValue} onValueChange={value => setAccordionValue(value)}>
          <AccordionItem value="add-sidebar" className="overflow-hidden rounded-md border border-white/10 bg-slate-950/80">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 sm:px-5">
              <AccordionTrigger className="min-w-0 flex-1 py-4 text-base font-semibold text-white hover:no-underline">
                <span className="flex items-center gap-2">
                  <ChevronDown className="size-4" />
                  Add Sidebar
                </span>
              </AccordionTrigger>
              <div className="flex shrink-0 items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleUpdateSidebarData} disabled={isLoading || isCheckingExisting}>
                  <Save className="mr-2 size-4" />
                  Update Sidebar Data
                </Button>
                <Button type="button" size="sm" onClick={handleOpenConfirm} disabled={isLoading || isCheckingExisting}>
                  {isLoading || isCheckingExisting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                  Add
                </Button>
              </div>
            </div>

            <AccordionContent className="space-y-4 p-3 sm:p-5">
              {message && (
                <Alert
                  className={
                    message.type === 'error' ? 'border-red-500/50 bg-red-500/10 text-red-100' : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                  }
                >
                  {message.type === 'error' ? <AlertCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
                  <AlertTitle>{message.title}</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {message.details.map(detail => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {sidebarItems.map((item, parentIndex) => (
                  <div key={`${parentIndex}-${item.name}`} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                    <div className="grid gap-3 lg:grid-cols-[4rem_1fr_1fr_12rem_auto]">
                      <div className="flex h-10 items-center text-sm font-bold text-sky-300">#{parentIndex + 1}</div>
                      <div className="space-y-2">
                        <Label>Parent Name</Label>
                        <Input
                          value={item.name}
                          onChange={event => updateParent(parentIndex, 'name', event.target.value)}
                          className="bg-slate-900/80 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Parent Path</Label>
                        <Input
                          value={item.path}
                          onChange={event => updateParent(parentIndex, 'path', event.target.value)}
                          className="bg-slate-900/80 font-mono text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Input
                          value={item.iconName}
                          onChange={event => updateParent(parentIndex, 'iconName', event.target.value)}
                          className="bg-slate-900/80 text-white"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeParent(parentIndex)}
                        aria-label={`Remove ${item.name || `parent ${parentIndex + 1}`}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3 border-l border-sky-400/20 pl-3">
                      {item.children.map((child, childIndex) => (
                        <div
                          key={`${parentIndex}-${childIndex}-${child.name}`}
                          className="grid gap-3 rounded-md bg-slate-900/60 p-3 lg:grid-cols-[4rem_1fr_1fr_12rem_auto]"
                        >
                          <div className="flex h-10 items-center text-sm font-bold text-amber-300">{childLabel(childIndex)}.</div>
                          <div className="space-y-2">
                            <Label>Sub Name</Label>
                            <Input
                              value={child.name}
                              onChange={event => updateChild(parentIndex, childIndex, 'name', event.target.value)}
                              className="bg-slate-950/80 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Sub Path</Label>
                            <Input
                              value={child.path}
                              onChange={event => updateChild(parentIndex, childIndex, 'path', event.target.value)}
                              className="bg-slate-950/80 font-mono text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Icon</Label>
                            <Input
                              value={child.iconName}
                              onChange={event => updateChild(parentIndex, childIndex, 'iconName', event.target.value)}
                              className="bg-slate-950/80 text-white"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mt-8"
                            onClick={() => removeChild(parentIndex, childIndex)}
                            aria-label={`Remove ${child.name || `sub sidebar ${childLabel(childIndex)}`}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}

                      <Button type="button" variant="outline" size="sm" onClick={() => addChild(parentIndex)} disabled={item.children.length >= 26}>
                        <Plus className="mr-2 size-4" />
                        Add Sub Sidebar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={addParent}>
                <Plus className="mr-2 size-4" />
                Add Parent Sidebar
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add sidebar demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will check existing sidebar data first, skip matching parent name and path, then send each new parent sidebar to /api/sidebars/v1 one by one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddSidebars} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Page;
