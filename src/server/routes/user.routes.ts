import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { User } from '../models/user.model';
import { Subscription } from '../models/subscription.model';
import { TextStatistics } from '../models/textStatistics.model';

const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    // Return updated user without password
    const { password, ...updatedUser } = user.toJSON();
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user credit information
router.get('/credits', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const subscription = await Subscription.findOne({
      where: {
        userId,
        active: true
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    const creditsRemaining = subscription.creditsTotal - subscription.creditsUsed;
    
    res.json({
      userId: subscription.userId,
      planType: subscription.planType,
      creditsTotal: subscription.creditsTotal,
      creditsUsed: subscription.creditsUsed,
      creditsRemaining,
      subscriptionEnds: subscription.endDate
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const statistics = await TextStatistics.findOne({
      where: { userId }
    });
    
    if (!statistics) {
      return res.json({
        userId,
        totalTransformations: 0,
        totalCharactersProcessed: 0,
        totalCreditsSpent: 0,
        averageTextLength: 0,
        popularTransformationLevel: 'moderate',
        lastActivityDate: null
      });
    }
    
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 