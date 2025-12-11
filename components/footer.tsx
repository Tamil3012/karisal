export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <p className="text-gray-600 text-sm">Your source for quality insights and industry trends.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-gray-900">
                  Categories
                </a>
              </li>
              <li>
                <a href="/dashboard/login" className="hover:text-gray-900">
                  Admin
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-gray-600 text-sm">
              Email: info@bloghub.com
              <br />
              Phone: (555) 000-0000
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; 2025 Blog Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
