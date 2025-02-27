import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ServiceCard from '@/components/services/ServiceCard';
import Input from '@/components/ui/Input';

// TODO: Replace with actual API types
interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'coming_soon';
  category: string;
  price: number;
}

// Temporary mock data - will be replaced with API call
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Call Ambulance',
    description: 'Emergency ambulance service available 24/7',
    imageUrl: 'https://storage.googleapis.com/a1aa/image/YDVW11rKRnHozfZ9ywOwQ095tb1Gm4D7ZFhWgVjzaO4.jpg',
    status: 'active',
    category: 'ambulance',
    price: 1000
  },
  {
    id: '2',
    name: 'Consult a Doctor',
    description: 'Online consultation with experienced doctors',
    imageUrl: 'https://storage.googleapis.com/a1aa/image/Lfo0RNTaKmTjfRDBqZBWYUg2Y5dQdM8DRsD7LuAMSCs.jpg',
    status: 'coming_soon',
    category: 'doctor_consultation',
    price: 500
  },
  {
    id: '3',
    name: 'Health Insurance',
    description: 'Comprehensive health insurance plans',
    imageUrl: 'https://storage.googleapis.com/a1aa/image/x5LkcrEuM2IFAkCQNqUSwDOpOn_pFR2pFYKOnySPazQ.jpg',
    status: 'coming_soon',
    category: 'health_insurance',
    price: 2000
  },
  {
    id: '4',
    name: 'Medical Reimbursement',
    description: 'Easy and quick medical bill reimbursement',
    imageUrl: 'https://storage.googleapis.com/a1aa/image/YWYyOXnhMvhCsYTlotD5cafOFUz-YdnFsDPzIRXpggA.jpg',
    status: 'coming_soon',
    category: 'medical_reimbursement',
    price: 0
  }
];

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'ambulance', label: 'Ambulance' },
    { value: 'doctor_consultation', label: 'Doctor Consultation' },
    { value: 'health_insurance', label: 'Health Insurance' },
    { value: 'medical_reimbursement', label: 'Medical Reimbursement' }
  ];

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout title="Services - Janaseva Foundation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No services found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServicesPage;
