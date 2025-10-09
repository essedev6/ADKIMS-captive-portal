'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: number;
  bandwidthLimit?: number;
  timeLimit?: number;
  description?: string;
}

interface PlanPage {
  title: string;
  description?: string;
  type: string;
  plans: Plan[];
  customStyles?: {
    primaryColor?: string;
    backgroundColor?: string;
    headerImage?: string;
  };
}

export default function TemplatePlansPage({ params }: { params: { type: string } }) {
  const [pageData, setPageData] = useState<PlanPage | null>(null);
  const [loading, setLoading] = useState(true);

  // For debugging
  useEffect(() => {
    console.log('Template type:', params.type);
    if (!['outdoor', 'homeowner'].includes(params.type)) {
      notFound();
    }
  }, [params.type]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlanPage = async () => {
      try {
        console.log('Fetching plan page for type:', params.type);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/plan-pages/${params.type}`;
        console.log('Fetching URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Response not OK:', response.status, errorData);
          throw new Error(errorData.message || 'Failed to fetch plan page');
        }

        const data = await response.json();
        console.log('Received data:', data);

        if (!data || !data.plans || !Array.isArray(data.plans)) {
          throw new Error('Invalid plan data received');
        }

        setPageData(data);
      } catch (err) {
        console.error('Error fetching plan page:', err);
        setError('Failed to load plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanPage();
  }, [params.type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No plans available</div>
      </div>
    );
  }

  const { backgroundColor = '#f3f4f6', primaryColor = '#3b82f6' } = pageData.customStyles || {};

  return (
    <div style={{ backgroundColor }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {pageData.customStyles?.headerImage && (
          <div className="relative w-full h-48 mb-8 rounded-lg overflow-hidden">
            <Image
              src={pageData.customStyles.headerImage}
              alt="Header"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: primaryColor }}>
            {pageData.title || 'Our Plans'}
          </h1>
          {pageData.description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {pageData.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageData.plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    {new Intl.NumberFormat('en-KE', {
                      style: 'currency',
                      currency: 'KES',
                    }).format(plan.price)}
                  </span>
                </div>
                {plan.description && (
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                )}
                <div className="space-y-3">
                  {plan.bandwidthLimit && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Up to {plan.bandwidthLimit}Mbps
                    </div>
                  )}
                  {plan.timeLimit && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {formatDuration(plan.timeLimit)} Access
                    </div>
                  )}
                </div>
                <button
                  onClick={() => window.location.href = `/payment?planId=${plan.id}&amount=${plan.price}&name=${encodeURIComponent(plan.name)}`}
                  className="w-full mt-6 px-4 py-2 rounded-md text-white font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Select Plan
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds >= 2592000) { // month
    const months = Math.floor(seconds / 2592000);
    return `${months} ${months === 1 ? 'Month' : 'Months'}`;
  } else if (seconds >= 604800) { // week
    const weeks = Math.floor(seconds / 604800);
    return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
  } else if (seconds >= 86400) { // day
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? 'Day' : 'Days'}`;
  } else if (seconds >= 3600) { // hour
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
  } else {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`;
  }
}