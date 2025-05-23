import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { Subscription } from '../models/subscription.model';

const router = express.Router();

// Available subscription plans
const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features with limited credits',
    price: 0,
    interval: 'month',
    credits: 100,
    features: ['Basic humanization', 'Limited history']
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Standard features with more credits',
    price: 9.99,
    interval: 'month',
    credits: 1000,
    features: ['Standard humanization', 'Full history', 'Export options']
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Advanced features with plenty of credits',
    price: 19.99,
    interval: 'month',
    credits: 5000,
    features: ['Advanced humanization', 'Full history', 'Export options', 'Priority support']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'All features with unlimited credits',
    price: 49.99,
    interval: 'month',
    credits: -1, // -1 means unlimited
    features: ['All features', 'Unlimited credits', 'API access', '24/7 support']
  }
];

// Get available subscription plans
router.get('/', async (req, res) => {
  try {
    res.json(subscriptionPlans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new subscription (upgrade or change plan)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { planId } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Check if plan exists
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }
    
    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      where: {
        userId,
        active: true
      }
    });
    
    // If user has an active subscription, deactivate it
    if (existingSubscription) {
      existingSubscription.active = false;
      await existingSubscription.save();
    }
    
    // Create new subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    const newSubscription = await Subscription.create({
      userId,
      planType: plan.id,
      creditsTotal: plan.credits,
      creditsUsed: 0,
      startDate,
      endDate,
      active: true
    });
    
    res.status(201).json({
      id: newSubscription.id,
      planId: plan.id,
      userId,
      status: 'active',
      creditsTotal: plan.credits,
      creditsUsed: 0,
      startDate,
      endDate
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subscription - This would typically involve payment processing
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const userId = req.user?.id;
    const { planId } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Check if plan exists
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }
    
    // Find subscription
    const subscription = await Subscription.findOne({
      where: {
        id: subscriptionId,
        userId
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Update subscription
    subscription.planType = plan.id;
    subscription.creditsTotal = plan.credits;
    await subscription.save();
    
    res.json({
      id: subscription.id,
      planId: plan.id,
      userId,
      status: 'active',
      creditsTotal: plan.credits,
      creditsUsed: subscription.creditsUsed,
      startDate: subscription.startDate,
      endDate: subscription.endDate
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 