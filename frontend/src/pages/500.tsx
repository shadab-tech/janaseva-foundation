import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const ErrorPage = () => {
  const router = useRouter();

  return (
    <Layout title="Error - Janaseva Foundation">
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>

          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. An unexpected error occurred while
            processing your request. Please try again later or contact our support team
            if the problem persists.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.reload()}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Go to Home
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && router.query.error && (
            <div className="mt-8">
              <details className="bg-red-50 rounded-lg p-4 text-left">
                <summary className="text-red-600 font-medium cursor-pointer mb-2">
                  Error Details
                </summary>
                <div className="mt-2">
                  <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-auto max-h-96">
                    {typeof router.query.error === 'string' 
                      ? router.query.error 
                      : JSON.stringify(router.query.error, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            Error ID: {router.query.id || 'Unknown'}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
