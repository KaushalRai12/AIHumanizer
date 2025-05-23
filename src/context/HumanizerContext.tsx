import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface TextAnalysis {
  id: number;
  originalText: string;
  humanizedText: string;
  characterCount: number;
  creditsUsed: number;
  createdAt: string;
}

interface CreditInfo {
  planType: string;
  creditsTotal: number;
  creditsUsed: number;
  creditsRemaining: number;
  subscriptionEnds: string;
}

interface HumanizerContextType {
  inputText: string;
  setInputText: (text: string) => void;
  humanizedText: string;
  humanizationLevel: string;
  setHumanizationLevel: (level: string) => void;
  isHumanizing: boolean;
  error: string | null;
  humanizeText: () => Promise<void>;
  textHistory: TextAnalysis[];
  loadingHistory: boolean;
  fetchHistory: () => Promise<void>;
  estimateCredits: (text: string) => number;
  creditInfo: CreditInfo | null;
  fetchCreditInfo: () => Promise<void>;
  loadingCreditInfo: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || 'https://ai-humanizer-backend-7e417b1aab8a.herokuapp.com/api';

const HumanizerContext = createContext<HumanizerContextType | undefined>(undefined);

export const HumanizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inputText, setInputText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [humanizationLevel, setHumanizationLevel] = useState('moderate');
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textHistory, setTextHistory] = useState<TextAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [loadingCreditInfo, setLoadingCreditInfo] = useState(false);
  
  const { token } = useAuth();
  
  // Calculate credits needed based on text length
  const estimateCredits = (text: string): number => {
    const charCount = text.length;
    
    if (charCount <= 500) return 1;
    if (charCount <= 1000) return 2;
    if (charCount <= 2000) return 4;
    if (charCount <= 5000) return 10;
    return 20; // 5000+ chars
  };
  
  // Humanize text
  const humanizeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanize');
      return;
    }
    
    if (!token) {
      setError('You must be logged in to humanize text');
      return;
    }
    
    setIsHumanizing(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/text/humanize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: inputText,
          level: humanizationLevel
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to humanize text');
      }
      
      const data = await response.json();
      setHumanizedText(data.humanizedText);
      
      // Refresh credit info after humanization
      fetchCreditInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsHumanizing(false);
    }
  };
  
  // Fetch text history
  const fetchHistory = async () => {
    if (!token) return;
    
    setLoadingHistory(true);
    
    try {
      const response = await fetch(`${API_URL}/text/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      setTextHistory(data.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };
  
  // Fetch credit info
  const fetchCreditInfo = async () => {
    if (!token) return;
    
    setLoadingCreditInfo(true);
    
    try {
      const response = await fetch(`${API_URL}/users/credits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch credit info');
      }
      
      const data = await response.json();
      setCreditInfo(data);
    } catch (err) {
      console.error('Error fetching credit info:', err);
    } finally {
      setLoadingCreditInfo(false);
    }
  };
  
  // Load initial data when user is authenticated
  useEffect(() => {
    if (token) {
      fetchCreditInfo();
      fetchHistory();
    }
  }, [token]);
  
  return (
    <HumanizerContext.Provider
      value={{
        inputText,
        setInputText,
        humanizedText,
        humanizationLevel,
        setHumanizationLevel,
        isHumanizing,
        error,
        humanizeText,
        textHistory,
        loadingHistory,
        fetchHistory,
        estimateCredits,
        creditInfo,
        fetchCreditInfo,
        loadingCreditInfo
      }}
    >
      {children}
    </HumanizerContext.Provider>
  );
};

export const useHumanizer = () => {
  const context = useContext(HumanizerContext);
  if (context === undefined) {
    throw new Error('useHumanizer must be used within a HumanizerProvider');
  }
  return context;
}; 