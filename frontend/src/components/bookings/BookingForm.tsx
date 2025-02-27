import { FC, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { Service, CreateBookingData } from '@/types';
import { useForm } from '@/hooks/useForm';
import { useApi } from '@/hooks/useApi';
import { bookingsApi } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, generateTimeSlots } from '@/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface BookingFormProps {
  service: Service;
  onSuccess?: () => void;
}

type FormData = Record<string, string> & {
  date: string;
  time: string;
  specialRequirements: string;
};

const initialFormData: FormData = {
  date: '',
  time: '',
  specialRequirements: '',
};

const BookingForm: FC<BookingFormProps> = ({ service, onSuccess }) => {
  const router = useRouter();
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { execute: createBooking, isLoading } = useApi(bookingsApi.create);

  const { data, errors, handleChange: handleFormChange, validateForm, setErrors } = useForm<FormData>(
    initialFormData,
    {
      date: {
        required: true,
        validate: (value) => {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selected >= today ? undefined : 'Please select a future date';
        },
      },
      time: {
        required: true,
      },
    }
  );

  // Generate available time slots based on service availability
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];

    const date = new Date(selectedDate);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[date.getDay()];
    const availability = service.availabilityHours[dayOfWeek as keyof typeof service.availabilityHours];

    if (!availability) return [];

    return generateTimeSlots(availability.open, availability.close, 30); // 30-minute intervals
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleFormChange(e);
    if (e.target.name === 'date') {
      setSelectedDate(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bookingData: CreateBookingData = {
      serviceId: service._id,
      bookingDate: data.date,
      timeSlot: data.time,
      specialRequirements: data.specialRequirements,
    };

    const response = await createBooking(bookingData);

    if (response.error) {
      setErrors({ general: response.error });
      toast.error(response.error);
      return;
    }

    toast.success('Booking created successfully');
    onSuccess?.();
    router.push('/my-bookings');
  };

  const timeSlots = getAvailableTimeSlots();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Details</h3>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Service:</span>
          <span className="font-medium text-gray-900">{service.name}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Price:</span>
          <span className="font-medium text-gray-900">{formatCurrency(service.price)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="date"
            name="date"
            label="Select Date"
            value={data.date}
            onChange={handleInputChange}
            error={errors.date}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time
          </label>
          <select
            name="time"
            value={data.time}
            onChange={handleInputChange}
            className={`
              mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-red-500 focus:ring-red-500 sm:text-sm
              ${errors.time ? 'border-red-500' : ''}
            `}
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-red-500">{errors.time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements (Optional)
          </label>
          <textarea
            name="specialRequirements"
            value={data.specialRequirements}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="Any special requirements or notes for your booking..."
          />
        </div>
      </div>

      {errors.general && (
        <div className="text-sm text-red-500 mt-2">{errors.general}</div>
      )}

      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Confirm Booking
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
