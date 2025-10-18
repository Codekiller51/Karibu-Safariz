import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  AlertCircle, 
  Info,
  Shield,
  FileText,
  CheckCircle,
  X
} from 'lucide-react';
import { TourPackage, BookingForm as BookingFormType, AdditionalFee } from '../../types';
import PayPalButton from '../payment/PayPalButton';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Please enter a valid email address'),
  customer_phone: z.string().min(10, 'Please enter a valid phone number'),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  nationality: z.string().min(2, 'Please enter your nationality'),
  
  start_date: z.string().min(1, 'Please select a start date'),
  participants: z.number().min(1, 'At least 1 participant required'),
  
  dietary_requirements: z.string().optional(),
  medical_conditions: z.string().optional(),
  accessibility_needs: z.string().optional(),
  special_requests: z.string().optional(),
  
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  cancellation_policy_accepted: z.boolean().refine(val => val === true, 'You must accept the cancellation policy'),
  privacy_policy_accepted: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  tour: TourPackage;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormType | null>(null);
  const [participantDetails, setParticipantDetails] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participants: 1,
      terms_accepted: false,
      cancellation_policy_accepted: false,
      privacy_policy_accepted: false,
    }
  });

  const participants = watch('participants');

  // Calculate pricing
  const calculatePricing = (participantCount: number) => {
    const basePrice = tour.price_usd * participantCount;
    
    const additionalFees: AdditionalFee[] = [
      {
        name: 'Park Fees',
        amount: 50 * participantCount,
        description: 'National park entrance fees',
        mandatory: true
      },
      {
        name: 'Service Fee',
        amount: basePrice * 0.05,
        description: 'Booking and processing fee',
        mandatory: true
      },
      {
        name: 'Insurance',
        amount: 25 * participantCount,
        description: 'Travel insurance coverage',
        mandatory: true
      }
    ];

    const totalFees = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalAmount = basePrice + totalFees;

    return {
      basePrice,
      additionalFees,
      totalAmount
    };
  };

  const pricing = calculatePricing(participants);

  // Update participant details when count changes
  React.useEffect(() => {
    const newDetails = Array.from({ length: participants }, (_, index) => ({
      name: participantDetails[index]?.name || '',
      age: participantDetails[index]?.age || '',
      nationality: participantDetails[index]?.nationality || '',
      dietary_requirements: participantDetails[index]?.dietary_requirements || '',
      medical_conditions: participantDetails[index]?.medical_conditions || ''
    }));
    setParticipantDetails(newDetails);
  }, [participants]);

  const updateParticipantDetail = (index: number, field: string, value: string) => {
    const updated = [...participantDetails];
    updated[index] = { ...updated[index], [field]: value };
    setParticipantDetails(updated);
  };

  const onSubmit = (data: BookingFormData) => {
    const formData: BookingFormType = {
      ...data,
      tour_id: tour.id,
      participant_details: participantDetails,
      base_price: pricing.basePrice,
      additional_fees: pricing.additionalFees,
      total_amount: pricing.totalAmount,
      currency: 'USD'
    };

    setBookingData(formData);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentDetails: any) => {
    // Handle successful payment
    console.log('Payment successful:', paymentDetails);
    onSuccess();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Show error message to user
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (showPayment && bookingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Payment</h2>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <PayPalButton
              bookingData={bookingData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Your Adventure</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 ${currentStep >= step ? 'text-orange-600' : 'text-gray-500'}`}>
                    {step === 1 ? 'Personal Info' : step === 2 ? 'Participants' : 'Review & Pay'}
                  </span>
                  {step < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('customer_name')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.customer_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('customer_email')}
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.customer_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('customer_phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.customer_phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <input
                      {...register('nationality')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your nationality"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-red-600">{errors.nationality.message}</p>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3">Emergency Contact (Recommended)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-800 mb-1">
                        Emergency Contact Name
                      </label>
                      <input
                        {...register('emergency_contact_name')}
                        type="text"
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Contact person name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-800 mb-1">
                        Emergency Contact Phone
                      </label>
                      <input
                        {...register('emergency_contact_phone')}
                        type="tel"
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Contact person phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('start_date')}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    {errors.start_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Participants *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        {...register('participants', { valueAsNumber: true })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      >
                        {Array.from({ length: tour.max_participants }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} participant{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    {errors.participants && (
                      <p className="mt-1 text-sm text-red-600">{errors.participants.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Continue to Participant Details
                </button>
              </div>
            )}

            {/* Step 2: Participant Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Participant Details</h3>
                
                {participantDetails.map((participant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Participant {index + 1} {index === 0 && '(Lead Traveler)'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) => updateParticipantDetail(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={participant.age}
                          onChange={(e) => updateParticipantDetail(index, 'age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Age"
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nationality *
                        </label>
                        <input
                          type="text"
                          value={participant.nationality}
                          onChange={(e) => updateParticipantDetail(index, 'nationality', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Nationality"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dietary Requirements
                        </label>
                        <input
                          type="text"
                          value={participant.dietary_requirements}
                          onChange={(e) => updateParticipantDetail(index, 'dietary_requirements', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Any dietary restrictions"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medical Conditions
                        </label>
                        <input
                          type="text"
                          value={participant.medical_conditions}
                          onChange={(e) => updateParticipantDetail(index, 'medical_conditions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Any medical conditions"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Special Requirements */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Additional Requirements</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accessibility Needs
                    </label>
                    <textarea
                      {...register('accessibility_needs')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any accessibility requirements or mobility assistance needed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      {...register('special_requests')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any special requests or preferences for your tour"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Review & Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Terms */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Booking</h3>
                
                {/* Pricing Breakdown */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-4">Pricing Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-800">Base Price ({participants} participants):</span>
                      <span className="font-medium">${pricing.basePrice.toFixed(2)}</span>
                    </div>
                    {pricing.additionalFees.map((fee, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-blue-800">{fee.name}:</span>
                        <span className="font-medium">${fee.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-blue-200 pt-2 flex justify-between text-lg font-bold text-blue-900">
                      <span>Total Amount:</span>
                      <span>${pricing.totalAmount.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Cancellation Policy
                  </h4>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Full refund for cancellations 60+ days before departure</li>
                    <li>• 50% refund for cancellations 30-59 days before departure</li>
                    <li>• 25% refund for cancellations 14-29 days before departure</li>
                    <li>• No refund for cancellations less than 14 days before departure</li>
                    <li>• Emergency cancellations may be eligible for partial refund</li>
                  </ul>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      {...register('terms_accepted')}
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      I accept the <a href="/terms" target="_blank" className="text-orange-600 hover:underline">Terms and Conditions</a> *
                    </label>
                  </div>
                  {errors.terms_accepted && (
                    <p className="text-sm text-red-600">{errors.terms_accepted.message}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <input
                      {...register('cancellation_policy_accepted')}
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      I understand and accept the cancellation policy outlined above *
                    </label>
                  </div>
                  {errors.cancellation_policy_accepted && (
                    <p className="text-sm text-red-600">{errors.cancellation_policy_accepted.message}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <input
                      {...register('privacy_policy_accepted')}
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      I accept the <a href="/privacy" target="_blank" className="text-orange-600 hover:underline">Privacy Policy</a> and consent to data processing *
                    </label>
                  </div>
                  {errors.privacy_policy_accepted && (
                    <p className="text-sm text-red-600">{errors.privacy_policy_accepted.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Proceed to Secure Payment</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;