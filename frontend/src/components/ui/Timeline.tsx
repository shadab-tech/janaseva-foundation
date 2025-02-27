import { FC, ReactNode } from 'react';

interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  icon?: ReactNode;
  status?: 'completed' | 'current' | 'upcoming';
  content?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'alternate';
  className?: string;
  itemClassName?: string;
  lineColor?: string;
  dotColor?: string;
  showConnectors?: boolean;
  iconSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const Timeline: FC<TimelineProps> = ({
  items,
  orientation = 'vertical',
  variant = 'default',
  className = '',
  itemClassName = '',
  lineColor = 'bg-gray-200',
  dotColor = 'bg-red-500',
  showConnectors = true,
  iconSize = 'md',
  compact = false,
}) => {
  const iconSizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const dotSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const statusStyles = {
    completed: {
      dot: 'bg-green-500',
      icon: 'text-green-500',
      line: 'bg-green-200',
    },
    current: {
      dot: 'bg-red-500',
      icon: 'text-red-500',
      line: 'bg-gray-200',
    },
    upcoming: {
      dot: 'bg-gray-300',
      icon: 'text-gray-300',
      line: 'bg-gray-200',
    },
  };

  const renderIcon = (item: TimelineItem) => {
    if (item.icon) {
      return (
        <div
          className={`
            ${iconSizeStyles[iconSize]}
            rounded-full border-2 border-white bg-white
            flex items-center justify-center
            ${item.status ? statusStyles[item.status].icon : 'text-red-500'}
          `}
        >
          {item.icon}
        </div>
      );
    }

    return (
      <div
        className={`
          ${dotSizeStyles[iconSize]}
          rounded-full border-2 border-white
          ${item.status ? statusStyles[item.status].dot : dotColor}
        `}
      />
    );
  };

  const renderVerticalTimeline = () => (
    <div className={`relative ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isAlternate = variant === 'alternate';
        const isEven = index % 2 === 0;

        return (
          <div
            key={item.id}
            className={`
              relative
              ${!isLast && showConnectors ? 'pb-8' : ''}
              ${isAlternate ? 'flex' : ''}
              ${itemClassName}
            `}
          >
            {/* Connector Line */}
            {!isLast && showConnectors && (
              <div
                className={`
                  absolute top-0 left-4 -ml-px h-full w-0.5
                  ${item.status ? statusStyles[item.status].line : lineColor}
                  ${isAlternate ? 'left-1/2' : ''}
                  ${compact ? 'left-3' : ''}
                `}
              />
            )}

            <div
              className={`
                relative flex items-start
                ${isAlternate ? `${isEven ? 'justify-end pr-8' : 'justify-start pl-8'} w-1/2` : ''}
              `}
            >
              {/* Icon/Dot */}
              <div
                className={`
                  absolute
                  ${compact ? 'mt-1' : 'mt-1.5'}
                  ${isAlternate ? '-translate-x-1/2' : ''}
                  ${isAlternate && isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}
                `}
              >
                {renderIcon(item)}
              </div>

              {/* Content */}
              <div
                className={`
                  ${isAlternate ? '' : 'pl-8'}
                  ${compact ? 'pl-6' : ''}
                `}
              >
                <div className="flex flex-col">
                  {item.date && (
                    <span className="text-sm text-gray-500">
                      {item.date}
                    </span>
                  )}
                  <h3 className="text-base font-medium text-gray-900">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                  {item.content && (
                    <div className="mt-2">{item.content}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderHorizontalTimeline = () => (
    <div className={`relative ${className}`}>
      <div className="flex overflow-x-auto">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.id}
              className={`
                relative flex-shrink-0
                ${!isLast ? 'pr-8' : ''}
                ${itemClassName}
              `}
            >
              {/* Connector Line */}
              {!isLast && showConnectors && (
                <div
                  className={`
                    absolute top-4 left-0 w-full h-0.5
                    ${item.status ? statusStyles[item.status].line : lineColor}
                  `}
                />
              )}

              {/* Icon/Dot */}
              <div className="relative flex flex-col items-center">
                <div className="z-10 bg-white p-1">
                  {renderIcon(item)}
                </div>

                {/* Content */}
                <div className="mt-3 flex flex-col items-center text-center max-w-[150px]">
                  {item.date && (
                    <span className="text-sm text-gray-500">
                      {item.date}
                    </span>
                  )}
                  <h3 className="text-base font-medium text-gray-900">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                  {item.content && (
                    <div className="mt-2">{item.content}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return orientation === 'vertical' ? renderVerticalTimeline() : renderHorizontalTimeline();
};

export default Timeline;
