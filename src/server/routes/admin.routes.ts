import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { User } from '../models/user.model';
import { TextAnalysis } from '../models/textAnalysis.model';
import { Subscription } from '../models/subscription.model';
import { TextStatistics } from '../models/textStatistics.model';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';

const router = express.Router();

// Apply both authentication and admin middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves all users (admin access required)
 *     tags:
 *       - Admin
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
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin access
 *       500:
 *         description: Server error
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] }, // Exclude password from results
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
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /admin/user/{id}:
 *   get:
 *     summary: Get a specific user
 *     description: Retrieves details for a specific user (admin access required)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Subscription, as: 'subscription' },
        { model: TextStatistics, as: 'statistics' }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Count text analyses for this user
    const textCount = await TextAnalysis.count({
      where: { userId }
    });
    
    res.json({
      user,
      textCount
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     description: Retrieves overall statistics for the platform (admin access required)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin access
 *       500:
 *         description: Server error
 */
router.get('/stats', async (req, res) => {
  try {
    // Get total counts
    const userCount = await User.count();
    const textCount = await TextAnalysis.count();
    
    // Get counts for the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: lastWeek
        }
      }
    });
    
    const newTexts = await TextAnalysis.count({
      where: {
        createdAt: {
          [Op.gte]: lastWeek
        }
      }
    });
    
    // Calculate total characters processed
    const stats = await TextAnalysis.sum('characterCount');
    
    // Get subscription counts by plan type
    const subscriptions = await Subscription.findAll({
      attributes: ['planType', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['planType']
    });
    
    res.json({
      totalUsers: userCount,
      newUsers,
      totalTexts: textCount,
      newTexts,
      charactersProcessed: stats || 0,
      subscriptionsByPlan: subscriptions
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /admin/make-admin/{id}:
 *   post:
 *     summary: Give admin privileges to a user
 *     description: Grants admin access to a specified user (admin access required)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Admin privileges granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/make-admin/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({ isAdmin: true });
    
    res.json({
      message: 'Admin privileges granted successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 