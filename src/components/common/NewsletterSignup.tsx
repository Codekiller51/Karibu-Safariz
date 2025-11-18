import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Newsletter signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-primary rounded-lg p-6 md:p-8 text-white">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Get Travel Tips & Exclusive Offers
        </h3>
        <p className="text-white/90 mb-4 text-sm md:text-base">
          Subscribe to our newsletter for exclusive discounts and adventure tips
        </p>

        {isSuccess ? (
          <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-base btn-outline px-4 py-2.5 bg-white text-orange-600 border-0 hover:bg-orange-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
