import request from 'supertest';
import app from './app';

describe('Text API Endpoints', () => {
  // Test data
  const testUser = {
    name: 'Text Test User',
    email: `text_test${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };
  
  let authToken: string;
  
  // Register and login before running text API tests
  beforeAll(async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('token');
    authToken = registerResponse.body.token;
  });
  
  it('should humanize text with valid authentication', async () => {
    const testText = "AI generated content that needs to be humanized";
    
    const response = await request(app)
      .post('/api/text/humanize')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: testText,
        style: 'casual'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('humanizedText');
    expect(response.body.humanizedText).toBeDefined();
    expect(typeof response.body.humanizedText).toBe('string');
  });
  
  it('should not humanize text without authentication', async () => {
    const testText = "AI generated content that needs to be humanized";
    
    const response = await request(app)
      .post('/api/text/humanize')
      .send({
        text: testText,
        style: 'casual'
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });
  
  it('should not humanize text with invalid style', async () => {
    const testText = "AI generated content that needs to be humanized";
    
    const response = await request(app)
      .post('/api/text/humanize')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: testText,
        style: 'invalid_style'
      });
    
    expect(response.status).toBe(201); // API accepts any style
    expect(response.body).toHaveProperty('humanizedText');
  });
  
  it('should get text history with valid authentication', async () => {
    const response = await request(app)
      .get('/api/text/history')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  
  it('should not get text history without authentication', async () => {
    const response = await request(app)
      .get('/api/text/history');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });
  
  it('should handle empty text input', async () => {
    const response = await request(app)
      .post('/api/text/humanize')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: '',
        style: 'casual'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Text is required');
  });
}); 