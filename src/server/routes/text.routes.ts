import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { TextAnalysis } from '../models/textAnalysis.model';
import { hasEnoughCredits, deductCredits } from '../models/subscription.model';
import { updateUserStatistics } from '../models/textStatistics.model';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configuration for Undetectable AI API
const UNDETECTABLE_API_KEY = process.env.UNDETECTABLE_API_KEY || 'your-api-key-here';
const UNDETECTABLE_API_URL = 'https://api.undetectable.ai/v2/humanize';

// Define interface for Undetectable AI API response
interface UndetectableResponse {
  humanized: string;
  original: string;
  status: string;
  [key: string]: any; // For any additional properties
}

// Function to call the Undetectable AI API
const callUndetectableAPI = async (text: string, level: string) => {
  try {
    // Convert level to Undetectable AI level format
    const mappedLevel = level === 'slight' ? 'least' : 
                         level === 'moderate' ? 'medium' : 
                         level === 'substantial' ? 'most' : 'medium';
    
    const response = await axios.post<UndetectableResponse>(
      UNDETECTABLE_API_URL,
      {
        text,
        mode: mappedLevel,
        // Additional parameters as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${UNDETECTABLE_API_KEY}`
        }
      }
    );
    
    // Return the humanized text from the API response
    return response.data.humanized;
  } catch (error) {
    console.error('Error calling Undetectable AI API:', error);
    throw new Error('Failed to humanize text with external API');
  }
};

// Mock function to simulate the Undetectable AI API
// In production, this would be replaced with an actual API call
const mockHumanizeText = async (text: string, level: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple transformations based on humanization level
  let humanizedText = text;
  
  switch (level) {
    case 'slight':
      // Add some filler words and simplify slightly
      humanizedText = text
        .replace(/\b(is|are)\b/g, match => `${match} actually`)
        .replace(/\b(utilize|implement)\b/g, 'use')
        .replace(/\b(however)\b/g, 'but');
      break;
    case 'moderate':
      // More significant changes
      humanizedText = text
        .replace(/\b(is|are)\b/g, match => `${match} actually`)
        .replace(/\b(utilize|implement)\b/g, 'use')
        .replace(/\b(however)\b/g, 'but')
        .replace(/\b(therefore)\b/g, 'so')
        .replace(/\b(subsequently)\b/g, 'then')
        .replace(/\., /g, '. Well, ');
      break;
    case 'substantial':
      // Major rewriting
      humanizedText = text
        .replace(/\b(is|are)\b/g, match => `${match} actually`)
        .replace(/\b(utilize|implement)\b/g, 'use')
        .replace(/\b(however)\b/g, 'but')
        .replace(/\b(therefore)\b/g, 'so')
        .replace(/\b(subsequently)\b/g, 'then')
        .replace(/\., /g, '. Well, ')
        .replace(/\b(additionally|furthermore)\b/g, 'also')
        .replace(/\b(commenced)\b/g, 'started')
        .replace(/\b(concluded)\b/g, 'ended');
      
      // Add some conversational elements
      humanizedText = `So, ${humanizedText}`;
      humanizedText = humanizedText.replace(/\./g, '...');
      break;
    default:
      // Default to slight changes
      humanizedText = text
        .replace(/\b(utilize|implement)\b/g, 'use')
        .replace(/\b(however)\b/g, 'but');
  }
  
  return humanizedText;
};

// Helper to calculate credits needed based on text length
const calculateCreditsNeeded = (text: string): number => {
  const charCount = text.length;
  
  if (charCount <= 500) return 1;
  if (charCount <= 1000) return 2;
  if (charCount <= 2000) return 4;
  if (charCount <= 5000) return 10;
  return 20; // 5000+ chars
};

