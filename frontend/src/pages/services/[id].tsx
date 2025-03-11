import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useBooking } from '@/context/BookingContext';
import { servicesApi } from '@/services/api';
import { Service } from '@/types';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from '@/components/ui/TimePicker';
import { useToast } from '@/components/ui/Toast';

const ServiceDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { createBooking } = useBooking();
  const toast = useToast();
  
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        const response = await servicesApi.getById(id as string);
        if (response.data) {
          setService(response.data);
        } else if (response.error) {
          toast.showToast({ type: 'error', message: response.error });
        }
      } catch (error) {
        toast.showToast({ type: 'error', message: 'Failed to fetch service details' });
      }
    };

    fetchService();
  }, [id, toast]);

  const handleBookNow = async () => {
    if (!service || !selectedDate || !selectedTime) {
      toast.showToast({ type: 'error', message: 'Please select date and time for booking' });
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        serviceId: service._id,
        bookingDate: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedTime,
      };

      const success = await createBooking(bookingData);
      if (success) {
        toast.showToast({ type: 'success', message: 'Booking created successfully' });
        router.push('/my-bookings');
      }
    } catch (error) {
      toast.showToast({ type: 'error', message: 'Failed to create booking' });
    } finally {
      setIsBooking(false);
    }
  };

  if (!service) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading service details...</p>
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
                    <span className="ml-2 text-yellow-500">{'★'.repeat(4)}</span>
                    <span className="text-gray-400">{'★'.repeat(1)}</span>
                    <span className="ml-1">(4.0)</span>
                  </p>
                  <p><span className="text-gray-600">Total Bookings:</span> 100+</p>
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p>{service.location.address}</p>
                <p>{service.location.city}, {service.location.state}</p>
              </div>

              {/* Booking Form */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Book Service</h3>
                <div className="space-y-4">
                  <DatePicker
                    value={selectedDate || undefined}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    minDate={new Date()}
                    placeholder="Select Date"
                    className="w-full"
                  />
                  <TimePicker
                    value={selectedTime}
                    onChange={(time: string | null) => setSelectedTime(time || '')}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Book Now Button */}
              <div className="border-t pt-6">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handleBookNow}
                  disabled={service.status === 'coming_soon' || !selectedDate || !selectedTime}
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
