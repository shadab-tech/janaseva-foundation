import { FC, ReactNode, useEffect } from 'react';
import { Portal } from './Portal';
import { Transition } from './Transition';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
}

export const Drawer: FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  preventScroll = true,
}) => {
  const sizeStyles = {
    sm: {
      left: 'w-64',
      right: 'w-64',
      top: 'h-32',
      bottom: 'h-32',
    },
    md: {
      left: 'w-80',
      right: 'w-80',
      top: 'h-48',
      bottom: 'h-48',
    },
    lg: {
      left: 'w-96',
      right: 'w-96',
      top: 'h-64',
      bottom: 'h-64',
    },
    xl: {
      left: 'w-[32rem]',
      right: 'w-[32rem]',
      top: 'h-96',
      bottom: 'h-96',
    },
    full: {
      left: 'w-screen',
      right: 'w-screen',
      top: 'h-screen',
      bottom: 'h-screen',
    },
  };

  const positionStyles = {
    left: {
      enter: 'transform transition-transform duration-300',
      enterFrom: '-translate-x-full',
      enterTo: 'translate-x-0',
      leave: 'transform transition-transform duration-200',
      leaveFrom: 'translate-x-0',
      leaveTo: '-translate-x-full',
      position: 'fixed inset-y-0 left-0',
    },
    right: {
      enter: 'transform transition-transform duration-300',
      enterFrom: 'translate-x-full',
      enterTo: 'translate-x-0',
      leave: 'transform transition-transform duration-200',
      leaveFrom: 'translate-x-0',
      leaveTo: 'translate-x-full',
      position: 'fixed inset-y-0 right-0',
    },
    top: {
      enter: 'transform transition-transform duration-300',
      enterFrom: '-translate-y-full',
      enterTo: 'translate-y-0',
      leave: 'transform transition-transform duration-200',
      leaveFrom: 'translate-y-0',
      leaveTo: '-translate-y-full',
      position: 'fixed inset-x-0 top-0',
    },
    bottom: {
      enter: 'transform transition-transform duration-300',
      enterFrom: 'translate-y-full',
      enterTo: 'translate-y-0',
      leave: 'transform transition-transform duration-200',
      leaveFrom: 'translate-y-0',
      leaveTo: 'translate-y-full',
      position: 'fixed inset-x-0 bottom-0',
    },
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };

    if (isOpen) {
      if (closeOnEsc) {
        document.addEventListener('keydown', handleEsc);
      }
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEsc, onClose, preventScroll]);

  return (
    <Portal containerId="drawer-root">
      {/* Overlay */}
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 ${overlayClassName}`}
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
      </Transition>

      {/* Drawer */}
      <Transition
        show={isOpen}
        {...positionStyles[position]}
      >
        <div
          className={`
            bg-white shadow-xl flex flex-col
            ${sizeStyles[size][position]}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
        >
          {showCloseButton && (
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={onClose}
              aria-label="Close drawer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {children}
        </div>
      </Transition>
    </Portal>
  );
};

// Helper components for drawer content organization
export const DrawerHeader: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const DrawerBody: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`flex-1 px-6 py-4 overflow-y-auto ${className}`}>
    {children}
  </div>
);

export const DrawerFooter: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

// Drawer with form content
interface DrawerFormProps extends DrawerProps {
  title: string;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
  preventCloseIfDirty?: boolean;
}

export const DrawerForm: FC<DrawerFormProps> = ({
  title,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  isSubmitting = false,
  isDirty = false,
  preventCloseIfDirty = true,
  children,
  onClose,
  ...props
}) => {
  const handleClose = () => {
    if (preventCloseIfDirty && isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Drawer onClose={handleClose} {...props}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <DrawerHeader>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </DrawerHeader>
        <DrawerBody>
          {children}
        </DrawerBody>
        <DrawerFooter className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </DrawerFooter>
      </form>
    </Drawer>
  );
};

export default Drawer;
