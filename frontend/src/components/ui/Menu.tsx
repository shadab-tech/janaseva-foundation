import { FC, ReactNode, useRef, useState, useEffect } from 'react';
import { Portal } from './Portal';
import { Transition } from './Transition';

interface MenuProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  className?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface MenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
}

export const Menu: FC<MenuProps> = ({
  trigger,
  children,
  placement = 'bottom',
  offset = 8,
  className = '',
  disabled = false,
  closeOnClick = true,
  closeOnOutsideClick = true,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - menuRect.height - offset;
        left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
        left = triggerRect.left - menuRect.width - offset;
        break;
    }

    // Ensure menu stays within viewport
    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal containment
    if (left < padding) {
      left = padding;
    } else if (left + menuRect.width > viewportWidth - padding) {
      left = viewportWidth - menuRect.width - padding;
    }

    // Vertical containment
    if (top < padding) {
      top = padding;
    } else if (top + menuRect.height > viewportHeight - padding) {
      top = viewportHeight - menuRect.height - padding;
    }

    setPosition({ top, left });
  };

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
    requestAnimationFrame(updatePosition);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !triggerRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        handleClose();
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

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      >
        {trigger}
      </div>
      <Portal containerId="menu-root">
        <Transition show={isOpen}>
          <div
            ref={menuRef}
            className={`
              fixed z-50 min-w-[12rem] py-1
              bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5
              ${className}
            `}
            style={{
              top: position.top,
              left: position.left,
            }}
            onClick={() => closeOnClick && handleClose()}
          >
            {children}
          </div>
        </Transition>
      </Portal>
    </>
  );
};

export const MenuItem: FC<MenuItemProps> = ({
  children,
  icon,
  onClick,
  disabled = false,
  danger = false,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
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
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  );
};

export const MenuDivider: FC = () => (
  <div className="h-px my-1 bg-gray-200" role="separator" />
);

export const MenuGroup: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div role="group" aria-labelledby={`menu-group-${label}`}>
    <div
      id={`menu-group-${label}`}
      className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider"
    >
      {label}
    </div>
    {children}
  </div>
);

export default Menu;
