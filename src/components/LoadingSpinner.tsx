'use client';

export function LoadingSpinner() {
  return (
    <div className="inline-flex items-center">
      <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin" style={{ 
        borderTopColor: '#60a5fa'
      }}></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
}