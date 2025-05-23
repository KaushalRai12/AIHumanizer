import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from '../../src/server/config/database';
import authRoutes from '../../src/server/routes/auth.routes';
import textRoutes from '../../src/server/routes/text.routes';
import userRoutes from '../../src/server/routes/user.routes';
import subscriptionRoutes from '../../src/server/routes/subscription.routes';
import adminRoutes from '../../src/server/routes/admin.routes';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/text', textRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API Test Server' });
});

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established for testing');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database for testing:', error);
    return false;
  }
};

export default app; 