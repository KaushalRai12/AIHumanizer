import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHumanizer } from '../context/HumanizerContext';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { 
    inputText, setInputText, 
    humanizedText, 
    humanizationLevel, setHumanizationLevel,
    isHumanizing, error,
    humanizeText,
    estimateCredits
  } = useHumanizer();
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (humanizedText) {
      navigator.clipboard.writeText(humanizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Humanizer</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Transform AI-generated text into natural, human-like content that bypasses AI detection
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link 
                  to="/signup" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium shadow-md"
                >
                  Get Started Free
                </Link>
                <Link 
                  to="/pricing" 
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium"
                >
                  View Pricing
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Humanizer Tool Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Humanizer Tool</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Original Text</h3>
                  <div className="text-sm text-gray-500">
                    {inputText.length} characters
                    {inputText.length > 0 && (
                      <span className="ml-2 text-blue-600">
                        ({estimateCredits(inputText)} credits)
                      </span>
                    )}
                  </div>
                </div>
                
                <textarea
                  className="flex-grow p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Paste your AI-generated text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={12}
                />
              </div>
              
              {/* Output Section */}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Humanized Text</h3>
                  <button
                    className={`text-sm px-3 py-1 rounded ${
                      copied 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    onClick={handleCopy}
                    disabled={!humanizedText}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                
                <div className="flex-grow p-4 rounded-lg border border-gray-300 bg-gray-50 overflow-auto">
                  {isHumanizing ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Humanizing...</span>
                    </div>
                  ) : humanizedText ? (
                    <p className="whitespace-pre-wrap">{humanizedText}</p>
                  ) : (
                    <p className="text-gray-400 h-full flex items-center justify-center text-center">
                      Humanized text will appear here
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Humanization Level
                </label>
                <div className="flex space-x-4">
                  {['slight', 'moderate', 'substantial'].map((level) => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="humanizationLevel"
                        value={level}
                        checked={humanizationLevel === level}
                        onChange={() => setHumanizationLevel(level)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                onClick={humanizeText}
                disabled={isHumanizing || !inputText.trim()}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isHumanizing || !inputText.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isHumanizing ? 'Processing...' : 'Humanize Text'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <p className="font-medium">Sign up for full access!</p>
                <p className="text-sm mt-1">
                  Create an account to save your humanized texts and access more features.
                </p>
                <div className="mt-2">
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Bypass AI Detection</h3>
              <p className="text-gray-600">
                Our humanization technology transforms AI-generated text to bypass detection tools like Turnitin, GPTZero, and Originality.ai
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quick & Efficient</h3>
              <p className="text-gray-600">
                Transform your text in seconds with our powerful humanization engine, saving you time while maintaining quality
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Customizable</h3>
              <p className="text-gray-600">
                Choose from different humanization levels to control how natural your text becomes while maintaining meaning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to humanize your AI content?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users already using AI Humanizer to create undetectable content.
          </p>
          <Link 
            to={isAuthenticated ? "/dashboard" : "/signup"} 
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium shadow-lg"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 