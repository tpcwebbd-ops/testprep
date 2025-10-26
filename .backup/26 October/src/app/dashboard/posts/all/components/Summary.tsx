'use client';

import { useState } from 'react';
import { Loader2, TrendingUp, BarChart3, PieChart } from 'lucide-react';

import { useGetPostsSummaryQuery } from '@/redux/features/posts/postsSlice';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
 
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, PieLabelRenderProps } from 'recharts';

interface SummaryData {
  overall: {
    totalRecords: number;
    recordsLast24Hours: number;
    recordsLastMonth: number;
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

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#ec4899', '#06b6d4'];

const PostsSummary = () => {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'bar' | 'pie'>('table');
  const limit = 10;

  const { data, isLoading, isError, isFetching } = useGetPostsSummaryQuery({ page, limit }, { skip: !isDialogOpen });

  const summaryData: SummaryData | undefined = data?.data;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (summaryData?.pagination?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const tableHeaders = summaryData?.monthlyTable?.[0] ? Object.keys(summaryData.monthlyTable[0]) : [];

  const summaryKeys = summaryData?.tableSummary ? Object.keys(summaryData.tableSummary).filter(key => key !== 'totalMonths') : [];

  // Prepare chart data
  const barChartData =
    summaryData?.monthlyTable?.map(row => {
      const formattedRow: Record<string, number | string> = {};
      Object.keys(row).forEach(key => {
        formattedRow[key] = typeof row[key] === 'number' ? row[key] : row[key];
      });
      return formattedRow;
    }) || [];

  const pieChartData = summaryData?.tableSummary
    ? summaryKeys.map(key => ({
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: summaryData.tableSummary![key] as number,
      }))
    : [];

  const overallStatsData = [
    { name: 'Total Records', value: summaryData?.overall.totalRecords || 0 },
    { name: 'Last 24 Hours', value: summaryData?.overall.recordsLast24Hours || 0 },
    { name: 'Last Month', value: summaryData?.overall.recordsLastMonth || 0 },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outlineWater" size="sm" className="text-white">
          <TrendingUp className="mr-2 h-4 w-4" />
          Summary
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-6xl max-h-[85vh] mt-8 overflow-y-auto rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-xl text-white transition-all">
        <DialogHeader>
          <DialogTitle>Posts Summary</DialogTitle>
          <DialogDescription className="text-white/70">Overview of posts data aggregated by month.</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {isError && <div className="text-center text-red-300 p-12">Failed to load summary data.</div>}

        {!isLoading && !isError && summaryData && (
          <div className="grid gap-4">
            {/* Core Stats */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl shadow-lg text-white">
              <CardHeader>
                <CardTitle>Creation Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Total Records:</span>
                  <strong>{summaryData.overall.totalRecords ?? 'N/A'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Last 24 Hours:</span>
                  <strong>{summaryData.overall.recordsLast24Hours ?? 'N/A'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Last Month:</span>
                  <strong>{summaryData.overall.recordsLastMonth ?? 'N/A'}</strong>
                </div>
              </CardContent>
            </Card>

            {/* Overall Stats Chart */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl shadow-lg text-white">
              <CardHeader>
                <CardTitle>Overall Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={overallStatsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grand Total Summary */}
            {summaryData.tableSummary && (
              <Card className="border-white/20 bg-white/10 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <CardTitle>Grand Total Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Months:</span>
                        <strong>{summaryData.tableSummary.totalMonths}</strong>
                      </div>
                      {summaryKeys.map(key => (
                        <div key={key} className="flex justify-between">
                          <span className="text-white/60">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <strong>{summaryData.tableSummary![key]}</strong>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: PieLabelRenderProps) => {
                            const name = props.name as string;
                            const percent = props.percent as number;
                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                          }}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white',
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monthly Data with View Toggle */}
            {summaryData.monthlyTable && (
              <Card className="border-white/20 bg-white/10 backdrop-blur-xl shadow-lg text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Monthly Data</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant={viewMode === 'table' ? 'default' : 'ghost'} onClick={() => setViewMode('table')} className="h-8 text-white">
                        Table
                      </Button>
                      <Button size="sm" variant={viewMode === 'bar' ? 'default' : 'ghost'} onClick={() => setViewMode('bar')} className="h-8 text-white">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant={viewMode === 'pie' ? 'default' : 'ghost'} onClick={() => setViewMode('pie')} className="h-8 text-white">
                        <PieChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`relative ${isFetching ? 'opacity-50' : ''}`}>
                    {isFetching && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg backdrop-blur-sm z-10">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}

                    {viewMode === 'table' && (
                      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl overflow-hidden">
                        <Table className="text-white">
                          <TableHeader className="bg-white/10">
                            <TableRow>
                              {tableHeaders.map(header => (
                                <TableHead key={header} className="text-white whitespace-nowrap">
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
                            {summaryData.monthlyTable.length > 0 ? (
                              summaryData.monthlyTable.map((row, index) => (
                                <TableRow key={index} className="hover:bg-white/10 transition-colors">
                                  {tableHeaders.map(header => (
                                    <TableCell key={header} className="text-white/90">
                                      {row[header]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="h-24 text-center text-white/70">
                                  No monthly data to display.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {viewMode === 'bar' && (
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey={tableHeaders[0]} stroke="rgba(255,255,255,0.7)" angle={-45} textAnchor="end" height={80} />
                          <YAxis stroke="rgba(255,255,255,0.7)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px',
                              color: 'white',
                            }}
                          />
                          <Legend />
                          {tableHeaders.slice(1).map((header, index) => (
                            <Bar key={header} dataKey={header} fill={COLORS[index % COLORS.length]} radius={[8, 8, 0, 0]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {viewMode === 'pie' && barChartData.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tableHeaders.slice(1).map((header) => {
                          const chartData = barChartData
                            .map(row => ({
                              name: String(row[tableHeaders[0]]),
                              value: Number(row[header]) || 0,
                            }))
                            .filter(item => item.value > 0);

                          return (
                            <div key={header} className="border border-white/10 rounded-lg p-4 bg-white/5">
                              <h3 className="text-sm font-medium mb-2 text-center">{header.replace(/([A-Z])/g, ' $1').trim()}</h3>
                              <ResponsiveContainer width="100%" height={200}>
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
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {chartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: 'rgba(0,0,0,0.8)',
                                      border: '1px solid rgba(255,255,255,0.2)',
                                      borderRadius: '8px',
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

        {/* Pagination */}
        <DialogFooter>
          {summaryData?.pagination && summaryData.pagination.totalPages > 1 && (
            <Pagination className="text-white">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    className={cn('border-white/20 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20', page <= 1 && 'pointer-events-none opacity-50')}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive className="border-white/20 bg-white/20 backdrop-blur-xl text-white">
                    Page {page} of {summaryData.pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    className={cn(
                      'border-white/20 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20',
                      page >= summaryData.pagination.totalPages && 'pointer-events-none opacity-50',
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostsSummary;