import { ReactNode } from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  status?: 'active' | 'coming_soon';
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card = ({
  title,
  description,
  imageUrl,
  status = 'active',
  children,
  onClick,
  className = '',
}: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${onClick ? 'cursor-pointer transform transition hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          {status === 'coming_soon' && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
              Coming Soon
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default Card;
