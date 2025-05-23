import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHumanizer } from '../context/HumanizerContext';

interface UserStatistics {
  totalTransformations: number;
  totalCharactersProcessed: number;
  totalCreditsSpent: number;
  averageTextLength: number;
  popularTransformationLevel: string;
  lastActivityDate: string | null;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const { creditInfo, textHistory, fetchHistory, loadingHistory } = useHumanizer();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users/statistics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError('Error fetching statistics. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
    fetchHistory();
  }, [token, fetchHistory]);

  // Format the level name for display
  const formatLevel = (level: string): string => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Credits Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Credits</h2>
          
          {creditInfo ? (
            <div>
              <div className="mb-4">
                <span className="text-gray-600">Current Plan:</span>
                <span className="font-semibold ml-2">
                  {creditInfo.planType.charAt(0).toUpperCase() + creditInfo.planType.slice(1)}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Credits Remaining:</span>
                  <span className="font-semibold">
                    {creditInfo.creditsRemaining} / {creditInfo.creditsTotal}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(creditInfo.creditsRemaining / creditInfo.creditsTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-600">Subscription Ends:</span>
                <span className="font-semibold ml-2">
                  {new Date(creditInfo.subscriptionEnds).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No credit information available.</p>
          )}
        </div>

        {/* Statistics Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Statistics</h2>
          
          {statistics ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="border-r border-b border-gray-100 pr-2 pb-2">
                <p className="text-gray-500 text-sm">Total Transformations</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(statistics.totalTransformations)}</p>
              </div>
              
              <div className="border-b border-gray-100 pb-2">
                <p className="text-gray-500 text-sm">Characters Processed</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(statistics.totalCharactersProcessed)}</p>
              </div>
              
              <div className="border-r border-gray-100 pr-2 pt-2">
                <p className="text-gray-500 text-sm">Credits Spent</p>
                <p className="text-2xl font-bold text-red-600">{formatNumber(statistics.totalCreditsSpent)}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-gray-500 text-sm">Average Text Length</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(Math.round(statistics.averageTextLength))}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No statistics available. Start humanizing text to see your stats.</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        
        {loadingHistory ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : textHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity. Start humanizing text!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Characters
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits Used
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Text Preview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {textHistory.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatNumber(item.characterCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.creditsUsed}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {item.humanizedText.substring(0, 50)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 