/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/

'use client';
import { useGetFinanceOverviewQuery } from '../all/redux/rtk-api';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
// 1. Import the Taka icon
import { TbCurrencyTaka } from 'react-icons/tb';
import {
  DollarSign,
  CreditCard,
  BadgePercent,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Hash,
  AlertCircle,
  CalendarClock,
  CalendarX2,
  Sparkles,
  BarChartBig,
} from 'lucide-react';

// 2. Update the `value` prop type from `string` to `ReactNode`
interface StatCardProps {
  title: string;
  value: React.ReactNode; // Changed from string to ReactNode
  icon: ReactNode;
  color: string;
}

// Reusable Glassmorphism Statistic Card Component
// No changes needed here, it already handles ReactNode correctly.
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <motion.div
    className="relative w-full p-6 overflow-hidden border rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shadow-lg"
    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,255,255,0.2)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-200">{title}</p>
        {/* This <p> tag can now render strings, numbers, or JSX elements */}
        <p className="flex items-center text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// Skeleton Loader Component for a better user experience
const StatCardSkeleton: React.FC = () => (
  <div className="w-full p-6 border rounded-2xl bg-white/10 backdrop-blur-md border-white/20">
    <div className="flex items-center justify-between animate-pulse">
      <div>
        <div className="w-24 h-4 mb-2 bg-gray-500 rounded"></div>
        <div className="w-32 h-8 bg-gray-400 rounded"></div>
      </div>
      <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
    </div>
  </div>
);

// Main Overview Page Component
const FinanceOverviewPage: React.FC = () => {
  const { data, isLoading, isError } = useGetFinanceOverviewQuery();

  // 3. Update the function to return JSX, not a string.
  const formatCurrency = (amount: number = 0): React.ReactNode => {
    // Format the number with commas and decimal places
    const formattedAmount = new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return (
      <span className="flex items-center">
        <TbCurrencyTaka className="mr-0" style={{ width: '30px', height: '30px' }} /> {formattedAmount}
      </span>
    );
  };

  // Memoize the card data. No changes needed here as string is a valid ReactNode.
  const { overallStats, lastMonthStats, currentMonthStats } = React.useMemo<{
    overallStats: StatCardProps[];
    lastMonthStats: StatCardProps[];
    currentMonthStats: StatCardProps[];
  }>(() => {
    if (!data) {
      return { overallStats: [], lastMonthStats: [], currentMonthStats: [] };
    }

    const overall: StatCardProps[] = [
      { title: 'Total Payment', value: formatCurrency(data.totalPayment), icon: <DollarSign size={24} className="text-white" />, color: '#10b981' },
      { title: 'Total Due', value: formatCurrency(data.totalDue), icon: <CreditCard size={24} className="text-white" />, color: '#ef4444' },
      { title: 'Total Discount', value: formatCurrency(data.totalDiscount), icon: <BadgePercent size={24} className="text-white" />, color: '#3b82f6' },
      // Note: This still works because a string is a valid ReactNode
      {
        title: 'Total Transactions',
        value: data.totalTransactions.toLocaleString(),
        icon: <ArrowRightLeft size={24} className="text-white" />,
        color: '#f97316',
      },
    ];

    const lastMonth: StatCardProps[] = [
      { title: 'Last Month Payment', value: formatCurrency(data.lastMonthPayment), icon: <TrendingUp size={24} className="text-white" />, color: '#10b981' },
      { title: 'Last Month Due', value: formatCurrency(data.lastMonthDue), icon: <TrendingDown size={24} className="text-white" />, color: '#ef4444' },
      { title: 'Last Month Discount', value: formatCurrency(data.lastMonthDiscount), icon: <Clock size={24} className="text-white" />, color: '#3b82f6' },
      {
        title: 'Last Month Transactions',
        value: data.lastMonthTransactions.toLocaleString(),
        icon: <Hash size={24} className="text-white" />,
        color: '#f97316',
      },
    ];

    const currentMonth: StatCardProps[] = [
      {
        title: 'Current Month Payment',
        value: formatCurrency(data.currentMonthPayment),
        icon: <CalendarClock size={24} className="text-white" />,
        color: '#8b5cf6',
      },
      { title: 'Current Month Due', value: formatCurrency(data.currentMonthDue), icon: <CalendarX2 size={24} className="text-white" />, color: '#db2777' },
      {
        title: 'Current Month Discount',
        value: formatCurrency(data.currentMonthDiscount),
        icon: <Sparkles size={24} className="text-white" />,
        color: '#d97706',
      },
      {
        title: 'Current Month Transactions',
        value: data.currentMonthTransactions.toLocaleString(),
        icon: <BarChartBig size={24} className="text-white" />,
        color: '#0ea5e9',
      },
    ];

    return { overallStats: overall, lastMonthStats: lastMonth, currentMonthStats: currentMonth };
  }, [data]);

  // The rest of the component JSX remains the same
  return (
    <div className="min-h-screen p-4 text-white sm:p-6 md:p-8 bg-gradient-to-br from-gray-900 to-slate-800">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Finance Overview</h1>
          <p className="text-gray-400">A complete summary of your financial metrics.</p>
        </motion.div>

        {isError && (
          <div className="flex items-center justify-center p-6 mt-8 text-red-300 bg-red-900/20 rounded-xl">
            <AlertCircle className="w-8 h-8 mr-4" />
            <p className="text-lg">An error occurred while fetching the overview data. Please try again later.</p>
          </div>
        )}

        {/* Current Month Statistics Section */}
        <div className="py-8">
          <h2 className="mb-6 text-2xl font-semibold">Current Month Statistics (September 2025)</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
              : currentMonthStats.map((stat, index) => (
                  <motion.div key={`current-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <StatCard {...stat} />
                  </motion.div>
                ))}
          </div>
        </div>

        {/* Last Month Performance Section */}
        <div className="py-8">
          <h2 className="mb-6 text-2xl font-semibold">Last Month Performance (August 2025)</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
              : lastMonthStats.map((stat, index) => (
                  <motion.div
                    key={`lastMonth-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 4) * 0.1 }}
                  >
                    <StatCard {...stat} />
                  </motion.div>
                ))}
          </div>
        </div>

        {/* Overall Statistics Section */}
        <div className="py-8">
          <h2 className="mb-6 text-2xl font-semibold">Overall Statistics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
              : overallStats.map((stat, index) => (
                  <motion.div key={`overall-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index + 8) * 0.1 }}>
                    <StatCard {...stat} />
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverviewPage;
