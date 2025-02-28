import { FC, ReactNode, useEffect, useState, useRef } from 'react';

interface TransitionProps {
  children: ReactNode;
  show?: boolean;
  appear?: boolean;
  unmount?: boolean;
  className?: string;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  beforeEnter?: () => void;
  afterEnter?: () => void;
  beforeLeave?: () => void;
  afterLeave?: () => void;
}

export const Transition: FC<TransitionProps> = ({
  children,
  show = true,
  appear = false,
  unmount = true,
  className = '',
  enter = '',
  enterFrom = '',
  enterTo = '',
  leave = '',
  leaveFrom = '',
  leaveTo = '',
  beforeEnter,
  afterEnter,
  beforeLeave,
  afterLeave,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(show);
  const [classes, setClasses] = useState<string[]>([]);
  const firstRender = useRef(true);
  const transitionEndTimeout = useRef<number>();

  useEffect(() => {
    if (firstRender.current && !appear) {
      firstRender.current = false;
      setIsVisible(show);
      return;
    }

    const applyEnterTransition = () => {
      beforeEnter?.();
      setIsVisible(true);
      
      // Enter transition
      const enterClasses = [enter, enterFrom].filter(Boolean);
      setClasses(enterClasses);

      // Force a reflow
      void document.body.offsetHeight;

      // Apply enter-to classes
      requestAnimationFrame(() => {
        setClasses([enter, enterTo].filter(Boolean));
      });

      // Clean up enter classes
      transitionEndTimeout.current = window.setTimeout(() => {
        setClasses([]);
        afterEnter?.();
      }, getTransitionDuration());
    };

    const applyLeaveTransition = () => {
      beforeLeave?.();

      // Leave transition
      const leaveClasses = [leave, leaveFrom].filter(Boolean);
      setClasses(leaveClasses);

      // Force a reflow
      void document.body.offsetHeight;

      // Apply leave-to classes
      requestAnimationFrame(() => {
        setClasses([leave, leaveTo].filter(Boolean));
      });

      // Clean up and unmount
      transitionEndTimeout.current = window.setTimeout(() => {
        setClasses([]);
        if (unmount) {
          setIsVisible(false);
        }
        afterLeave?.();
      }, getTransitionDuration());
    };

    if (show) {
      applyEnterTransition();
    } else {
      applyLeaveTransition();
    }

    return () => {
      if (transitionEndTimeout.current) {
        window.clearTimeout(transitionEndTimeout.current);
      }
    };
  }, [
    show,
    appear,
    unmount,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
  ]);

  // Helper function to get transition duration from CSS
  const getTransitionDuration = (): number => {
    // Default duration if no transition is defined
    return 150;
  };

  if (!isVisible && unmount) return null;

  return (
    <div className={`${className} ${classes.join(' ')}`.trim()}>
      {children}
    </div>
  );
};

// Predefined transitions
interface FadeProps extends Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'> {
  duration?: number;
}

export const Fade: FC<FadeProps> = ({ duration = 150, ...props }) => (
  <Transition
    enter={`transition-opacity duration-${duration}`}
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave={`transition-opacity duration-${duration}`}
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    {...props}
  />
);

interface SlideProps extends Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'> {
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export const Slide: FC<SlideProps> = ({ direction = 'down', duration = 150, ...props }) => {
  const directionClasses = {
    up: {
      enter: `transform transition-all duration-${duration}`,
      enterFrom: 'opacity-0 translate-y-4',
      enterTo: 'opacity-100 translate-y-0',
      leave: `transform transition-all duration-${duration}`,
      leaveFrom: 'opacity-100 translate-y-0',
      leaveTo: 'opacity-0 translate-y-4',
    },
    down: {
      enter: `transform transition-all duration-${duration}`,
      enterFrom: 'opacity-0 -translate-y-4',
      enterTo: 'opacity-100 translate-y-0',
      leave: `transform transition-all duration-${duration}`,
      leaveFrom: 'opacity-100 translate-y-0',
      leaveTo: 'opacity-0 -translate-y-4',
    },
    left: {
      enter: `transform transition-all duration-${duration}`,
      enterFrom: 'opacity-0 translate-x-4',
      enterTo: 'opacity-100 translate-x-0',
      leave: `transform transition-all duration-${duration}`,
      leaveFrom: 'opacity-100 translate-x-0',
      leaveTo: 'opacity-0 translate-x-4',
    },
    right: {
      enter: `transform transition-all duration-${duration}`,
      enterFrom: 'opacity-0 -translate-x-4',
      enterTo: 'opacity-100 translate-x-0',
      leave: `transform transition-all duration-${duration}`,
      leaveFrom: 'opacity-100 translate-x-0',
      leaveTo: 'opacity-0 -translate-x-4',
    },
  };

  return <Transition {...directionClasses[direction]} {...props} />;
};

interface ScaleProps extends Omit<TransitionProps, 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo'> {
  duration?: number;
}

export const Scale: FC<ScaleProps> = ({ duration = 150, ...props }) => (
  <Transition
    enter={`transform transition-all duration-${duration}`}
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave={`transform transition-all duration-${duration}`}
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
    {...props}
  />
);

export default Transition;
