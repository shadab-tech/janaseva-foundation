import { useRouter } from 'next/router';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ServiceCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  status: 'active' | 'coming_soon';
  price?: number;
  category: string;
}

const ServiceCard = ({
  id,
  name,
  description,
  imageUrl,
  status,
  price,
  category
}: ServiceCardProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/services/${id}`);
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card
      title={name}
      imageUrl={imageUrl}
      status={status}
      className="h-full flex flex-col"
    >
      <div className="flex-grow">
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {formatCategory(category)}
          </span>
          {price !== undefined && (
            <span className="text-red-500 font-semibold">
              ₹{price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        {status === 'active' ? (
          <Button
            variant="primary"
            fullWidth
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        ) : (
          <Button
            variant="outline"
            fullWidth
            disabled
          >
            Coming Soon
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;
