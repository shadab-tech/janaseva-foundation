import { FC, createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';
import { Portal } from './Portal';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

interface ToastContextType {
  toasts: ToastProps[];
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  closeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider: FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  position = 'bottom-right',
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    setToasts(prev => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = {
        ...toast,
        id,
        onClose: () => closeToast(id),
      };
      return [newToast, ...prev].slice(0, maxToasts);
    });
  }, [maxToasts]);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value = {
    toasts,
    showToast,
    closeToast,
  };

  const positionStyles = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal containerId="toast-root">
        <div
          className={`fixed z-50 m-4 space-y-2 pointer-events-none ${positionStyles[position]}`}
          role="log"
          aria-live="polite"
        >
          {toasts.map(toast => (
            <ToastItem key={toast.id} {...toast} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

const ToastItem: FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  action,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const timerRef = useRef<number>();

  useEffect(() => {
    const startTimer = () => {
      if (duration > 0) {
        timerRef.current = window.setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);
      }
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [duration, onClose]);

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (duration > 0) {
      timerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
    }
  }, [duration, onClose]);

  const icons = {
    success: (
      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
    info: 'bg-blue-50 text-blue-800',
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out pointer-events-auto
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        max-w-sm w-full overflow-hidden rounded-lg shadow-lg
        ${colors[type]}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className={`text-sm ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`
                    text-sm font-medium focus:outline-none
                    ${type === 'error' ? 'text-red-600 hover:text-red-500' : ''}
                    ${type === 'success' ? 'text-green-600 hover:text-green-500' : ''}
                    ${type === 'warning' ? 'text-yellow-600 hover:text-yellow-500' : ''}
                    ${type === 'info' ? 'text-blue-600 hover:text-blue-500' : ''}
                  `}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
