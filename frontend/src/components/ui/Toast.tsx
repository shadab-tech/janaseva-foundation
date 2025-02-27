import { FC, useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const Toast: FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;

      if (remaining <= 0) {
        clearInterval(timer);
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow exit animation to complete
      } else {
        setProgress(newProgress);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg text-white
        transform transition-all duration-300
        ${typeStyles[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2">{icons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number } & ToastProps>>([]);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration, onClose: () => removeToast(id) }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
            {toasts.map((toast) => (
              <Toast key={toast.id} {...toast} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { showToast } = context;

  return {
    success: useCallback((message: string, duration?: number) => {
      showToast(message, 'success', duration);
    }, [showToast]),
    
    error: useCallback((message: string, duration?: number) => {
      showToast(message, 'error', duration);
    }, [showToast]),
    
    info: useCallback((message: string, duration?: number) => {
      showToast(message, 'info', duration);
    }, [showToast]),
    
    warning: useCallback((message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    }, [showToast]),
  };
};

export default Toast;
