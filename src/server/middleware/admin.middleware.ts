import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

// Middleware to check if user is an admin - removing the redundant interface extension
// since it's already defined in auth.middleware.ts

// Middleware to check if user is an admin
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find the user and check if they have admin role
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Check if user is admin (this assumes your User model has an isAdmin field)
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 