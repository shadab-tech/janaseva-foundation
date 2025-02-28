import { FC, ReactNode, useState, useRef } from 'react';
import { Portal } from './Portal';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  tooltipClassName?: string;
  trigger?: 'hover' | 'click';
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
  tooltipClassName = '',
  trigger = 'hover',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<number | undefined>(undefined);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (trigger === 'hover') {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
      timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      window.clearTimeout(timeoutRef.current);
      setIsVisible(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
      setIsVisible(prev => !prev);
    }
  };

  const positionStyles = {
    top: {
      transform: 'translate(-50%, calc(-100% - 8px))',
      top: coords.y,
      left: coords.x,
    },
    bottom: {
      transform: 'translate(-50%, 8px)',
      top: coords.y,
      left: coords.x,
    },
    left: {
      transform: 'translate(calc(-100% - 8px), -50%)',
      top: coords.y,
      left: coords.x,
    },
    right: {
      transform: 'translate(8px, -50%)',
      top: coords.y,
      left: coords.x,
    },
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isVisible && (
        <Portal containerId="tooltip-root">
          <div
            className={`
              absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded
              shadow-lg whitespace-nowrap
              ${tooltipClassName}
            `}
            style={positionStyles[position]}
          >
            {content}
            <div
              className={`
                absolute w-2 h-2 bg-gray-900 transform rotate-45
                ${
                  position === 'top'
                    ? 'bottom-[-4px] left-1/2 -translate-x-1/2'
                    : position === 'bottom'
                    ? 'top-[-4px] left-1/2 -translate-x-1/2'
                    : position === 'left'
                    ? 'right-[-4px] top-1/2 -translate-y-1/2'
                    : 'left-[-4px] top-1/2 -translate-y-1/2'
                }
              `}
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Tooltip;
