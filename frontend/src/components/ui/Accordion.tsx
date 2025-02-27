import { FC, ReactNode, useState, createContext, useContext } from 'react';
import { Transition } from './Transition';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  isItemOpen: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
  variant?: 'default' | 'bordered' | 'separated';
  onChange?: (openItems: string[]) => void;
}

export const Accordion: FC<AccordionProps> = ({
  children,
  defaultOpen = [],
  multiple = false,
  className = '',
  variant = 'default',
  onChange,
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      let newOpenItems: string[];

      if (multiple) {
        newOpenItems = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      } else {
        newOpenItems = prev.includes(id) ? [] : [id];
      }

      onChange?.(newOpenItems);
      return newOpenItems;
    });
  };

  const isItemOpen = (id: string) => openItems.includes(id);

  const variantStyles = {
    default: 'divide-y divide-gray-200',
    bordered: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
    separated: 'space-y-2',
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, isItemOpen }}>
      <div className={`${variantStyles[variant]} ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  title: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  showIcon?: boolean;
}

export const AccordionItem: FC<AccordionItemProps> = ({
  id,
  title,
  children,
  icon,
  disabled = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  showIcon = true,
}) => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }

  const { toggleItem, isItemOpen } = context;
  const isOpen = isItemOpen(id);

  const ChevronIcon = () => (
    <svg
      className={`w-5 h-5 transform transition-transform duration-200 ${
        isOpen ? 'rotate-180' : ''
      }`}
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
  );

  return (
    <div className={`${className}`}>
      <button
        onClick={() => !disabled && toggleItem(id)}
        className={`
          w-full flex items-center justify-between px-4 py-3
          text-left text-gray-900 hover:bg-gray-50
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${titleClassName}
        `}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <span className="font-medium">{title}</span>
        </div>
        {showIcon && <ChevronIcon />}
      </button>

      <Transition show={isOpen}>
        <div
          className={`
            px-4 pb-4 text-gray-600
            ${contentClassName}
          `}
        >
          {children}
        </div>
      </Transition>
    </div>
  );
};

// Controlled Accordion Item
interface ControlledAccordionItemProps extends Omit<AccordionItemProps, 'id'> {
  isOpen: boolean;
  onToggle: () => void;
}

export const ControlledAccordionItem: FC<ControlledAccordionItemProps> = ({
  isOpen,
  onToggle,
  ...props
}) => {
  const ChevronIcon = () => (
    <svg
      className={`w-5 h-5 transform transition-transform duration-200 ${
        isOpen ? 'rotate-180' : ''
      }`}
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
  );

  return (
    <div className={props.className}>
      <button
        onClick={() => !props.disabled && onToggle()}
        className={`
          w-full flex items-center justify-between px-4 py-3
          text-left text-gray-900 hover:bg-gray-50
          ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${props.titleClassName}
        `}
        disabled={props.disabled}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {props.icon && <span className="mr-3">{props.icon}</span>}
          <span className="font-medium">{props.title}</span>
        </div>
        {props.showIcon && <ChevronIcon />}
      </button>

      <Transition show={isOpen}>
        <div
          className={`
            px-4 pb-4 text-gray-600
            ${props.contentClassName}
          `}
        >
          {props.children}
        </div>
      </Transition>
    </div>
  );
};

export default Accordion;
