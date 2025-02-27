import { FC, ReactNode, useRef, useState, useEffect } from 'react';
import { Portal } from './Portal';

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  arrow?: boolean;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  openOnHover?: boolean;
  closeOnMouseLeave?: boolean;
  closeOnClick?: boolean;
  closeOnOutsideClick?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  delay?: number;
  interactive?: boolean;
  maxWidth?: number | string;
  showArrow?: boolean;
  arrowClassName?: string;
}

export const Popover: FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  offset = 8,
  arrow = true,
  className = '',
  triggerClassName = '',
  disabled = false,
  openOnHover = false,
  closeOnMouseLeave = true,
  closeOnClick = true,
  closeOnOutsideClick = true,
  onOpen,
  onClose,
  delay = 200,
  interactive = false,
  maxWidth = 320,
  showArrow = true,
  arrowClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const arrowSize = 8;

    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset - (arrow ? arrowSize : 0);
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        arrowTop = popoverRect.height;
        arrowLeft = popoverRect.width / 2 - arrowSize;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + offset + (arrow ? arrowSize : 0);
        arrowTop = popoverRect.height / 2 - arrowSize;
        arrowLeft = -arrowSize * 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset + (arrow ? arrowSize : 0);
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        arrowTop = -arrowSize * 2;
        arrowLeft = popoverRect.width / 2 - arrowSize;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - offset - (arrow ? arrowSize : 0);
        arrowTop = popoverRect.height / 2 - arrowSize;
        arrowLeft = popoverRect.width;
        break;
    }

    // Ensure popover stays within viewport
    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Horizontal containment
    if (left < padding) {
      arrowLeft += left - padding;
      left = padding;
    } else if (left + popoverRect.width > viewportWidth - padding) {
      const diff = left + popoverRect.width - (viewportWidth - padding);
      arrowLeft += diff;
      left -= diff;
    }

    // Vertical containment
    if (top < padding) {
      arrowTop += top - padding;
      top = padding;
    } else if (top + popoverRect.height > viewportHeight - padding) {
      const diff = top + popoverRect.height - (viewportHeight - padding);
      arrowTop += diff;
      top -= diff;
    }

    setPosition({ top, left });
    setArrowPosition({ top: arrowTop, left: arrowLeft });
  };

  const handleOpen = () => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      onOpen?.();
      requestAnimationFrame(updatePosition);
    }, openOnHover ? delay : 0);
  };

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      onClose?.();
    }, closeOnMouseLeave ? delay : 0);
  };

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !triggerRef.current?.contains(event.target as Node) &&
        !popoverRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnOutsideClick, onClose]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const arrowStyles = {
    top: {
      transform: 'rotate(180deg)',
      bottom: -8,
    },
    right: {
      transform: 'rotate(-90deg)',
      left: -8,
    },
    bottom: {
      transform: 'rotate(0deg)',
      top: -8,
    },
    left: {
      transform: 'rotate(90deg)',
      right: -8,
    },
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={triggerClassName}
        onClick={!openOnHover ? handleOpen : undefined}
        onMouseEnter={openOnHover ? handleOpen : undefined}
        onMouseLeave={openOnHover && closeOnMouseLeave ? handleClose : undefined}
      >
        {trigger}
      </div>
      {isOpen && (
        <Portal containerId="popover-root">
          <div
            ref={popoverRef}
            className={`
              fixed z-50 bg-white rounded-md shadow-lg
              ${interactive ? '' : 'pointer-events-none'}
              ${className}
              transition-opacity duration-200 ease-in-out
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              top: position.top,
              left: position.left,
              maxWidth,
            }}
            onMouseEnter={openOnHover && interactive ? handleOpen : undefined}
            onMouseLeave={openOnHover && closeOnMouseLeave ? handleClose : undefined}
            onClick={closeOnClick ? handleClose : undefined}
          >
            {showArrow && (
              <div
                className={`absolute w-4 h-4 pointer-events-none ${arrowClassName}`}
                style={{
                  ...arrowStyles[placement],
                  top: arrowPosition.top,
                  left: arrowPosition.left,
                }}
              >
                <div className="w-0 h-0 border-4 border-transparent border-white" />
              </div>
            )}
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Popover;
