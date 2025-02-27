import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-white rounded-full p-2">
                <Image
                  src="https://storage.googleapis.com/a1aa/image/s7peiEti5QafVcj30Ob9kzmryqvDCnxlPuf6ziCrs7s.jpg"
                  alt="Janaseva Foundation Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="text-white text-lg font-bold ml-3">
                Janaseva Foundation
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`${
                  router.pathname === '/'
                    ? 'bg-red-700 text-white'
                    : 'text-white hover:bg-red-600'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={`${
                  router.pathname === '/services'
                    ? 'bg-red-700 text-white'
                    : 'text-white hover:bg-red-600'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                Services
              </Link>
              <Link
                href="/my-bookings"
                className={`${
                  router.pathname === '/my-bookings'
                    ? 'bg-red-700 text-white'
                    : 'text-white hover:bg-red-600'
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                My Bookings
              </Link>
              <Link
                href="/login"
                className="text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`${
                router.pathname === '/'
                  ? 'bg-red-700 text-white'
                  : 'text-white hover:bg-red-600'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`${
                router.pathname === '/services'
                  ? 'bg-red-700 text-white'
                  : 'text-white hover:bg-red-600'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Services
            </Link>
            <Link
              href="/my-bookings"
              className={`${
                router.pathname === '/my-bookings'
                  ? 'bg-red-700 text-white'
                  : 'text-white hover:bg-red-600'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              My Bookings
            </Link>
            <Link
              href="/login"
              className="text-white hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
