import request from 'supertest';
import app from './app';

describe('User API Endpoints', () => {
  // Test data
  const testUser = {
    name: 'User Profile Test',
    email: `user_test${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };
  
  let authToken: string;
  
  // Register and login before running user API tests
  beforeAll(async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('token');
    authToken = registerResponse.body.token;
  });
  
  it('should get user profile with valid authentication', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', testUser.email);
    expect(response.body).toHaveProperty('name', testUser.name);
  });
  
  it('should update user profile with valid authentication', async () => {
    const updatedName = 'Updated User Name';
    
    const response = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: updatedName
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', updatedName);
    expect(response.body).toHaveProperty('email', testUser.email);
  });
  
  it('should not update profile without authentication', async () => {
    const updatedName = 'Another Updated Name';
    
    const response = await request(app)
      .put('/api/users/me')
      .send({
        name: updatedName
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });
  
  it('should not update profile with invalid data', async () => {
    const response = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        email: 'invalid-email'
      });
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Server error');
  });
  
  it('should get user credits with valid authentication', async () => {
    const response = await request(app)
      .get('/api/users/credits')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('creditsRemaining');
    expect(response.body).toHaveProperty('creditsTotal');
    expect(response.body).toHaveProperty('creditsUsed');
    expect(response.body).toHaveProperty('planType');
    expect(response.body).toHaveProperty('subscriptionEnds');
    expect(response.body).toHaveProperty('userId');
  });
  
  it('should not get credits without authentication', async () => {
    const response = await request(app)
      .get('/api/users/credits');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });
  
  it('should handle profile update with empty name', async () => {
    const response = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: ''
      });
    
    expect(response.status).toBe(200); // API accepts empty name but does not update
    expect(response.body).toHaveProperty('name', 'Updated User Name');
  });
}); 