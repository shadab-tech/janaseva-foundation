import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Portal } from './Portal';
import { Scale } from './Transition';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  width?: 'auto' | 'trigger' | number;
  className?: string;
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;
  offset?: number;
}

export const Dropdown: FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  width = 'auto',
  className = '',
  closeOnClick = true,
  closeOnOutsideClick = true,
  offset = 4,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Update dropdown position when trigger element moves
  const updatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = width === 'trigger' 
      ? triggerRect.width 
      : typeof width === 'number' 
        ? width 
        : undefined;

    let left = align === 'left' 
      ? triggerRect.left 
      : triggerRect.right - (dropdownWidth || 0);

    // Ensure dropdown doesn't go off screen
    if (dropdownWidth && left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 8;
    }
    if (left < 8) left = 8;

    setPosition({
      top: triggerRect.bottom + offset,
      left,
    });
  };

  // Handle click outside
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !triggerRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnOutsideClick]);

  // Update position on scroll or resize
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Update position when opening
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleContentClick = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      <Portal containerId="dropdown-root">
        <Scale show={isOpen}>
          <div
            ref={dropdownRef}
            className={`
              fixed z-50 mt-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
              ${className}
            `}
            style={{
              top: position.top,
              left: position.left,
              width: width === 'auto' ? 'auto' : width === 'trigger' ? undefined : width,
              minWidth: 'max-content',
            }}
            onClick={handleContentClick}
          >
            {children}
          </div>
        </Scale>
      </Portal>
    </>
  );
};

// Dropdown Menu Components
export const DropdownMenu: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`py-1 ${className}`} role="menu">
    {children}
  </div>
);

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  danger?: boolean;
}

export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  danger = false,
}) => (
  <button
    className={`
      w-full text-left px-4 py-2 text-sm
      ${disabled
        ? 'text-gray-400 cursor-not-allowed'
        : danger
          ? 'text-red-600 hover:bg-red-50 focus:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50 focus:bg-gray-50'
      }
      focus:outline-none
      ${className}
    `}
    onClick={disabled ? undefined : onClick}
    role="menuitem"
    disabled={disabled}
  >
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </div>
  </button>
);

export const DropdownDivider: FC = () => (
  <div className="h-px my-1 bg-gray-200" role="separator" />
);

export default Dropdown;
