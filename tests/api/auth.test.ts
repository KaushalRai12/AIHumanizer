import request from 'supertest';
import app from './app';

describe('Auth API Endpoints', () => {
  // Test data
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };
  
  let authToken: string;
  
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testUser.email);
    expect(response.body.user).toHaveProperty('name', testUser.name);
    
    // Save token for subsequent tests
    authToken = response.body.token;
  });
  
  it('should not allow registration with an existing email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });
  
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testUser.email);
    
    // Update token for subsequent tests
    authToken = response.body.token;
  });
  
  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrong_password'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
  
  it('should get current user profile with valid token', async () => {
    expect(authToken).toBeDefined();
    
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', testUser.email);
    expect(response.body).toHaveProperty('name', testUser.name);
  });
  
  it('should not get profile without token', async () => {
    const response = await request(app)
      .get('/api/users/me');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });
  
  it('should not get profile with invalid token', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid_token');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Token is not valid');
  });
}); 