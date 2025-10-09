'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: number;
  bandwidthLimit?: number;
  timeLimit?: number;
  description?: string;
}

interface PlanCardProps {
  plan: Plan;
  primaryColor?: string;
}

export function PlanCard({ plan, primaryColor = '#0ea5e9' }: PlanCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async () => {
    setLoading(true);
    try {
      // Create payment session
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          price: plan.price,
          planName: plan.name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const { paymentUrl } = await response.json();
      router.push(paymentUrl);
    } catch (error) {
      console.error('Error creating payment session:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(plan.price);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
          {plan.name}
        </h3>
        <div className="mb-6">
          <span className="text-3xl font-bold">{formattedPrice}</span>
        </div>
        {plan.description && (
          <p className="text-gray-600 mb-6">{plan.description}</p>
        )}
        {plan.bandwidthLimit && (
          <div className="mb-2">
            <span className="text-gray-600">✓ Up to {plan.bandwidthLimit}Mbps</span>
          </div>
        )}
        {plan.timeLimit && (
          <div className="mb-2">
            <span className="text-gray-600">✓ Valid for {formatDuration(plan.timeLimit)}</span>
          </div>
        )}
        <button
          onClick={handleSelectPlan}
          disabled={loading}
          className="w-full mt-6 px-4 py-2 rounded-md text-white font-semibold transition-colors"
          style={{ 
            backgroundColor: primaryColor,
            opacity: loading ? 0.7 : 1 
          }}
        >
          {loading ? 'Processing...' : 'Select Plan'}
        </button>
      </div>
    </motion.div>
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