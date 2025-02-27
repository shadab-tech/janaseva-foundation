import { FC } from 'react';
import { Booking, BookingStatus } from '@/types';
import { formatDate, formatTime, formatCurrency } from '@/utils';
import Button from '@/components/ui/Button';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

const BookingCard: FC<BookingCardProps> = ({
  booking,
  onCancel,
  onViewDetails,
}) => {
  const statusColors: Record<BookingStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const statusLabels: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.service.name}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[booking.status].bg
            } ${statusColors[booking.status].text}`}
          >
            {statusLabels[booking.status]}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-medium text-gray-900">
              {formatDate(booking.bookingDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="font-medium text-gray-900">
              {formatTime(booking.timeSlot)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(booking.price)}
            </span>
          </div>
          {booking.service.provider && (
            <div className="flex justify-between">
              <span>Provider:</span>
              <span className="font-medium text-gray-900">
                {booking.service.provider.name}
              </span>
            </div>
          )}
          {booking.paymentStatus && (
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span
                className={`font-medium ${
                  booking.paymentStatus === 'completed'
                    ? 'text-green-600'
                    : booking.paymentStatus === 'failed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {booking.paymentStatus.charAt(0).toUpperCase() +
                  booking.paymentStatus.slice(1)}
              </span>
            </div>
          )}
        </div>

        {booking.specialRequirements && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Special Requirements:</p>
            <p className="mt-1 text-sm text-gray-900">
              {booking.specialRequirements}
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onViewDetails?.(booking._id)}
          >
            View Details
          </Button>
          {canCancel && onCancel && (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => onCancel(booking._id)}
            >
              Cancel Booking
            </Button>
          )}
        </div>

        {booking.cancellationReason && (
          <div className="mt-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm font-medium text-red-800">
              Cancellation Reason:
            </p>
            <p className="mt-1 text-sm text-red-600">
              {booking.cancellationReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
