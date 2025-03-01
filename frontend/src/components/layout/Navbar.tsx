'use client';

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-red-600">Janaseva Foundation</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link 
              href="/services"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Services
            </Link>
            <Link 
              href="/my-bookings"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              My Bookings
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Health Card
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={toggleMobileMenu}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/services"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
          >
            Services
          </Link>
          <Link
            href="/my-bookings"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
          >
            My Bookings
          </Link>
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
          >
            Get Health Card
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
