import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  credits: number;
  features: string[];
}

const Pricing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Backend API base URL – use env var in production, fallback to Heroku deployment
  const API_URL = process.env.REACT_APP_API_URL || 'https://ai-humanizer-backend-7e417b1aab8a.herokuapp.com/api';

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_URL}/subscriptions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pricing plans');
        }
        
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError('Error loading pricing plans. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    if (isAuthenticated) {
      navigate('/payment', { state: { planId } });
    } else {
      navigate('/signup', { state: { planId } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that best suits your needs, from individual to enterprise solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                <div className="flex items-baseline">
                  {plan.price > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 ml-1">/{plan.interval}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-green-600">Free</span>
                  )}
                </div>
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </div>
              
              <div className="p-6 bg-gray-50 flex-grow">
                <p className="font-medium text-gray-700 mb-4">
                  {plan.credits === -1 ? 'Unlimited credits' : `${plan.credits.toLocaleString()} credits per ${plan.interval}`}
                </p>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6">
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.id === 'free' 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isAuthenticated ? 'Select Plan' : 'Sign Up'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Need a custom solution?</h3>
          <p className="text-gray-600 mb-6">
            Contact us to discuss custom pricing options for larger teams and specialized requirements.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
        
        <div className="mt-16">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h3>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">How do credits work?</h4>
              <p className="text-gray-600">
                Credits are consumed based on the length of text processed. Short texts (under 500 characters) cost 1 credit, with longer texts requiring more credits. Credits reset monthly with your subscription.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated amount for the remainder of your billing cycle. When downgrading, the new plan will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact us within 7 days of your purchase for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 