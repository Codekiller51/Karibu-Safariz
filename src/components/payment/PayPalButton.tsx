import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Shield, Lock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { BookingForm, PaymentDetails } from '../../types';

interface PayPalButtonProps {
  bookingData: BookingForm;
  onSuccess: (paymentDetails: PaymentDetails) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  bookingData,
  onSuccess,
  onError,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: bookingData.currency,
    intent: 'capture',
    'enable-funding': 'venmo,paylater',
    'disable-funding': 'credit,card'
  };

  const createOrder = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_data: bookingData,
          amount: bookingData.total_amount,
          currency: bookingData.currency,
          description: `Booking for ${bookingData.customer_name} - Tour on ${bookingData.start_date}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const orderData = await response.json();
      return orderData.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      setPaymentStatus('error');
      onError('Failed to initialize payment. Please try again.');
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-capture-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: data.orderID,
          booking_data: bookingData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture PayPal payment');
      }

      const paymentResult = await response.json();
      setPaymentStatus('success');
      setIsProcessing(false);
      
      onSuccess(paymentResult.payment_details);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      setPaymentStatus('error');
      setIsProcessing(false);
      onError('Payment processing failed. Please contact support if you were charged.');
    }
  };

  const onErrorHandler = (err: any) => {
    console.error('PayPal error:', err);
    setPaymentStatus('error');
    setIsProcessing(false);
    onError('Payment failed. Please try again or contact support.');
  };

  const onCancelHandler = () => {
    setPaymentStatus('idle');
    setIsProcessing(false);
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 text-green-600">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <Lock className="h-5 w-5" />
          <span className="text-sm font-medium">256-bit Encryption</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-600">
          <CreditCard className="h-5 w-5" />
          <span className="text-sm font-medium">PCI Compliant</span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-blue-800">Base Price ({bookingData.participants} participants):</span>
            <span className="font-medium">${bookingData.base_price.toFixed(2)}</span>
          </div>
          {bookingData.additional_fees.map((fee, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-blue-800">{fee.name}:</span>
              <span className="font-medium">${fee.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-blue-200 pt-2 flex justify-between text-lg font-bold text-blue-900">
            <span>Total Amount:</span>
            <span>${bookingData.total_amount.toFixed(2)} {bookingData.currency}</span>
          </div>
        </div>
      </div>

      {/* Payment Status Messages */}
      {paymentStatus === 'processing' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
            <span>Processing your payment securely...</span>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Payment successful! Redirecting to confirmation...</span>
          </div>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span>Payment failed. Please try again or contact support.</span>
          </div>
        </div>
      )}

      {/* PayPal Buttons */}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 50
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
          onCancel={onCancelHandler}
          disabled={isProcessing}
        />
      </PayPalScriptProvider>

      {/* Security Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Your Security is Our Priority</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All transactions are encrypted with 256-bit SSL</li>
          <li>• We never store your payment information</li>
          <li>• PayPal Buyer Protection covers eligible purchases</li>
          <li>• PCI DSS compliant payment processing</li>
          <li>• Fraud monitoring and prevention systems active</li>
        </ul>
      </div>

      {/* Customer Support */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Need help? Contact our support team at <strong>support@kilimanjarogates.com</strong> or use the live chat.</p>
      </div>
    </div>
  );
};

export default PayPalButton;