import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const UnauthorizedPage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogin = () => {
    router.push(`/login?redirect=${router.asPath}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Layout title="Access Denied - Janaseva Foundation">
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
                d="M12 15v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-8">
            {user ? (
              <>
                You don&apos;t have permission to access this page. If you believe this
                is an error, please contact our support team or try logging in with
                a different account.
              </>
            ) : (
              <>
                Please log in to access this page. If you don&apos;t have an account,
                you can sign up for free.
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button onClick={() => router.back()}>
                  Go Back
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleLogin}>
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Return to Home Page
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8">
              <details className="bg-red-50 rounded-lg p-4 text-left">
                <summary className="text-red-600 font-medium cursor-pointer mb-2">
                  Debug Information
                </summary>
                <div className="mt-2">
                  <pre className="text-sm text-red-800 whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(
                      {
                        path: router.asPath,
                        query: router.query,
                        user: user ? {
                          id: user._id,
                          role: user.role,
                        } : null,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;
