import { FC, ReactNode } from 'react';
import { Modal } from './Modal';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  variant?: 'alert' | 'confirm' | 'custom';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  className?: string;
  contentClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface AlertDialogProps {
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmDialogProps extends AlertDialogProps {
  cancelText?: string;
  onCancel?: () => void;
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  variant = 'custom',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon,
  className = '',
  contentClassName = '',
  size = 'sm',
}) => {
  const renderIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case 'alert':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      case 'confirm':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    if (actions) return actions;

    switch (variant) {
      case 'alert':
        return (
          <button
            type="button"
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmText}
          </button>
        );
      case 'confirm':
        return (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      className={className}
      contentClassName={contentClassName}
    >
      <div className="px-6 py-4">
        {renderIcon() && (
          <div className="mb-4 flex justify-center">{renderIcon()}</div>
        )}
        {title && (
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
            {title}
          </h3>
        )}
        {description && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {description}
            </p>
          </div>
        )}
        {children}
      </div>
      {(actions || variant !== 'custom') && (
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          {renderActions()}
        </div>
      )}
    </Modal>
  );
};

export const AlertDialog: FC<AlertDialogProps> = ({
  title,
  description,
  confirmText,
  onConfirm,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog
      variant="alert"
      title={title}
      description={description}
      confirmText={confirmText}
      onConfirm={onConfirm}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog
      variant="confirm"
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default Dialog;
