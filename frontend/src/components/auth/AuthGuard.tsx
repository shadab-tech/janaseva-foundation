import { ComponentType, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { handleAuthGuard } from '@/middleware/auth';
import { ROUTES } from '@/constants';
import { PageSpinner } from '@/components/ui/LoadingSpinner';
import type { UserRole } from '@/middleware/auth';

interface AuthGuardOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Route guard HOC
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: AuthGuardOptions = {}
) {
  return function WithAuthGuard(props: P): ReactElement {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      handleAuthGuard(router, user, options);
    }, [router, user]);

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <PageSpinner text="Loading..." />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Role guard HOC
export function withRole<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return withAuth(WrappedComponent, { allowedRoles });
}

// Public route guard (redirect if authenticated)
export function withPublicRoute<P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo: string = ROUTES.HOME
) {
  return function WithPublicRoute(props: P): ReactElement {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      if (user) {
        const redirect = router.query.redirect as string;
        router.replace(redirect || redirectTo);
      }
    }, [router, user]);

    if (user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <PageSpinner text="Redirecting..." />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Auth Guard Component for protecting routes
export function AuthGuard({
  children,
  allowedRoles,
  redirectTo,
}: {
  children: ReactElement;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}): ReactElement | null {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    handleAuthGuard(router, user, { allowedRoles, redirectTo });
  }, [router, user, allowedRoles, redirectTo]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageSpinner text="Loading..." />
      </div>
    );
  }

  return children;
}

// Public Guard Component for public routes
export function PublicGuard({
  children,
  redirectTo = ROUTES.HOME,
}: {
  children: ReactElement;
  redirectTo?: string;
}): ReactElement | null {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirect = router.query.redirect as string;
      router.replace(redirect || redirectTo);
    }
  }, [router, user, redirectTo]);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageSpinner text="Redirecting..." />
      </div>
    );
  }

  return children;
}

export default {
  withAuth,
  withRole,
  withPublicRoute,
  AuthGuard,
  PublicGuard,
};
