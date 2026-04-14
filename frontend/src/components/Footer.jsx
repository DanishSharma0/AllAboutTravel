export default function Footer() {
  return (
    <footer className="bg-sand-100 text-slate-600 py-12 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900">TravelHub</h3>
            <p>
              Your one-stop platform for travel, tours, accommodations, and local experiences in India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-brand-600 transition">Home</a></li>
              <li><a href="/hostels" className="hover:text-brand-600 transition">Hostels</a></li>
              <li><a href="/tour-guides" className="hover:text-brand-600 transition">Tour Guides</a></li>
              <li><a href="/map" className="hover:text-brand-600 transition">Map</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900">Services</h3>
            <ul className="space-y-2">
              <li><a href="/places" className="hover:text-brand-600 transition">Places</a></li>
              <li><a href="/rentals" className="hover:text-brand-600 transition">Rentals</a></li>
              <li><a href="/products" className="hover:text-brand-600 transition">Products</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-900">Contact</h3>
            <p>
              Email: info@travelhub.com<br />
              Phone: +91 1234567890
            </p>
          </div>
        </div>

        <div className="border-t border-sand-200 pt-8">
          <p className="text-center text-slate-500">
            &copy; 2024 TravelHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
