import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHumanizer } from '../context/HumanizerContext';
import { useNavigate } from 'react-router-dom';

interface PlanOption {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

const Payment: React.FC = () => {
  const { user } = useAuth();
  const { creditInfo } = useHumanizer();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState<string>(creditInfo?.planType || 'free');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'paypal'>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const plans: PlanOption[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      credits: 100,
      features: ['100 credits', 'Basic humanization', 'Standard support']
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      credits: 5000,
      features: ['5,000 credits', 'Advanced humanization', 'Email support', 'Analytics dashboard']
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19.99,
      credits: 15000,
      features: ['15,000 credits', 'Priority processing', 'Priority support', 'Advanced analytics']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      credits: 50000,
      features: ['50,000 credits', 'Custom integration options', '24/7 support', 'Dedicated account manager']
    }
  ];
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simple validation
    if (paymentMethod === 'credit' && (!cardNumber || !cardName || !expiration || !cvv)) {
      setError('Please fill out all payment fields');
      setLoading(false);
      return;
    }
    
    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message and redirect
      setSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan) || plans[0];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Subscription Management</h1>
      
      {success ? (
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Payment Successful!</h2>
          <p className="text-green-600">
            Your subscription has been updated. You will be redirected to your account page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan selection */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Choose a Plan</h2>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {plans.map(plan => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPlan === plan.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">
                          ${plan.price.toFixed(2)}
                        </span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                    </div>
                    <p className="font-medium text-green-600 mb-2">{plan.credits.toLocaleString()} credits</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Method</h2>
              
              <div className="mb-4 space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    paymentMethod === 'credit' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    paymentMethod === 'paypal' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  PayPal
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-800">
                  {error}
                </div>
              )}
              
              {paymentMethod === 'credit' ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        id="expiration"
                        value={expiration}
                        onChange={(e) => setExpiration(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Processing...' : `Subscribe for $${selectedPlanDetails.price.toFixed(2)}/month`}
                  </button>
                </form>
              ) : (
                <div className="text-center p-6">
                  <p className="mb-6 text-gray-600">
                    You will be redirected to PayPal to complete your purchase.
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`py-3 px-8 rounded-lg font-medium text-white ${
                      loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Continue to PayPal'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-white shadow-lg rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">{selectedPlanDetails.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Credits</span>
                  <span className="font-medium">{selectedPlanDetails.credits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="font-medium">Monthly</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-4">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="text-xl font-bold text-blue-600">${selectedPlanDetails.price.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                <p className="mb-2">
                  Your subscription will renew automatically each month. You can cancel at any time from your account settings.
                </p>
                <p>
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment; 