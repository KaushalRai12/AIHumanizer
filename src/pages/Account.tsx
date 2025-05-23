import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHumanizer } from '../context/HumanizerContext';
import { Link } from 'react-router-dom';

const Account: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { creditInfo } = useHumanizer();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile(formValues);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-800">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Password Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Security</h2>
            
            <button
              className="px-5 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
        
        {/* Right column - Subscription Info */}
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Subscription</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Plan</p>
                <p className="text-gray-800 font-semibold">{creditInfo?.planType || 'Free'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Credits</p>
                <div className="bg-gray-100 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ 
                      width: `${creditInfo ? (creditInfo.creditsUsed / creditInfo.creditsTotal) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {creditInfo ? creditInfo.creditsRemaining : 0} remaining
                  </span>
                  <span className="text-gray-600">
                    {creditInfo ? creditInfo.creditsTotal : 0} total
                  </span>
                </div>
              </div>
              
              {creditInfo?.subscriptionEnds && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Renewal Date</p>
                  <p className="text-gray-800">
                    {new Date(creditInfo.subscriptionEnds).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                <Link
                  to="/payment"
                  className="block text-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 