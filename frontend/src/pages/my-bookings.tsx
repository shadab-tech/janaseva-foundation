import { useState, useEffect } from 'react';
import { withAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import ConfirmationModal from '../components/ui/ConfirmationModal'; // Updated import
import Modal from '../components/ui/Modal';
import Layout from '../components/layout/Layout';
import BookingCard from '../components/bookings/BookingCard';
import BookingDetails from '../components/bookings/BookingDetails';
import { PageSpinner } from '../components/ui/LoadingSpinner';
import Input from '../components/ui/Input';
import { Booking } from '../types';

const SORT_OPTIONS = {
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
} as const;

type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

const MyBookingsPage = () => {
  const {
    selectedBooking,
    isLoading,
    error,
    fetchBookings,
    cancelBooking,
    selectBooking,
    getActiveBookings,
    getPastBookings,
  } = useBooking();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.DATE_DESC);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    const success = await cancelBooking(selectedBooking._id);
    setIsCancelling(false);

    if (success) {
      setShowCancelModal(false);
      selectBooking(null);
    }
  };

  const handleViewDetails = (bookingId: string) => {
    selectBooking(bookingId);
    setShowDetailsModal(true);
  };

  const filterBookings = (bookings: Booking[]) => {
    return bookings.filter((booking) =>
      booking.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortBookings = (bookings: Booking[]) => {
    return [...bookings].sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.DATE_ASC:
          return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
        case SORT_OPTIONS.DATE_DESC:
          return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
        case SORT_OPTIONS.PRICE_ASC:
          return a.price - b.price;
        case SORT_OPTIONS.PRICE_DESC:
          return b.price - a.price;
        default:
          return 0;
      }
    });
  };

  if (isLoading) {
    return (
      <Layout title="My Bookings">
        <PageSpinner text="Loading your bookings..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="My Bookings">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchBookings()}
              className="text-red-500 hover:text-red-600 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const activeBookings = sortBookings(filterBookings(getActiveBookings()));
  const pastBookings = sortBookings(filterBookings(getPastBookings()));

  return (
    <Layout title="My Bookings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Bookings</h1>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value={SORT_OPTIONS.DATE_DESC}>Latest First</option>
              <option value={SORT_OPTIONS.DATE_ASC}>Earliest First</option>
              <option value={SORT_OPTIONS.PRICE_DESC}>Highest Price</option>
              <option value={SORT_OPTIONS.PRICE_ASC}>Lowest Price</option>
            </select>
          </div>
        </div>

        {/* Active Bookings */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Active Bookings
            {activeBookings.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({activeBookings.length})
              </span>
            )}
          </h2>
          {activeBookings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={(id) => {
                    selectBooking(id);
                    setShowCancelModal(true);
                  }}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No active bookings</p>
          )}
        </section>

        {/* Past Bookings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Past Bookings
            {pastBookings.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({pastBookings.length})
              </span>
            )}
          </h2>
          {pastBookings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No past bookings</p>
          )}
        </section>

        {/* Cancel Booking Confirmation Modal */}
        <ConfirmationModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            selectBooking(null);
          }}
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone."
          confirmLabel={isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
          cancelLabel="No, Keep Booking"
          onConfirm={handleCancelBooking}
          variant="danger"
        />

        {/* Booking Details Modal */}
        {selectedBooking && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              selectBooking(null);
            }}
            title="Booking Details"
            size="lg"
          >
            <BookingDetails
              booking={selectedBooking}
              onClose={() => {
                setShowDetailsModal(false);
                selectBooking(null);
              }}
              onCancel={(id) => {
                setShowDetailsModal(false);
                selectBooking(id);
                setShowCancelModal(true);
              }}
              isLoading={isCancelling}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default withAuth(MyBookingsPage);
