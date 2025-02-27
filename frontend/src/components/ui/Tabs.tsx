import { FC, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  urlSync?: boolean;
  urlParam?: string;
  vertical?: boolean;
  mobileAccordion?: boolean;
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  urlSync = false,
  urlParam = 'tab',
  vertical = false,
  mobileAccordion = false,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Sync with URL if enabled
  useEffect(() => {
    if (urlSync) {
      const tabFromUrl = router.query[urlParam] as string;
      if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    }
  }, [router.query, urlParam, urlSync, tabs]);

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;

    setActiveTab(tabId);
    onChange?.(tabId);

    if (urlSync) {
      const newQuery = { ...router.query, [urlParam]: tabId };
      router.push({ query: newQuery }, undefined, { shallow: true });
    }

    if (mobileAccordion) {
      setOpenAccordion(openAccordion === tabId ? null : tabId);
    }
  };

  const variantStyles = {
    default: {
      list: 'border-b border-gray-200',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 font-medium text-sm
        ${isActive
          ? 'border-red-500 text-red-600 border-b-2'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
    pills: {
      list: 'space-x-2',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-3 py-1.5 font-medium text-sm rounded-full
        ${isActive
          ? 'bg-red-100 text-red-600'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
    underline: {
      list: '',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-1 py-2 font-medium text-sm border-b-2
        ${isActive
          ? 'border-red-500 text-red-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const renderTabs = () => (
    <div
      className={`
        ${vertical ? 'flex' : ''}
        ${className}
      `}
    >
      <div
        className={`
          ${vertical ? 'flex-shrink-0 mr-6' : ''}
          ${mobileAccordion ? 'sm:block hidden' : ''}
        `}
      >
        <nav
          className={`
            ${variantStyles[variant].list}
            ${vertical ? 'flex-col space-y-2' : 'flex'}
            ${fullWidth ? 'w-full' : ''}
          `}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex items-center
                ${variantStyles[variant].tab(activeTab === tab.id, !!tab.disabled)}
                ${sizeStyles[size]}
                ${fullWidth ? 'flex-1' : ''}
              `}
              disabled={tab.disabled}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && <span className="ml-2">{tab.badge}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Accordion */}
      {mobileAccordion && (
        <div className="sm:hidden">
          {tabs.map((tab) => (
            <div key={tab.id} className="border-b">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`
                  w-full px-4 py-3 flex items-center justify-between
                  ${activeTab === tab.id ? 'text-red-600' : 'text-gray-700'}
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={tab.disabled}
              >
                <div className="flex items-center">
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                  {tab.badge && <span className="ml-2">{tab.badge}</span>}
                </div>
                <svg
                  className={`
                    w-5 h-5 transform transition-transform
                    ${openAccordion === tab.id ? 'rotate-180' : ''}
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openAccordion === tab.id && (
                <div className="px-4 py-3 bg-gray-50">
                  {tab.content}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className={`${vertical ? 'flex-1' : ''} ${mobileAccordion ? 'hidden sm:block' : ''}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
            role="tabpanel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );

  return renderTabs();
};

export default Tabs;
