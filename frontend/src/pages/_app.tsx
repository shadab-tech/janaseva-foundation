import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import '@/styles/globals.css';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/services',
  '/404',
  '/500',
  '/unauthorized',
];

// Route guard component
const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isPublicRoute = publicRoutes.some(route => 
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.push(`/login?redirect=${router.asPath}`);
    }
  }, [user, isLoading, router, isPublicRoute]);

  if (isLoading) {
    return <PageSpinner text="Loading..." />;
  }

  if (!isLoading && !user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Handle client-side errors
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Client-side error:', error);
      
      // Redirect to error page with details in development
      if (process.env.NODE_ENV === 'development') {
        router.push({
          pathname: '/500',
          query: {
            error: error.message,
            stack: error.error?.stack,
            id: new Date().getTime().toString(),
          },
        });
      } else {
        // In production, don't expose error details
        router.push('/500');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [router]);

  // Handle unhandled promise rejections
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event);

      if (process.env.NODE_ENV === 'development') {
        router.push({
          pathname: '/500',
          query: {
            error: event.reason?.message || 'Unhandled Promise Rejection',
            stack: event.reason?.stack,
            id: new Date().getTime().toString(),
          },
        });
      } else {
        router.push('/500');
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, [router]);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <RouteGuard>
              <Component {...pageProps} />
            </RouteGuard>
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
