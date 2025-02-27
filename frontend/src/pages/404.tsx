import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <Layout title="Page Not Found - Janaseva Foundation">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-gray-600 mb-8">
            Sorry, we could not find the page you&apos;re looking for. It might have been
            removed, renamed, or doesn&apos;t exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
