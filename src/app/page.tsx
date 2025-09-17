'use client';

import { useState } from 'react';
import { WifiIcon } from '@heroicons/react/24/solid';
import PaymentModal from './components/PaymentModal';

interface Plan {
  id: string;
  price: number;
  duration: string;
  timeUnit: string;
}

const plans: Plan[] = [
  { id: '1', price: 5, duration: '30', timeUnit: 'mins' },
  { id: '2', price: 10, duration: '2', timeUnit: 'hrs' },
  { id: '3', price: 20, duration: '4', timeUnit: 'hrs' },
  { id: '4', price: 35, duration: '7', timeUnit: 'hrs' },
  { id: '5', price: 75, duration: '24', timeUnit: 'hrs' },
  { id: '6', price: 130, duration: '24', timeUnit: 'mins' },
  { id: '7', price: 375, duration: '7', timeUnit: 'days' },
  { id: '8', price: 950, duration: '9', timeUnit: 'month' }
];

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const handleBuyNow = (planId: string, amount: number) => {
    setSelectedPlan(planId);
    setSelectedAmount(amount);
    setIsPaymentModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/stars-bg.svg')] opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <WifiIcon className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            ADKIMS HOTSPOT
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#0f1729]/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center justify-between border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
                  KES {plan.price}
                </div>
                <div className="text-blue-300/80">
                  for {plan.duration} {plan.timeUnit}
                </div>
              </div>
              <button
                onClick={() => handleBuyNow(plan.id, plan.price)}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={selectedPlan === plan.id}
              >
                {selectedPlan === plan.id ? 'Processing...' : 'BUY NOW'}
              </button>
            </div>
          ))}
        </div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(undefined);
          }}
          amount={selectedAmount}
        />
      </div>
    </main>
  );
}

