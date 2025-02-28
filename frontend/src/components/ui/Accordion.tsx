import { FC, ReactNode, useState } from 'react';

interface AccordionItem {
  title: string;
  content: ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  allowMultiple?: boolean;
  variant?: 'default' | 'borderless';
  transitionDuration?: number;
}

export const Accordion: FC<AccordionProps> = ({
  items,
  className = '',
  itemClassName = '',
  headerClassName = '',
  contentClassName = '',
  allowMultiple = false,
  variant = 'default',
  transitionDuration = 200,
}) => {
  const [openItems, setOpenItems] = useState<number[]>(
    items
      .map((item, index) => (item.isOpen ? index : -1))
      .filter(index => index !== -1)
  );

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => (prev.includes(index) ? [] : [index]));
    }
  };

  const variantClasses = {
    default: 'border border-gray-200 rounded-lg',
    borderless: '',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${variantClasses[variant]} ${itemClassName}`}
        >
          <button
            className={`
              w-full flex items-center justify-between px-4 py-3
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${headerClassName}
            `}
            onClick={() => !item.disabled && toggleItem(index)}
            disabled={item.disabled}
          >
            <div className="flex items-center">
              {item.icon && item.iconPosition === 'left' && (
                <span className="mr-2">{item.icon}</span>
              )}
              <span className="text-left">{item.title}</span>
              {item.icon && item.iconPosition === 'right' && (
                <span className="ml-2">{item.icon}</span>
              )}
            </div>
            <span
              className="transform transition-transform duration-200"
              style={{
                transform: openItems.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                transitionDuration: `${transitionDuration}ms`,
              }}
            >
              ▼
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-${transitionDuration}`}
            style={{
              maxHeight: openItems.includes(index) ? '1000px' : '0px',
              transitionDuration: `${transitionDuration}ms`,
            }}
          >
            <div className={`px-4 py-3 ${contentClassName}`}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
