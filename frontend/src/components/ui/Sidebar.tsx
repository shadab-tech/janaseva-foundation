import { FC, ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  items?: SidebarItem[];
  badge?: ReactNode;
  disabled?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
  width?: number;
  collapsedWidth?: number;
  position?: 'left' | 'right';
  theme?: 'light' | 'dark';
  showCollapseButton?: boolean;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Sidebar: FC<SidebarProps> = ({
  items,
  header,
  footer,
  collapsed = false,
  onCollapse,
  className = '',
  width = 256,
  collapsedWidth = 64,
  position = 'left',
  theme = 'light',
  showCollapseButton = true,
  breakpoint = 'lg',
}) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < breakpoints[breakpoint];
      setIsMobileView(mobile);
      if (mobile !== isMobileView) {
        setIsCollapsed(mobile);
        onCollapse?.(mobile);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint, isMobileView, onCollapse]);

  const themeStyles = {
    light: {
      background: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50',
      active: 'bg-red-50 text-red-600',
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-800',
      active: 'bg-red-900 text-red-200',
    },
  };

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const toggleSubmenu = (key: string) => {
    setOpenKeys(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const isItemActive = (item: SidebarItem): boolean => {
    if (item.href) {
      return router.pathname === item.href;
    }
    return item.items?.some(subItem => isItemActive(subItem)) ?? false;
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const active = isItemActive(item);
    const hasChildren = item.items && item.items.length > 0;
    const isOpen = openKeys.includes(item.key);

    const itemContent = (
      <div
        className={`
          flex items-center px-4 py-2 rounded-md cursor-pointer
          transition-colors duration-150 ease-in-out
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${active ? themeStyles[theme].active : themeStyles[theme].hover}
          ${level > 0 ? 'ml-4' : ''}
        `}
        onClick={() => {
          if (!item.disabled) {
            if (hasChildren) {
              toggleSubmenu(item.key);
            } else {
              item.onClick?.();
            }
          }
        }}
      >
        {item.icon && (
          <span className={`${!isCollapsed ? 'mr-3' : ''} text-lg`}>
            {item.icon}
          </span>
        )}
        {(!isCollapsed || level > 0) && (
          <span className="flex-1 truncate">{item.label}</span>
        )}
        {item.badge && !isCollapsed && (
          <span className="ml-2">{item.badge}</span>
        )}
        {hasChildren && !isCollapsed && (
          <svg
            className={`w-4 h-4 ml-2 transform transition-transform ${
              isOpen ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </div>
    );

    return (
      <div key={item.key} className="relative">
        {item.href ? (
          <Link href={item.href} className={item.disabled ? 'pointer-events-none' : ''}>
            {itemContent}
          </Link>
        ) : (
          itemContent
        )}
        {hasChildren && isOpen && !isCollapsed && (
          <div className="mt-1">
            {item.items?.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        flex flex-col h-full
        ${themeStyles[theme].background}
        ${themeStyles[theme].text}
        ${position === 'right' ? 'border-l' : 'border-r'}
        ${themeStyles[theme].border}
        transition-all duration-300 ease-in-out
        ${className}
      `}
      style={{ width: isCollapsed ? collapsedWidth : width }}
    >
      {header && (
        <div className="flex-shrink-0 p-4 border-b border-inherit">
          {header}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {items.map(item => renderItem(item))}
        </div>
      </div>

      {footer && (
        <div className="flex-shrink-0 p-4 border-t border-inherit">
          {footer}
        </div>
      )}

      {showCollapseButton && !isMobileView && (
        <button
          className={`
            absolute top-1/2 -translate-y-1/2
            ${position === 'right' ? '-left-3' : '-right-3'}
            w-6 h-6 rounded-full bg-white shadow-md
            flex items-center justify-center
            hover:bg-gray-50 focus:outline-none
            ${themeStyles[theme].border} border
          `}
          onClick={toggleCollapse}
        >
          <svg
            className={`w-4 h-4 transform transition-transform ${
              isCollapsed
                ? position === 'right' ? 'rotate-180' : ''
                : position === 'right' ? '' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
