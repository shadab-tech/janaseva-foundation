import { FC, useMemo } from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showFirstLast?: boolean;
  showTotal?: boolean;
  className?: string;
  compact?: boolean;
  maxPageButtons?: number;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  showFirstLast = true,
  showTotal = true,
  className = '',
  compact = false,
  maxPageButtons = 5,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    const startPage = Math.max(1, currentPage - halfMaxButtons);
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      const newStartPage = Math.max(1, endPage - maxPageButtons + 1);
      
      if (newStartPage > 1) {
        pages.push(1);
        if (newStartPage > 2) pages.push('...');
      }

      for (let i = newStartPage; i <= endPage; i++) {
        pages.push(i);
      }
    } else {
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = useMemo(getPageNumbers, [currentPage, totalPages, maxPageButtons]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    onPageSizeChange?.(newPageSize);
  };

  const renderPageButton = (pageNumber: number | string, index: number) => {
    if (pageNumber === '...') {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-3 py-2 text-gray-500"
        >
          ...
        </span>
      );
    }

    const isCurrentPage = pageNumber === currentPage;
    return (
      <Button
        key={pageNumber}
        variant={isCurrentPage ? 'primary' : 'outline'}
        size={compact ? 'sm' : 'md'}
        onClick={() => onPageChange(pageNumber as number)}
        className={compact ? 'min-w-[32px]' : 'min-w-[40px]'}
      >
        {pageNumber}
      </Button>
    );
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-center justify-between gap-4
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {showTotal && (
          <span className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
          </span>
        )}
        {showPageSize && (
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="
              rounded-md border-gray-300 text-sm
              focus:border-red-500 focus:ring-red-500
            "
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showFirstLast && (
          <Button
            variant="outline"
            size={compact ? 'sm' : 'md'}
            onClick={() => onPageChange(1)}
            disabled={isFirstPage}
          >
            First
          </Button>
        )}

        <Button
          variant="outline"
          size={compact ? 'sm' : 'md'}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map(renderPageButton)}
        </div>

        <Button
          variant="outline"
          size={compact ? 'sm' : 'md'}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          Next
        </Button>

        {showFirstLast && (
          <Button
            variant="outline"
            size={compact ? 'sm' : 'md'}
            onClick={() => onPageChange(totalPages)}
            disabled={isLastPage}
          >
            Last
          </Button>
        )}
      </div>
    </div>
  );
};

// Simple pagination for mobile or compact views
export const SimplePagination: FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        Previous
      </Button>

      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
