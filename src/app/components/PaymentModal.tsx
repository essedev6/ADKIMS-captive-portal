'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useWebSocket } from '../../contexts/WebSocketContext';

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
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { lastPayment } = useWebSocket();

  useEffect(() => {
    if (lastPayment && paymentId === lastPayment._id) {
      if (lastPayment.status === 'completed') {
        setResponse('✅ Payment completed successfully! Thank you for your payment.');
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else if (lastPayment.status === 'failed') {
        setResponse(`❌ Payment failed: ${lastPayment.resultDesc || 'Please try again'}`);
        setLoading(false);
      }
    }
  }, [lastPayment, paymentId]);

  const sanitizePhone = (input: string) => {
    let digits = input.replace(/\D/g, ''); // keep only digits
    
    // Handle all Kenyan mobile prefixes properly
    if (digits.startsWith('0')) {
      digits = '254' + digits.slice(1); // 07... → 2547..., 011... → 25411...
    }
    // Ensure it starts with 254
    else if (!digits.startsWith('254')) {
      digits = '254' + digits;
    }
    
    return digits;
  };

  const validatePhone = (phone: string) => {
    const formattedPhone = sanitizePhone(phone);
    // Allow ALL valid Kenyan mobile prefixes including 25411 (Safaricom)
    return /^254(7|1[0-1])\d{8}$/.test(formattedPhone);
  };

  const isSafaricomNumber = (phone: string) => {
    const formattedPhone = sanitizePhone(phone);
    // Safaricom prefixes: 2547, 25410, 25411
    return /^254(7|10|11)[0-9]{8}$/.test(formattedPhone);
  };

  const handlePayment = async () => {
    if (!phone.trim()) {
      setResponse('❌ Please enter your phone number');
      return;
    }

    const formattedPhone = sanitizePhone(phone);
    console.log('Formatted phone:', formattedPhone);

    if (!validatePhone(formattedPhone)) {
      setResponse('❌ Invalid phone number format. Please use a valid Kenyan number (e.g., 0712345678 or 0117807625)');
      return;
    }

    if (!isSafaricomNumber(formattedPhone)) {
      setResponse('❌ Please use a Safaricom number (starts with 07, 010, or 011)');
      return;
    }

    if (!amount || amount <= 0) {
      setResponse('❌ Invalid amount selected');
      return;
    }

    setLoading(true);
    setResponse('');
    
    try {
      console.log('Sending request with:', {
        phone: formattedPhone,
        amount: amount,
        accountNumber: 'ADKIMS HOTSPOT PAY'
      });

      // TEMPORARY WORKAROUND: Convert 25411 to 2547 for backend compatibility
      let backendPhone = formattedPhone;
      if (formattedPhone.startsWith('25411')) {
        backendPhone = '2547' + formattedPhone.substring(5);
        console.log('Converted phone for backend:', backendPhone);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: backendPhone,
          amount: amount,
          planId: 'direct-payment',
          planName: 'Direct Payment',
          type: 'direct',
          accountReference: 'ADKIMS HOTSPOT PAY',
        }),
      });

      // Debug logging
      console.log('=== DEBUG RESPONSE ===');
      console.log('Status:', res.status);
      console.log('Status Text:', res.statusText);
      
      const data = await res.json();
      console.log('Full response data:', data);
      console.log('=== END DEBUG ===');

      // Smart response handling - check both status code and response data
      const isSuccessByData = data.success || data.transactionId || data.checkoutRequestId;
      const isSuccessByStatus = res.status === 200 || res.status === 201;
      
      if (isSuccessByStatus || isSuccessByData) {
        // Success case - payment request was accepted
        if (data.transactionId) {
          setPaymentId(data.transactionId);
          console.log('Tracking payment with transactionId:', data.transactionId);
        } else if (data.checkoutRequestId) {
          setPaymentId(data.checkoutRequestId);
          console.log('Tracking payment with checkoutRequestId:', data.checkoutRequestId);
        }
        
        // Set success message based on response data
        if (data.message) {
          setResponse(`✅ ${data.message}`);
        } else {
          setResponse('✅ Payment request sent! Check your phone for the M-Pesa prompt.');
        }
        
      } else {
        // Handle error cases
        let errorMessage = 'Payment request failed';
        
        if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : data.error.message || errorMessage;
        } else if (data.message && data.message !== 'Success') {
          errorMessage = data.message;
        } else if (data.responseDescription) {
          errorMessage = data.responseDescription;
        } else if (data.ResultDesc) {
          errorMessage = data.ResultDesc;
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (err: Error | unknown) {
      console.error('Payment Error:', err);
      
      // User-friendly error messages
      let errorMessage = err.message || 'Failed to process payment. Please try again.';
      
      // Handle specific error patterns
      if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Network')) {
        errorMessage = '❌ Network error. Please check your internet connection and try again.';
      } else if (errorMessage.includes('2547XXXXXXXX')) {
        errorMessage = '❌ System configuration error. Please contact support.';
      } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        errorMessage = '❌ Server is temporarily unavailable. Please try again in a moment.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT') || errorMessage.includes('Timeout')) {
        errorMessage = '❌ Request timeout. Please try again.';
      } else if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
        errorMessage = '❌ Insufficient M-Pesa balance. Please ensure you have enough funds.';
      } else if (errorMessage.includes('cancel') || errorMessage.includes('Cancel')) {
        errorMessage = '❌ Payment was cancelled. Please try again.';
      } else if (errorMessage.includes('invalid') || errorMessage.includes('Invalid')) {
        errorMessage = `❌ ${errorMessage}`;
      } else {
        // Generic error formatting
        errorMessage = errorMessage.startsWith('❌') ? errorMessage : `❌ ${errorMessage}`;
      }
      
      setResponse(errorMessage);
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (response) setResponse('');
  };

  const handleClose = () => {
    setPhone('');
    setResponse('');
    setPaymentId(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-xl sm:p-8">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6">
            M-Pesa Payment
          </Dialog.Title>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Safaricom Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 0712345678 or 0117807625"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <small className="text-xs text-gray-500 mt-1 block">
                  💡 <strong>Safaricom numbers</strong> - Format: 07..., 010..., or 011...
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
                className={`mt-4 p-4 rounded-md text-sm ${
                  response.includes('❌') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {response}
              </div>
            )}

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && paymentId && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <strong>Debug:</strong> Tracking payment ID: {paymentId}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}