import { useState, useMemo, useCallback } from 'react';
import Table from './Table';
import Pagination from './Pagination';
import Input from './Input';
import Select from './Select';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  filterOptions?: { label: string; value: string }[];
}

interface DataGridProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Partial<Record<keyof T, string>>) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  rowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedRows?: string[];
  onRowSelect?: (id: string, selected: boolean) => void;
  keyExtractor?: (item: T) => string;
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  showToolbar?: boolean;
  showPagination?: boolean;
  showSearch?: boolean;
}

export function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  onSort,
  onFilter,
  loading = false,
  error,
  className = '',
  rowClassName,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  keyExtractor = (item: T) => (item.id as string) || '',
  toolbar,
  emptyMessage = 'No data available',
  showToolbar = true,
  showPagination = true,
  showSearch = true,
}: DataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = useCallback((key: keyof T) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  }, [sortConfig, onSort]);

  const handleFilter = useCallback((key: keyof T, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
  }, [filters, onFilter]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      result = result.filter(item =>
        columns.some(column => {
          const value = item[column.key];
          return value && String(value).match(searchRegex);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => String(item[key as keyof T]) === value);
      }
    });

    // Apply sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig, columns]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, currentPageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  }, [onPageChange]);

  const handlePageSizeChange = useCallback((size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
    onPageSizeChange?.(size);
  }, [onPageSizeChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          {showSearch && (
            <div className="flex-1 max-w-xs">
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {columns
              .filter(column => column.filterable)
              .map(column => (
                <Select
                  key={String(column.key)}
                  value={filters[column.key] || ''}
                  onChange={value => handleFilter(column.key, value)}
                  options={[
                    { label: `All ${column.header}`, value: '' },
                    ...(column.filterOptions || []),
                  ]}
                  className="w-40"
                />
              ))}
          </div>
          {toolbar}
        </div>
      )}

      <Table
        data={paginatedData}
        columns={columns.map(column => ({
          ...column,
          onSort: column.sortable ? () => handleSort(column.key) : undefined,
          sortDirection:
            sortConfig?.key === column.key ? sortConfig.direction : undefined,
        }))}
        loading={loading}
        error={error}
        rowClassName={rowClassName}
        onRowClick={onRowClick}
        selectedRows={selectedRows}
        onRowSelect={onRowSelect}
        keyExtractor={keyExtractor}
        emptyMessage={emptyMessage}
      />

      {showPagination && (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <Select
              value={currentPageSize.toString()}
              onChange={value => handlePageSizeChange(Number(value))}
              options={pageSizeOptions.map(size => ({
                label: size.toString(),
                value: size.toString(),
              }))}
              className="w-20"
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredData.length}
            pageSize={currentPageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default DataGrid;
