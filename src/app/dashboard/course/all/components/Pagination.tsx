/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Show 5 page numbers at a time
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Ensure startPage is not less than 1
    startPage = Math.max(1, startPage);

    return Array.from({ length: Math.min(maxPagesToShow, endPage - startPage + 1) }, (_, i) => startPage + i);
  };

  const renderPageButton = (page: number, isCurrent: boolean) => (
    <button
      key={`page-${page}`}
      onClick={() => onPageChange(page)}
      disabled={isCurrent} // Disable current page button
      className={`
        flex items-center justify-center h-10 w-10 rounded-md transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background
        ${
          isCurrent
            ? 'bg-slate-500/50 dark:bg-slate-900/70  text-secondary-foreground cursor-default' // Active: More opaque for light, original for dark
            : 'bg-transparent text-muted-foreground hover:bg-secondary/50 dark:hover:bg-secondary/20 hover:text-secondary-foreground cursor-pointer' // Inactive: More opaque hover for light, original for dark
        }
      `}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {page}
    </button>
  );

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers.length > 0 && pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  return (
    <div className="flex items-center justify-center w-full py-4 ">
      <nav className="flex items-center gap-1 rounded-lg shadow-sm dark:bg-card p-1.5 border-1">
        {/* Previous button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center justify-center h-10 w-10 rounded-md transition-colors
            text-muted-foreground
            hover:bg-secondary/50 dark:hover:bg-secondary/20 hover:text-secondary-foreground /* More opaque hover for light */
            disabled:bg-secondary/5 disabled:text-muted-foreground/5 /* More opaque disabled bg for light */
            dark:disabled:bg-secondary/5 dark:disabled:text-muted-foreground/5 /* Original disabled for dark */
            disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background
            cursor-pointer
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* First page button if needed */}
        {pageNumbers.length > 0 && pageNumbers[0] > 1 && renderPageButton(1, currentPage === 1)}

        {/* Start ellipsis */}
        {showStartEllipsis && <span className="flex items-center justify-center h-10 w-10 text-muted-foreground">...</span>}

        {/* Page numbers */}
        {pageNumbers.map(page => renderPageButton(page, currentPage === page))}

        {/* End ellipsis */}
        {showEndEllipsis && <span className="flex items-center justify-center h-10 w-10 text-muted-foreground">...</span>}

        {/* Last page button if needed */}
        {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages && renderPageButton(totalPages, currentPage === totalPages)}

        {/* Next button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center justify-center h-10 w-10 rounded-md transition-colors
            text-muted-foreground
            hover:bg-secondary/50 dark:hover:bg-secondary/20 hover:text-secondary-foreground /* More opaque hover for light */
            disabled:bg-secondary/5 disabled:text-muted-foreground/5 /* More opaque disabled bg for light */
            dark:disabled:bg-secondary/5 dark:disabled:text-muted-foreground/5 /* Original disabled for dark */
            disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background
            cursor-pointer
          `}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
