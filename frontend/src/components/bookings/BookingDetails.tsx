import { FC } from 'react';
import { Booking, BookingStatus, PaymentStatus } from '@/types';
import { formatDate, formatTime, formatCurrency } from '@/utils';
import Button from '@/components/ui/Button';

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
  onCancel?: (bookingId: string) => void;
  isLoading?: boolean;
}

const BookingDetails: FC<BookingDetailsProps> = ({
  booking,
  onClose,
  onCancel,
  isLoading = false,
}) => {
  const statusColors: Record<BookingStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const paymentStatusColors: Record<PaymentStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    completed: { bg: 'bg-green-100', text: 'text-green-800' },
    failed: { bg: 'bg-red-100', text: 'text-red-800' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  return (
    <div className="space-y-6">
      {/* Service Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Service Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium text-gray-900">{booking.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium text-gray-900">
              {booking.service.provider.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(booking.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium text-gray-900">{booking._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">
              {formatDate(booking.bookingDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">
              {formatTime(booking.timeSlot)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[booking.status].bg
              } ${statusColors[booking.status].text}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                paymentStatusColors[booking.paymentStatus].bg
              } ${paymentStatusColors[booking.paymentStatus].text}`}
            >
              {booking.paymentStatus.charAt(0).toUpperCase() +
                booking.paymentStatus.slice(1)}
            </span>
          </div>
          {booking.paymentId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium text-gray-900">{booking.paymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Special Requirements */}
      {booking.specialRequirements && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Special Requirements
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900">{booking.specialRequirements}</p>
          </div>
        </div>
      )}

      {/* Cancellation Information */}
      {booking.cancellationReason && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Cancellation Details
          </h3>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-red-900">{booking.cancellationReason}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        {canCancel && onCancel && (
          <Button
            variant="outline"
            onClick={() => onCancel(booking._id)}
            isLoading={isLoading}
            fullWidth
          >
            Cancel Booking
          </Button>
        )}
        <Button variant="primary" onClick={onClose} fullWidth>
          Close
        </Button>
      </div>
    </div>
  );
};

export default BookingDetails;
