import { FC, ImgHTMLAttributes, useEffect, useState } from 'react';
import { Tooltip } from './Tooltip';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  size?: AvatarSize;
  name?: string;
  src?: string;
  status?: AvatarStatus;
  statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  showTooltip?: boolean;
  fallback?: 'initials' | 'icon';
  square?: boolean;
  bordered?: boolean;
  group?: boolean;
}

const AVATAR_SIZES: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-14 h-14 text-xl',
  '2xl': 'w-16 h-16 text-2xl',
};

export const Avatar: FC<AvatarProps> = ({
  size = 'md',
  name,
  src,
  status,
  statusPosition = 'bottom-right',
  className = '',
  showTooltip = true,
  fallback = 'initials',
  square = false,
  bordered = false,
  group = false,
  ...imgProps
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const statusColors: Record<AvatarStatus, string> = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
  };

  const statusPositionStyles: Record<string, string> = {
    'top-right': '-top-0.5 -right-0.5',
    'top-left': '-top-0.5 -left-0.5',
    'bottom-right': '-bottom-0.5 -right-0.5',
    'bottom-left': '-bottom-0.5 -left-0.5',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          {...imgProps}
        />
      );
    }

    if (fallback === 'initials' && name) {
      return (
        <div
          className={`
            w-full h-full flex items-center justify-center
            text-white font-medium ${getRandomColor(name)}
          `}
        >
          {getInitials(name)}
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
        <svg
          className="w-1/2 h-1/2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      </div>
    );
  };

  const avatar = (
    <div
      className={`
        relative inline-flex flex-shrink-0
        ${AVATAR_SIZES[size]}
        ${square ? 'rounded-lg' : 'rounded-full'}
        ${bordered ? 'ring-2 ring-white' : ''}
        ${group ? '-ml-2 first:ml-0 hover:z-10' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-inherit">
        {renderContent()}
      </div>
      {status && (
        <span
          className={`
            absolute w-2.5 h-2.5 rounded-full ring-2 ring-white
            ${statusColors[status]}
            ${statusPositionStyles[statusPosition]}
          `}
        />
      )}
    </div>
  );

  return showTooltip && name ? (
    <Tooltip content={name}>{avatar}</Tooltip>
  ) : (
    avatar
  );
};

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<Omit<AvatarProps, 'group'>>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'md',
  className = '',
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex items-center ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar key={index} {...avatar} size={size} group />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            flex items-center justify-center
            bg-gray-200 text-gray-600 font-medium
            ${AVATAR_SIZES[size]}
            -ml-2 rounded-full
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;
