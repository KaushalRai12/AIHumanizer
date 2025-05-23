import dotenv from 'dotenv';
import { sequelize } from '../src/server/config/database';

// Load environment variables from .env file
dotenv.config();

// Increase timeout for all tests
jest.setTimeout(10000);

// Global setup - runs once before all tests
beforeAll(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Test database connection established successfully.');
    
    // Sync database models
    await sequelize.sync({ force: true });
    console.log('Test database models synchronized successfully.');
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
});

// Global teardown - runs once after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed.');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
}); 