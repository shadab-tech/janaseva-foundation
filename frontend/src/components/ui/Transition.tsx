import { FC, ReactNode, useEffect, useState } from 'react';

interface TransitionProps {
  show: boolean;
  children: ReactNode;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  className?: string;
  appear?: boolean;
}

export const Transition: FC<TransitionProps> = ({
  show,
  children,
  enter = 'transition-opacity duration-300',
  enterFrom = 'opacity-0',
  enterTo = 'opacity-100',
  leave = 'transition-opacity duration-200',
  leaveFrom = 'opacity-100',
  leaveTo = 'opacity-0',
  className = '',
  appear = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [classes, setClasses] = useState('');

  useEffect(() => {
    if (show && !mounted) {
      setMounted(true);
      if (appear) {
        setClasses(`${enter} ${enterFrom}`);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setClasses(`${enter} ${enterTo}`);
          });
        });
      }
    }
  }, [show, mounted, appear, enter, enterFrom, enterTo]);

  useEffect(() => {
    if (!mounted) return;

    if (show) {
      setClasses(`${enter} ${enterFrom}`);
      setIsVisible(true);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setClasses(`${enter} ${enterTo}`);
        });
      });
    } else {
      setClasses(`${leave} ${leaveFrom}`);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setClasses(`${leave} ${leaveTo}`);
        });
      });

      const timeout = setTimeout(() => {
        setIsVisible(false);
        if (!show && mounted) {
          setMounted(false);
        }
      }, 300); // Match the longest duration

      return () => clearTimeout(timeout);
    }
  }, [show, mounted, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo]);

  if (!mounted) return null;

  return (
    <div
      className={`${classes} ${className}`}
      style={{ display: isVisible ? undefined : 'none' }}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
};

// Fade transition
export const FadeTransition: FC<Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'>> = (props) => (
  <Transition
    enter="transition-opacity duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    {...props}
  />
);

// Scale transition
export const ScaleTransition: FC<Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'>> = (props) => (
  <Transition
    enter="transition-all duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="transition-all duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
    {...props}
  />
);

// Slide up transition
export const SlideUpTransition: FC<Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'>> = (props) => (
  <Transition
    enter="transition-all duration-300"
    enterFrom="opacity-0 translate-y-4"
    enterTo="opacity-100 translate-y-0"
    leave="transition-all duration-200"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 translate-y-4"
    {...props}
  />
);

// Slide down transition
export const SlideDownTransition: FC<Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'>> = (props) => (
  <Transition
    enter="transition-all duration-300"
    enterFrom="opacity-0 -translate-y-4"
    enterTo="opacity-100 translate-y-0"
    leave="transition-all duration-200"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 -translate-y-4"
    {...props}
  />
);

// Modal transition
export const ModalTransition: FC<Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'>> = (props) => (
  <Transition
    enter="transition-all duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="transition-all duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
    appear
    {...props}
  />
);

// Toast transition
export const ToastTransition: FC<Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'>> = (props) => (
  <Transition
    enter="transform transition-all duration-300"
    enterFrom="translate-y-2 opacity-0"
    enterTo="translate-y-0 opacity-100"
    leave="transform transition-all duration-200"
    leaveFrom="translate-y-0 opacity-100"
    leaveTo="translate-y-2 opacity-0"
    appear
    {...props}
  />
);

export default Transition;
