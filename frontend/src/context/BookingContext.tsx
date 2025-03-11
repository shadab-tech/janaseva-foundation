import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { useApi } from '../hooks/useApi';

import { useToast } from '../components/ui/Toast';

import { bookingsApi } from '../services/api';

import { Booking, CreateBookingData } from '../types';


interface BookingContextType {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  createBooking: (data: CreateBookingData) => Promise<boolean>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  fetchBookings: () => Promise<void>;
  selectBooking: (bookingId: string | null) => void;
  getBookingById: (bookingId: string) => Booking | null;
  getActiveBookings: () => Booking[];
  getPastBookings: () => Booking[];
  navigateToBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider = ({ children }: BookingProviderProps) => {
  const router = useRouter();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: bookingsResponse,
    error: apiError,
    isLoading,
    execute: fetchBookingsApi
  } = useApi<{ data: Booking[] }>(bookingsApi.getUserBookings);

  const { execute: createBookingApi } = useApi(bookingsApi.create);
  const { execute: updateBookingStatusApi } = useApi(bookingsApi.updateStatus);

  useEffect(() => {
    if (bookingsResponse?.data) {
      setBookings(bookingsResponse.data);
    }
  }, [bookingsResponse]);

  const fetchBookings = useCallback(async () => {
    await fetchBookingsApi();
  }, [fetchBookingsApi]);

  const createBooking = useCallback(
    async (data: CreateBookingData) => {
      const response = await createBookingApi(data);

      if (response.error) {
        setError(response.error);
        toast.error(response.error);
        return false;
      }

      toast.success('Booking created successfully');
      await fetchBookings();
      router.push('/my-bookings');
      return true;
    },
    [createBookingApi, fetchBookings, toast, router]
  );

  const cancelBooking = useCallback(
    async (bookingId: string, reason = 'Cancelled by user') => {
      const response = await updateBookingStatusApi(bookingId, {
        status: 'cancelled',
        cancellationReason: reason,
      });

      if (response.error) {
        setError(response.error);
        toast.error(response.error);
        return false;
      }

      toast.success('Booking cancelled successfully');
      await fetchBookings();
      return true;
    },
    [updateBookingStatusApi, fetchBookings, toast]
  );

  const selectBooking = useCallback((bookingId: string | null) => {
    if (!bookingId) {
      setSelectedBooking(null);
      return;
    }

    const booking = bookings.find((b) => b._id === bookingId);
    setSelectedBooking(booking || null);
  }, [bookings]);

  const getBookingById = useCallback(
    (bookingId: string) => {
      return bookings.find((b) => b._id === bookingId) || null;
    },
    [bookings]
  );

  const getActiveBookings = useCallback(() => {
    return bookings
      .filter((booking) => ['pending', 'confirmed'].includes(booking.status))
      .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
  }, [bookings]);

  const getPastBookings = useCallback(() => {
    return bookings
      .filter((booking) => ['completed', 'cancelled'].includes(booking.status))
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }, [bookings]);

  const navigateToBooking = useCallback((bookingId: string) => {
    router.push(`/my-bookings?booking=${bookingId}`);
  }, [router]);

  // Handle booking ID from URL query
  useEffect(() => {
    const bookingId = router.query.booking as string;
    if (bookingId) {
      selectBooking(bookingId);
    }
  }, [router.query.booking, selectBooking]);

  const value = {
    bookings,
    selectedBooking,
    isLoading,
    error,
    createBooking,
    cancelBooking,
    fetchBookings,
    selectBooking,
    getBookingById,
    getActiveBookings,
    getPastBookings,
    navigateToBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Custom hooks for specific booking functionalities
export const useActiveBookings = () => {
  const { getActiveBookings } = useBooking();
  return getActiveBookings();
};

export const usePastBookings = () => {
  const { getPastBookings } = useBooking();
  return getPastBookings();
};

export const useBookingById = (bookingId: string) => {
  const { getBookingById } = useBooking();
  return getBookingById(bookingId);
};

export default BookingProvider;
