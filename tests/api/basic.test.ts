import request from 'supertest';
import app, { initializeDatabase } from './app';

describe('Basic API Tests', () => {
  // Test database connection before running tests
  beforeAll(async () => {
    const dbConnected = await initializeDatabase();
    expect(dbConnected).toBe(true);
  });

  it('should return a welcome message on root endpoint', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('API Test Server');
  });
}); 