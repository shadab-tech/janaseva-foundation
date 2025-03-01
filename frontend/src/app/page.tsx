import Link from 'next/link';

export default function Home() {
  const services = [
    {
      id: 1,
      name: "Ambulance Service",
      description: "24/7 emergency ambulance service available at your doorstep",
      icon: "🚑",
      status: "active"
    },
    {
      id: 2,
      name: "Doctor Consultation",
      description: "Connect with experienced healthcare professionals",
      icon: "👨‍⚕️",
      status: "coming_soon"
    },
    {
      id: 3,
      name: "Health Insurance",
      description: "Comprehensive health insurance coverage",
      icon: "🏥",
      status: "coming_soon"
    },
    {
      id: 4,
      name: "Medical Reimbursement",
      description: "Quick and easy medical bill reimbursement",
      icon: "💳",
      status: "coming_soon"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Access quality healthcare services with Janaseva Foundation&apos;s digital health card platform
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/signup"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Get Your Health Card
              </Link>
              <Link
                href="/services"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold border border-red-600 hover:bg-red-50 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                {service.status === "active" ? (
                  <Link
                    href={`/services/${service.id}`}
                    className="text-red-600 font-medium hover:text-red-700"
                  >
                    Learn More →
                  </Link>
                ) : (
                  <span className="text-gray-400 font-medium">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Our Health Card?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Access
              </h3>
              <p className="text-gray-600">
                Round-the-clock access to emergency medical services
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Affordable Care
              </h3>
              <p className="text-gray-600">
                Cost-effective healthcare solutions for everyone
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trusted Network
              </h3>
              <p className="text-gray-600">
                Wide network of verified healthcare providers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of others who have already chosen our health card platform
          </p>
          <Link
            href="/signup"
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
