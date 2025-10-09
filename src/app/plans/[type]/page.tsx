'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentModal from '@/app/components/PaymentModal';

interface Plan {
  id: string;
  name: string;
  price: number;
  bandwidthLimit?: number;
  timeLimit?: number;
  description?: string;
  features?: string[];
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

export default function HomeownerPlansPage() {
  const [pageData, setPageData] = useState<PlanPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number | undefined>();

  useEffect(() => {
    const fetchPlanPage = async () => {
      try {
        console.log('Fetching homeowner plans...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plan-pages/homeowner`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }

        const data = await response.json();
        console.log('Received plan data:', data);
        setPageData(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanPage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-gray-400 text-lg">No plans available</div>
      </div>
    );
  }

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlanAmount(undefined);
  };

  // Homeowner-specific color themes
  const getPlanTheme = (index: number) => {
    const themes = [
      { // Basic Plan
        badge: 'bg-green-600',
        text: 'text-green-400',
        button: 'bg-green-600 hover:bg-green-700',
        badgeText: 'ESSENTIAL'
      },
      { // Standard Plan
        badge: 'bg-teal-600',
        text: 'text-teal-400',
        button: 'bg-teal-600 hover:bg-teal-700',
        badgeText: 'POPULAR'
      },
      { // Premium Plan
        badge: 'bg-cyan-600',
        text: 'text-cyan-400',
        button: 'bg-cyan-600 hover:bg-cyan-700',
        badgeText: 'PREMIUM'
      }
    ];
    return themes[index % themes.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        amount={selectedPlanAmount}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            {pageData.title}
          </motion.h1>
          {pageData.description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              {pageData.description}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <AnimatePresence>
            {pageData.plans.map((plan, index) => {
              const theme = getPlanTheme(index);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 border border-gray-700 backdrop-blur-lg bg-opacity-50"
                >
                  {/* Ribbon Badge */}
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div 
                      className={`absolute transform rotate-45 text-white text-xs py-1 right-[-35px] top-[32px] w-[170px] text-center ${theme.badge}`}
                    >
                      {theme.badgeText}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <span className={`text-4xl font-bold ${theme.text}`}>
                          {new Intl.NumberFormat('en-KE', {
                            style: 'currency',
                            currency: 'KES',
                          }).format(plan.price)}
                        </span>
                      </div>
                      {plan.description && (
                        <p className="text-gray-400">{plan.description}</p>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.bandwidthLimit && (
                        <div className="flex items-center text-gray-300">
                          <svg className={`w-5 h-5 mr-3 ${theme.text}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span>Up to {plan.bandwidthLimit}Mbps</span>
                        </div>
                      )}
                      {plan.timeLimit && (
                        <div className="flex items-center text-gray-300">
                          <svg className={`w-5 h-5 mr-3 ${theme.text}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          <span>{formatDuration(plan.timeLimit)} Access</span>
                        </div>
                      )}
                      {plan.features?.map((feature, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                          <svg className={`w-5 h-5 mr-3 ${theme.text}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlanAmount(plan.price);
                        setIsPaymentModalOpen(true);
                      }}
                      className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 
                        ${theme.button} 
                        shadow-lg hover:shadow-xl hover:shadow-black/20`}
                    >
                      Get Started
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
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