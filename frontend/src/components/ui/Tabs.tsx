import { FC, ReactNode, useState } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveIndex?: number;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  disabledTabClassName?: string;
  contentClassName?: string;
  variant?: 'underline' | 'pill';
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  defaultActiveIndex = 0,
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  disabledTabClassName = '',
  contentClassName = '',
  variant = 'underline',
  orientation = 'horizontal',
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  const variantClasses = {
    underline: 'border-b-2 border-transparent',
    pill: 'rounded-lg',
  };

  const orientationClasses = {
    horizontal: 'flex space-x-4',
    vertical: 'flex flex-col space-y-2',
  };

  return (
    <div className={`${orientation === 'vertical' ? 'flex' : ''} ${className}`}>
      <div className={orientationClasses[orientation]}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              px-4 py-2 text-sm font-medium text-left
              ${variantClasses[variant]}
              ${tab.disabled ? disabledTabClassName : ''}
              ${
                index === activeIndex
                  ? `text-blue-500 ${
                      variant === 'underline' ? 'border-blue-500' : 'bg-blue-100'
                    } ${activeTabClassName}`
                  : 'text-gray-500 hover:text-gray-700'
              }
              ${tabClassName}
            `}
            onClick={() => !tab.disabled && setActiveIndex(index)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`${orientation === 'vertical' ? 'ml-4' : 'mt-4'} ${contentClassName}`}>
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
