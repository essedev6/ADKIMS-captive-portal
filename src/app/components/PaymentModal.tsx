'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
}) {
  const [phone, setPhone] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitizePhone = (input: string) => {
    let digits = input.replace(/\D/g, ''); // keep only digits
    if (digits.startsWith('0')) digits = '254' + digits.slice(1);
    if (!digits.startsWith('254')) digits = '254' + digits;
    return digits;
  };

  const validatePhone = (phone: string) => {
    const formattedPhone = sanitizePhone(phone);
    return /^(2547\d{8}|2541\d{8})$/.test(formattedPhone);
  };

  const formatResponse = (data: { success?: boolean; error?: string | { message: string } }) => {
    if (data.success) {
      return '✅ Payment request sent successfully! Check your phone for the M-Pesa prompt.';
    } else if (data.error) {
      if (typeof data.error === 'string') {
        return `❌ ${data.error}`;
      } else if (data.error.message) {
        return `❌ ${data.error.message}`;
      }
    }
    return '❌ Something went wrong. Please try again.';
  };

  const handlePayment = async () => {
    if (!phone.trim()) {
      setResponse('❌ Please enter your phone number');
      return;
    }

    const formattedPhone = sanitizePhone(phone);
    if (!validatePhone(formattedPhone)) {
      setResponse('❌ Invalid phone number format. Please use format: 254XXXXXXXXX');
      return;
    }

    if (!amount || amount <= 0) {
      setResponse('❌ Invalid amount selected');
      return;
    }

    setLoading(true);
    setResponse('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stkpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: amount,
          accountNumber: 'ADKIMS HOTSPOT PAY',
        }),
      });

      const data = await res.json();
      setResponse(formatResponse(data));
    } catch (err) {
      console.error('Payment Error:', err);
      setResponse('❌ Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-xl sm:p-8">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6">
            M-Pesa Payment
          </Dialog.Title>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 254712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  pattern="^(2547\d{8}|2541\d{8})$"
                />
                <small className="text-xs text-gray-500 mt-1 block">
                  Format: 254XXXXXXXXX (e.g. 254712345678)
                </small>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm font-medium text-gray-700">Amount to Pay</p>
              <p className="text-lg font-semibold text-gray-900">KES {amount?.toLocaleString()}</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Processing Payment...' : 'Pay with M-Pesa'}
            </button>

            {response && (
              <div
                className={`mt-4 p-4 rounded-md ${response.includes('❌')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
                }`}
              >
                {response}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
