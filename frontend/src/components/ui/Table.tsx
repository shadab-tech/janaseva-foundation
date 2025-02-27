import { FC, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface Column<T> {
  key: keyof T | string;
  header: ReactNode;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
  className?: string;
  stickyHeader?: boolean;
  compact?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  loading = false,
  error,
  emptyMessage = 'No data available',
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  rowClassName,
  className = '',
  stickyHeader = false,
  compact = false,
  striped = false,
  bordered = false,
  hoverable = false,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
}: TableProps<T>) {
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortColumn === column.key;
    const Icon = () => (
      <svg
        className={`w-4 h-4 ml-1 transform transition-transform
          ${isActive && sortDirection === 'desc' ? 'rotate-180' : ''}
          ${isActive ? 'text-gray-900' : 'text-gray-400'}
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    );

    return <Icon />;
  };

  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key.toString());
    }
  };

  const handleSelectAll = () => {
    if (onSelectAll) {
      const allSelected = data.length === selectedRows.length;
      onSelectAll(!allSelected);
    }
  };

  const renderHeader = () => (
    <thead className={stickyHeader ? 'sticky top-0 bg-white z-10' : ''}>
      <tr>
        {selectable && (
          <th className={`${compact ? 'px-3 py-2' : 'px-6 py-3'}`}>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              checked={data.length > 0 && data.length === selectedRows.length}
              onChange={handleSelectAll}
            />
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column.key.toString()}
            className={`
              ${compact ? 'px-3 py-2' : 'px-6 py-3'}
              text-left text-xs font-medium text-gray-500 uppercase tracking-wider
              ${column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
              ${bordered ? 'border-b border-r border-gray-200' : 'border-b border-gray-200'}
              ${column.align === 'center' ? 'text-center' : ''}
              ${column.align === 'right' ? 'text-right' : ''}
            `}
            style={{ width: column.width }}
            onClick={() => handleHeaderClick(column)}
          >
            <div className="flex items-center">
              <span>{column.header}</span>
              {renderSortIcon(column)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    const key = column.key;
    const value = typeof key === 'string' ? item[key] : null;
    
    // Convert the value to a string for display
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const renderBody = () => (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item) => {
        const rowId = keyExtractor(item);
        return (
          <tr
            key={rowId}
            onClick={() => onRowClick?.(item)}
            className={`
              ${hoverable ? 'hover:bg-gray-50' : ''}
              ${striped ? 'even:bg-gray-50' : ''}
              ${onRowClick ? 'cursor-pointer' : ''}
              ${rowClassName?.(item) || ''}
            `}
          >
            {selectable && (
              <td className={`${compact ? 'px-3 py-2' : 'px-6 py-4'}`}>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  checked={selectedRows.includes(rowId)}
                  onChange={(e) => onRowSelect?.(rowId, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}
            {columns.map((column) => (
              <td
                key={column.key.toString()}
                className={`
                  ${compact ? 'px-3 py-2' : 'px-6 py-4'}
                  whitespace-nowrap text-sm text-gray-900
                  ${bordered ? 'border-r border-gray-200' : ''}
                  ${column.align === 'center' ? 'text-center' : ''}
                  ${column.align === 'right' ? 'text-right' : ''}
                `}
              >
                {renderCell(item, column)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );

  const renderEmpty = () => (
    <tr>
      <td
        colSpan={selectable ? columns.length + 1 : columns.length}
        className="px-6 py-8 text-center text-gray-500"
      >
        {emptyMessage}
      </td>
    </tr>
  );

  const renderError = () => (
    <tr>
      <td
        colSpan={selectable ? columns.length + 1 : columns.length}
        className="px-6 py-8 text-center text-red-500"
      >
        {error}
      </td>
    </tr>
  );

  const renderLoading = () => (
    <tr>
      <td
        colSpan={selectable ? columns.length + 1 : columns.length}
        className="px-6 py-8 text-center"
      >
        <LoadingSpinner text="Loading..." />
      </td>
    </tr>
  );

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`min-w-full divide-y divide-gray-200 ${bordered ? 'border border-gray-200' : ''}`}>
        {renderHeader()}
        <tbody className="bg-white divide-y divide-gray-200">
          {loading && renderLoading()}
          {error && renderError()}
          {!loading && !error && data.length === 0 && renderEmpty()}
          {!loading && !error && data.length > 0 && renderBody()}
        </tbody>
      </table>
    </div>
  );
}

// Helper components for common table elements
export const TableCell: FC<{
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className = '', align = 'left' }) => (
  <div
    className={`
      ${align === 'center' ? 'text-center' : ''}
      ${align === 'right' ? 'text-right' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

export const TableBadge: FC<{
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}> = ({ children, variant = 'info' }) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
      `}
    >
      {children}
    </span>
  );
};

export default Table;
