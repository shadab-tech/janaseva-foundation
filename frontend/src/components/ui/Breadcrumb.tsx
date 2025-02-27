import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  maxItems?: number;
  homeIcon?: boolean;
  onlyMobile?: boolean;
  renderItem?: (item: BreadcrumbItem, index: number) => ReactNode;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = '',
  maxItems = 0,
  homeIcon = true,
  onlyMobile = false,
  renderItem,
}) => {
  const HomeIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );

  const renderSeparator = (index: number) => {
    if (index === items.length - 1) return null;

    return (
      <div
        className="mx-2 text-gray-400"
        aria-hidden="true"
      >
        {separator}
      </div>
    );
  };

  const defaultRenderItem = (item: BreadcrumbItem, index: number) => {
    const isLast = index === items.length - 1;
    const isFirst = index === 0;

    const content = (
      <>
        {item.icon && (
          <span className="mr-1.5">{item.icon}</span>
        )}
        {isFirst && homeIcon && !item.icon ? (
          <HomeIcon />
        ) : (
          <span>{item.label}</span>
        )}
      </>
    );

    if (isLast) {
      return (
        <span
          className="text-gray-900 font-medium"
          aria-current="page"
        >
          {content}
        </span>
      );
    }

    if (item.onClick) {
      return (
        <button
          onClick={item.onClick}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {content}
        </button>
      );
    }

    if (item.href) {
      return (
        <Link
          href={item.href}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {content}
        </Link>
      );
    }

    return (
      <span className="text-gray-500">
        {content}
      </span>
    );
  };

  const renderItems = () => {
    let displayItems = [...items];

    if (maxItems > 0 && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-Math.floor(maxItems / 2));
      displayItems = [
        firstItem,
        { label: '...', href: undefined },
        ...lastItems,
      ];
    }

    return displayItems.map((item, index) => (
      <li
        key={index}
        className="flex items-center"
      >
        {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
        {renderSeparator(index)}
      </li>
    ));
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`
        ${onlyMobile ? 'sm:hidden' : ''}
        ${className}
      `}
    >
      <ol className="flex items-center text-sm">
        {renderItems()}
      </ol>
    </nav>
  );
};

// Dynamic Breadcrumb that generates items from the current route
interface DynamicBreadcrumbProps extends Omit<BreadcrumbProps, 'items'> {
  labelMap?: Record<string, string>;
  excludePaths?: string[];
  transformLabel?: (segment: string) => string;
}

export const DynamicBreadcrumb: FC<DynamicBreadcrumbProps> = ({
  separator,
  className,
  maxItems,
  homeIcon = true,
  onlyMobile = false,
  labelMap = {},
  excludePaths = [],
  transformLabel,
  renderItem,
}) => {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(Boolean);
  
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...pathSegments
      .filter(segment => !excludePaths.includes(segment))
      .map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const label = labelMap[segment] || 
          (transformLabel ? transformLabel(segment) : 
            segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));
        return { label, href: path };
      }),
  ];

  return (
    <Breadcrumb
      items={items}
      separator={separator}
      className={className}
      maxItems={maxItems}
      homeIcon={homeIcon}
      onlyMobile={onlyMobile}
      renderItem={renderItem}
    />
  );
};

// Helper component for responsive breadcrumbs
interface ResponsiveBreadcrumbProps extends BreadcrumbProps {
  mobileMaxItems?: number;
}

export const ResponsiveBreadcrumb: FC<ResponsiveBreadcrumbProps> = ({
  mobileMaxItems = 2,
  maxItems,
  ...props
}) => {
  return (
    <>
      <Breadcrumb
        {...props}
        maxItems={mobileMaxItems}
        className="sm:hidden"
      />
      <Breadcrumb
        {...props}
        maxItems={maxItems}
        className="hidden sm:block"
      />
    </>
  );
};

export default Breadcrumb;
