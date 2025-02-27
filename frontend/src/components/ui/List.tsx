import { FC, ReactNode, Fragment } from 'react';

type ListLayout = 'list' | 'grid' | 'horizontal';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  layout?: ListLayout;
  className?: string;
  itemClassName?: string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  loadingPlaceholderCount?: number;
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg';
  dividers?: boolean;
  onItemClick?: (item: T) => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  layout = 'list',
  className = '',
  itemClassName = '',
  loading = false,
  error,
  emptyMessage = 'No items to display',
  loadingPlaceholderCount = 3,
  gridCols = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
  gap = 'md',
  dividers = false,
  onItemClick,
  header,
  footer,
}: ListProps<T>) {
  const gapStyles = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const gridColStyles = {
    sm: `grid-cols-${gridCols.sm}`,
    md: `md:grid-cols-${gridCols.md}`,
    lg: `lg:grid-cols-${gridCols.lg}`,
    xl: `xl:grid-cols-${gridCols.xl}`,
  };

  const layoutStyles = {
    list: 'flex flex-col',
    grid: `grid ${gridColStyles.sm} ${gridColStyles.md} ${gridColStyles.lg} ${gridColStyles.xl}`,
    horizontal: 'flex flex-row overflow-x-auto',
  };

  const renderLoadingPlaceholders = () => {
    return Array.from({ length: loadingPlaceholderCount }).map((_, index) => (
      <div
        key={`placeholder-${index}`}
        className={`
          animate-pulse bg-gray-200 rounded
          ${layout === 'list' ? 'h-16' : 'aspect-square'}
        `}
      />
    ));
  };

  const renderContent = () => {
    if (loading) {
      return renderLoadingPlaceholders();
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return items.map((item, index) => (
      <Fragment key={keyExtractor(item)}>
        <div
          className={`
            ${itemClassName}
            ${onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            ${dividers && layout === 'list' && index !== items.length - 1
              ? 'border-b border-gray-200'
              : ''
            }
          `}
          onClick={() => onItemClick?.(item)}
        >
          {renderItem(item, index)}
        </div>
      </Fragment>
    ));
  };

  return (
    <div className={className}>
      {header && (
        <div className="mb-4">{header}</div>
      )}

      <div className={`
        ${layoutStyles[layout]}
        ${gapStyles[gap]}
      `}>
        {renderContent()}
      </div>

      {footer && (
        <div className="mt-4">{footer}</div>
      )}
    </div>
  );
}

// Helper components for common list layouts
interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  secondaryText?: string;
  trailing?: ReactNode;
}

export const ListItem: FC<ListItemProps> = ({
  children,
  className = '',
  onClick,
  selected = false,
  disabled = false,
  icon,
  secondaryText,
  trailing,
}) => {
  return (
    <div
      className={`
        flex items-center px-4 py-3
        ${onClick && !disabled ? 'cursor-pointer hover:bg-gray-50' : ''}
        ${selected ? 'bg-red-50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <div className="mr-3 text-gray-400">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {children}
        </div>
        {secondaryText && (
          <div className="text-sm text-gray-500 truncate">
            {secondaryText}
          </div>
        )}
      </div>
      {trailing && (
        <div className="ml-3">
          {trailing}
        </div>
      )}
    </div>
  );
};

interface GridItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  aspectRatio?: '1/1' | '4/3' | '16/9';
  overlay?: ReactNode;
}

export const GridItem: FC<GridItemProps> = ({
  children,
  className = '',
  onClick,
  selected = false,
  disabled = false,
  aspectRatio = '1/1',
  overlay,
}) => {
  const aspectRatioStyles = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        ${aspectRatioStyles[aspectRatio]}
        ${onClick && !disabled ? 'cursor-pointer hover:opacity-90' : ''}
        ${selected ? 'ring-2 ring-red-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
};

export default List;
