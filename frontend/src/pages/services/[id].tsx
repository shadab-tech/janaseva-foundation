import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

// TODO: Replace with actual API types
interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'coming_soon';
  category: string;
  price: number;
  provider: {
    name: string;
    rating: number;
    totalBookings: number;
  };
  location: {
    address: string;
    city: string;
    state: string;
  };
  availabilityHours: {
    [key: string]: { open: string; close: string };
  };
}

// Temporary mock data - will be replaced with API call
const mockService: Service = {
  id: '1',
  name: 'Call Ambulance',
  description: 'Emergency ambulance service available 24/7. Our ambulances are fully equipped with modern medical equipment and staffed with trained medical professionals.',
  imageUrl: 'https://storage.googleapis.com/a1aa/image/YDVW11rKRnHozfZ9ywOwQ095tb1Gm4D7ZFhWgVjzaO4.jpg',
  status: 'active',
  category: 'ambulance',
  price: 1000,
  provider: {
    name: 'City Emergency Services',
    rating: 4.8,
    totalBookings: 1250
  },
  location: {
    address: '123 Healthcare Street',
    city: 'Mumbai',
    state: 'Maharashtra'
  },
  availabilityHours: {
    monday: { open: '00:00', close: '23:59' },
    tuesday: { open: '00:00', close: '23:59' },
    wednesday: { open: '00:00', close: '23:59' },
    thursday: { open: '00:00', close: '23:59' },
    friday: { open: '00:00', close: '23:59' },
    saturday: { open: '00:00', close: '23:59' },
    sunday: { open: '00:00', close: '23:59' }
  }
};

const ServiceDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isBooking, setIsBooking] = useState(false);

  // TODO: Replace with actual API call
  const service = mockService;

  const handleBookNow = () => {
    // TODO: Implement booking logic
    setIsBooking(true);
    setTimeout(() => {
      router.push('/my-bookings');
    }, 1500);
  };

  if (!service) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${service.name} - Janaseva Foundation`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-cover"
            />
            {service.status === 'coming_soon' && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full">
                Coming Soon
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
            <p className="text-gray-600 mb-6">{service.description}</p>

            <div className="space-y-4">
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold text-red-500">₹{service.price}</span>
              </div>

              {/* Provider Info */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Provider Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Name:</span> {service.provider.name}</p>
                  <p>
                    <span className="text-gray-600">Rating:</span>
                    <span className="ml-2 text-yellow-500">{'★'.repeat(Math.floor(service.provider.rating))}</span>
                    <span className="text-gray-400">{'★'.repeat(5 - Math.floor(service.provider.rating))}</span>
                    <span className="ml-1">({service.provider.rating})</span>
                  </p>
                  <p><span className="text-gray-600">Total Bookings:</span> {service.provider.totalBookings}+</p>
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p>{service.location.address}</p>
                <p>{service.location.city}, {service.location.state}</p>
              </div>

              {/* Availability */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Availability</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(service.availabilityHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{day}:</span>
                      <span>{hours.open} - {hours.close}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              <div className="border-t pt-6">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handleBookNow}
                  disabled={service.status === 'coming_soon'}
                  isLoading={isBooking}
                >
                  {service.status === 'coming_soon' ? 'Coming Soon' : 'Book Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetailsPage;
