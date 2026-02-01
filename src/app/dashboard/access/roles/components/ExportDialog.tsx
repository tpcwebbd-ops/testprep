'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, Check, X, Columns } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IRoles } from '../store/data/data';

type HeaderItem = { key: string; label: string };

interface ExportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  headers: HeaderItem[];
  data: IRoles[];
  fileName: string;
}

const formatValueForExport = (value: unknown): string | number | boolean => {
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'object' && item !== null && 'name' in item) {
          return (item as { name: string }).name;
        }
        return String(item);
      })
      .join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return value as string | number | boolean;
};

const downloadFile = (data: Record<string, unknown>[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles Data');

  const maxWidths = data.reduce((acc: Record<string, number>, row) => {
    Object.keys(row).forEach(key => {
      const val = String(row[key] || '');
      acc[key] = Math.max(acc[key] || 10, val.length + 2);
    });
    return acc;
  }, {});

  worksheet['!cols'] = Object.values(maxWidths).map(w => ({ wch: w }));
  XLSX.writeFile(workbook, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
};

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onOpenChange, headers, data, fileName }) => {
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const allSelected = headers.reduce(
        (acc, header) => {
          acc[header.key] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setSelectedColumns(allSelected);
    }
  }, [isOpen, headers]);

  const handleCheckedChange = (key: string, isChecked: boolean) => {
    const currentlyCheckedCount = Object.values(selectedColumns).filter(Boolean).length;
    if (currentlyCheckedCount === 1 && !isChecked) return;

    setSelectedColumns(prev => ({
      ...prev,
      [key]: isChecked,
    }));
  };

  const handleExport = () => {
    const activeHeaders = headers.filter(h => selectedColumns[h.key]);

    const processedData = data.map(row => {
      const exportRow: Record<string, unknown> = {};
      activeHeaders.forEach(header => {
        const value = row[header.key as keyof IRoles];
        exportRow[header.label] = formatValueForExport(value);
      });
      return exportRow;
    });

    downloadFile(processedData, fileName);
    onOpenChange(false);
  };

  const toggleAll = (checked: boolean) => {
    const newState = headers.reduce(
      (acc, h) => {
        acc[h.key] = checked;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setSelectedColumns(newState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 text-white rounded-3xl shadow-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">Export Configuration</DialogTitle>
              <DialogDescription className="text-white/40 text-xs">Refine the data structure for your XLSX report</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 text-white/60">
              <Columns size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Select Columns</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => toggleAll(true)}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tighter"
              >
                Select All
              </button>
              <button
                onClick={() => toggleAll(false)}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-tighter"
              >
                Clear All
              </button>
            </div>
          </div>

          <ScrollArea className="h-[280px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <AnimatePresence mode="popLayout">
                {headers.map(header => {
                  const isSelected = !!selectedColumns[header.key];
                  return (
                    <motion.div
                      key={header.key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative flex items-center group p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isSelected ? 'bg-blue-500/10 border-blue-500/30 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                      }`}
                      onClick={() => handleCheckedChange(header.key, !isSelected)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-blue-500 border-blue-400' : 'bg-transparent border-white/20'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={4} className="text-white" />}
                        </div>
                        <Label className="text-sm font-medium cursor-pointer truncate flex-1">{header.label}</Label>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="p-6 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-bold transition-all"
          >
            <X className="mr-2 w-4 h-4" />
            Discard
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Download className="mr-2 w-4 h-4" />
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