/**
 * @swagger
 * /text/humanize:
 *   post:
 *     summary: Humanize AI-generated text
 *     description: Transforms AI-generated text into more natural, human-like content based on the selected level
 *     tags:
 *       - Text
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The AI-generated text to humanize
 *               level:
 *                 type: string
 *                 description: The intensity level of humanization
 *                 enum: [slight, moderate, substantial]
 *                 default: moderate
 *               useRealAPI:
 *                 type: boolean
 *                 description: Whether to use the real Undetectable AI API or mock implementation
 *                 default: false
 *     responses:
 *       201:
 *         description: Text successfully humanized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created text analysis
 *                 originalText:
 *                   type: string
 *                   description: The original AI-generated text
 *                 humanizedText:
 *                   type: string
 *                   description: The humanized text
 *                 characterCount:
 *                   type: integer
 *                   description: The number of characters in the original text
 *                 creditsUsed:
 *                   type: integer
 *                   description: The number of credits used for this operation
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the text was humanized
 *       400:
 *         description: Bad request - missing text
 *       401:
 *         description: Unauthorized - user not authenticated
 *       403:
 *         description: Forbidden - insufficient credits
 *       500:
 *         description: Server error
 */
router.post('/humanize', authMiddleware, async (req, res) => {
  try {
    const { text, level = 'moderate', useRealAPI = false } = req.body;
    const userId = req.user?.id;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const creditsNeeded = calculateCreditsNeeded(text);
    
    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, creditsNeeded);
    if (!hasCredits) {
      return res.status(403).json({ 
        message: 'Insufficient credits',
        creditsNeeded
      });
    }
    
    // Call either the real API or the mock function
    let humanizedText;
    try {
      if (useRealAPI && UNDETECTABLE_API_KEY !== 'your-api-key-here') {
        humanizedText = await callUndetectableAPI(text, level);
      } else {
        humanizedText = await mockHumanizeText(text, level);
      }
    } catch (apiError) {
      console.error('Humanization API error:', apiError);
      // Fallback to mock if real API fails
      humanizedText = await mockHumanizeText(text, level);
    }
    
    // Save the text analysis
    const textAnalysis = await TextAnalysis.create({
      userId,
      originalText: text,
      humanizedText,
      characterCount: text.length
    });
    
    // Deduct credits from user's subscription
    await deductCredits(userId, creditsNeeded);
    
    // Update user statistics
    await updateUserStatistics(userId, text.length, creditsNeeded, level);
    
    res.status(201).json({
      id: textAnalysis.id,
      originalText: text,
      humanizedText,
      characterCount: text.length,
      creditsUsed: creditsNeeded,
      createdAt: textAnalysis.createdAt
    });
  } catch (error) {
    console.error('Text humanization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /text/history:
 *   get:
 *     summary: Get user's text humanization history
 *     description: Retrieves the history of text humanizations for the authenticated user
 *     tags:
 *       - Text
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: List of text humanizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of text humanizations
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the text analysis
 *                       userId:
 *                         type: string
 *                         description: The ID of the user
 *                       originalText:
 *                         type: string
 *                         description: The original AI-generated text
 *                       humanizedText:
 *                         type: string
 *                         description: The humanized text
 *                       characterCount:
 *                         type: integer
 *                         description: The number of characters in the original text
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the text was humanized
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Server error
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await TextAnalysis.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      total: count,
      page,
      limit,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching text history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /text/{id}:
 *   get:
 *     summary: Get a specific text analysis
 *     description: Retrieves a specific text analysis by ID
 *     tags:
 *       - Text
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the text analysis
 *     responses:
 *       200:
 *         description: Text analysis details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the text analysis
 *                 userId:
 *                   type: string
 *                   description: The ID of the user
 *                 originalText:
 *                   type: string
 *                   description: The original AI-generated text
 *                 humanizedText:
 *                   type: string
 *                   description: The humanized text
 *                 characterCount:
 *                   type: integer
 *                   description: The number of characters in the original text
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the text was humanized
 *       401:
 *         description: Unauthorized - user not authenticated
 *       404:
 *         description: Text analysis not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const textId = req.params.id;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const textAnalysis = await TextAnalysis.findOne({
      where: {
        id: textId,
        userId
      }
    });
    
    if (!textAnalysis) {
      return res.status(404).json({ message: 'Text analysis not found' });
    }
    
    res.json(textAnalysis);
  } catch (error) {
    console.error('Error fetching text analysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 