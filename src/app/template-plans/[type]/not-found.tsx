import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Plan Type Not Found</h2>
        <p className="text-gray-600 mb-6">
          This plan type doesn't exist. Please check the URL and try again.
        </p>
        <div className="space-x-4">
          <Link 
            href="/template-plans/outdoor"
            className="text-blue-600 hover:text-blue-700"
          >
            View Outdoor Plans
          </Link>
          <span className="text-gray-400">|</span>
          <Link 
            href="/template-plans/homeowner"
            className="text-blue-600 hover:text-blue-700"
          >
            View Home Internet Plans
          </Link>
        </div>
      </div>
    </div>
  );
}