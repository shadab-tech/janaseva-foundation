import { FC, ReactNode } from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  truncate?: boolean;
  maxItems?: number;
  collapsedIcon?: ReactNode;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  truncate = false,
  maxItems = 3,
  collapsedIcon = '...',
}) => {
  const shouldCollapse = truncate && items.length > maxItems;
  const visibleItems = shouldCollapse
    ? [
        items[0],
        { label: collapsedIcon, href: undefined, icon: undefined, active: false },
        ...items.slice(-(maxItems - 1)),
      ]
    : items;

  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 flex-wrap">
        {visibleItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={`
                  text-sm font-medium text-gray-500 hover:text-gray-700
                  transition-colors duration-200
                  ${itemClassName}
                  ${item.active ? activeItemClassName : ''}
                `}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ) : (
              <span
                className={`
                  text-sm font-medium text-gray-500
                  ${itemClassName}
                  ${item.active ? activeItemClassName : ''}
                `}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
