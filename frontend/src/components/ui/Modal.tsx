import { FC, ReactNode, useEffect, useState } from 'react';
import { Portal } from './Portal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  closeIcon?: ReactNode;
  animationDuration?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top';
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  closeIcon,
  animationDuration = 300,
  size = 'md',
  position = 'center',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeOnEsc]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, animationDuration);
  };

  if (!isOpen && !isVisible) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full m-4',
  };

  const positionClasses = {
    center: 'items-center',
    top: 'items-start mt-16',
  };

  const DefaultCloseIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <Portal containerId="modal-root">
      <div
        className={`
          fixed inset-0 z-50 flex justify-center ${positionClasses[position]}
          ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
          ${className}
        `}
        style={{
          animationDuration: `${animationDuration}ms`,
        }}
      >
        {/* Overlay */}
        <div
          className={`
            fixed inset-0 bg-black
            ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}
            ${overlayClassName}
          `}
          style={{
            animationDuration: `${animationDuration}ms`,
          }}
          onClick={closeOnOverlayClick ? handleClose : undefined}
        />

        {/* Content */}
        <div
          className={`
            relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl
            ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}
            ${contentClassName}
          `}
          style={{
            animationDuration: `${animationDuration}ms`,
          }}
        >
          {showCloseButton && (
            <button
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
              aria-label="Close modal"
            >
              {closeIcon || <DefaultCloseIcon />}
            </button>
          )}
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 0.5; }
        }

        @keyframes overlayOut {
          from { opacity: 0.5; }
          to { opacity: 0; }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
        }

        .animate-fade-in { animation: fadeIn forwards; }
        .animate-fade-out { animation: fadeOut forwards; }
        .animate-overlay-in { animation: overlayIn forwards; }
        .animate-overlay-out { animation: overlayOut forwards; }
        .animate-modal-in { animation: modalIn forwards; }
        .animate-modal-out { animation: modalOut forwards; }
      `}</style>
    </Portal>
  );
};

export default Modal;
