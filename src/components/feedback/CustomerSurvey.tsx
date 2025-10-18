import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Star, 
  Camera, 
  Upload, 
  X, 
  Send, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle,
  Award,
  CheckCircle
} from 'lucide-react';
import { CustomerSurvey } from '../../types';

const surveySchema = z.object({
  overall_rating: z.number().min(1, 'Please provide an overall rating').max(5),
  service_quality_rating: z.number().min(1, 'Please rate the service quality').max(5),
  value_for_money_rating: z.number().min(1, 'Please rate the value for money').max(5),
  guide_performance_rating: z.number().min(1, 'Please rate the guide performance').max(5),
  
  what_went_well: z.string().min(10, 'Please tell us what went well (minimum 10 characters)'),
  areas_for_improvement: z.string().optional(),
  additional_comments: z.string().optional(),
  
  would_recommend: z.boolean(),
  likelihood_to_return: z.number().min(1).max(10),
});

type SurveyFormData = z.infer<typeof surveySchema>;

interface CustomerSurveyProps {
  bookingId: string;
  tourTitle: string;
  customerName: string;
  onSubmit: (surveyData: Partial<CustomerSurvey>) => void;
  onClose: () => void;
}

const CustomerSurvey: React.FC<CustomerSurveyProps> = ({
  bookingId,
  tourTitle,
  customerName,
  onSubmit,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      overall_rating: 0,
      service_quality_rating: 0,
      value_for_money_rating: 0,
      guide_performance_rating: 0,
      would_recommend: true,
      likelihood_to_return: 5,
    }
  });

  const watchedRatings = watch(['overall_rating', 'service_quality_rating', 'value_for_money_rating', 'guide_performance_rating']);
  const wouldRecommend = watch('would_recommend');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedPhotos.length + files.length > 5) {
      alert('You can upload maximum 5 photos');
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }
    });

    setUploadedPhotos(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmitSurvey = async (data: SurveyFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would upload photos to storage first
      const photoUrls: string[] = [];
      
      // Simulate photo upload
      if (uploadedPhotos.length > 0) {
        for (let i = 0; i < uploadedPhotos.length; i++) {
          photoUrls.push(`https://example.com/survey-photos/${Date.now()}-${i}.jpg`);
        }
      }

      const surveyData: Partial<CustomerSurvey> = {
        ...data,
        booking_id: bookingId,
        photos: photoUrls,
        completed_at: new Date().toISOString(),
      };

      await onSubmit(surveyData);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }> = ({ rating, onRatingChange, label }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } transition-colors hover:text-yellow-400`}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600">
          {rating > 0 && (
            <>
              {rating} of 5 stars
              {rating === 5 && ' - Excellent!'}
              {rating === 4 && ' - Very Good'}
              {rating === 3 && ' - Good'}
              {rating === 2 && ' - Fair'}
              {rating === 1 && ' - Poor'}
            </>
          )}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
              <p className="text-gray-600">Help us improve and help other travelers</p>
            </div>
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
                  <span className={`ml-2 text-sm ${currentStep >= step ? 'text-orange-600' : 'text-gray-500'}`}>
                    {step === 1 ? 'Ratings' : step === 2 ? 'Feedback' : 'Photos & Submit'}
                  </span>
                  {step < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitSurvey)} className="space-y-6">
            {/* Step 1: Ratings */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Tour: {tourTitle}</h3>
                  <p className="text-blue-800 text-sm">Dear {customerName}, we'd love to hear about your experience!</p>
                </div>

                <StarRating
                  rating={watchedRatings[0] || 0}
                  onRatingChange={(rating) => setValue('overall_rating', rating)}
                  label="Overall Experience *"
                />
                {errors.overall_rating && (
                  <p className="text-sm text-red-600">{errors.overall_rating.message}</p>
                )}

                <StarRating
                  rating={watchedRatings[1] || 0}
                  onRatingChange={(rating) => setValue('service_quality_rating', rating)}
                  label="Service Quality *"
                />
                {errors.service_quality_rating && (
                  <p className="text-sm text-red-600">{errors.service_quality_rating.message}</p>
                )}

                <StarRating
                  rating={watchedRatings[2] || 0}
                  onRatingChange={(rating) => setValue('value_for_money_rating', rating)}
                  label="Value for Money *"
                />
                {errors.value_for_money_rating && (
                  <p className="text-sm text-red-600">{errors.value_for_money_rating.message}</p>
                )}

                <StarRating
                  rating={watchedRatings[3] || 0}
                  onRatingChange={(rating) => setValue('guide_performance_rating', rating)}
                  label="Guide Performance *"
                />
                {errors.guide_performance_rating && (
                  <p className="text-sm text-red-600">{errors.guide_performance_rating.message}</p>
                )}

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={watchedRatings.some(rating => !rating)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Feedback
                </button>
              </div>
            )}

            {/* Step 2: Written Feedback */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What went well? *
                  </label>
                  <textarea
                    {...register('what_went_well')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tell us about the highlights of your experience..."
                  />
                  {errors.what_went_well && (
                    <p className="mt-1 text-sm text-red-600">{errors.what_went_well.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas for improvement
                  </label>
                  <textarea
                    {...register('areas_for_improvement')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="How can we improve our service? (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional comments
                  </label>
                  <textarea
                    {...register('additional_comments')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any other feedback you'd like to share? (Optional)"
                  />
                </div>

                {/* Recommendation */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Would you recommend us to friends and family? *
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setValue('would_recommend', true)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                          wouldRecommend === true
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsUp className="h-5 w-5" />
                        <span>Yes, definitely!</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('would_recommend', false)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                          wouldRecommend === false
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsDown className="h-5 w-5" />
                        <span>Not likely</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How likely are you to book with us again? (1-10) *
                    </label>
                    <input
                      {...register('likelihood_to_return', { valueAsNumber: true })}
                      type="range"
                      min="1"
                      max="10"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Not likely</span>
                      <span>Very likely</span>
                    </div>
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
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Photos and Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Your Photos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Camera className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload photos from your adventure
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Maximum 5 photos, 10MB each
                      </span>
                    </label>
                  </div>

                  {/* Photo Previews */}
                  {photoPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Privacy & Usage</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your feedback helps us improve our services</li>
                    <li>• Photos may be used for marketing with your permission</li>
                    <li>• Personal information is kept confidential</li>
                    <li>• You can request removal of your review anytime</li>
                  </ul>
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
                    disabled={isSubmitting}
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Survey</span>
                      </>
                    )}
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

export default CustomerSurvey;