import { FC, ReactNode, useEffect, useRef } from 'react';
import { Portal } from './Portal';
import { ModalTransition } from './Transition';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  preventClose?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  className?: string;
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  preventClose = false,
  showCloseButton = true,
  footer,
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventClose, onClose]);

  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (!preventClose && event.target === event.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  if (!isOpen) return null;

  return (
    <Portal containerId="dialog-root">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="min-h-screen px-4 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <ModalTransition show={isOpen}>
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </ModalTransition>

          {/* Dialog */}
          <ModalTransition show={isOpen}>
            <div
              ref={dialogRef}
              className={`
                relative bg-white rounded-lg shadow-xl w-full
                ${sizeClasses[size]} ${className}
              `}
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              {showCloseButton && !preventClose && (
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                  aria-label="Close dialog"
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

              {/* Header */}
              {(title || description) && (
                <div className="px-6 pt-6 pb-4">
                  {title && (
                    <h3 className="text-lg font-medium text-gray-900">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <div className="mt-2 text-sm text-gray-500">
                      {description}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t">
                  {footer}
                </div>
              )}
            </div>
          </ModalTransition>
        </div>
      </div>
    </Portal>
  );
};

// Confirmation dialog
interface ConfirmDialogProps extends Omit<DialogProps, 'children'> {
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'danger',
  isLoading = false,
  ...props
}) => {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  return (
    <Dialog {...props} size="sm">
      <div className="text-sm text-gray-500">{message}</div>
      <div className="mt-6 flex flex-row-reverse gap-3">
        <button
          type="button"
          className={`
            inline-flex justify-center px-4 py-2 text-sm font-medium text-white
            rounded-md border border-transparent focus:outline-none focus:ring-2
            focus:ring-offset-2 ${variantStyles[variant]}
            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
          `}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : confirmLabel}
        </button>
        <button
          type="button"
          className="
            inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700
            bg-white border border-gray-300 rounded-md hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          "
          onClick={props.onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
      </div>
    </Dialog>
  );
};

export default Dialog;
