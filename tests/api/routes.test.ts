import request from 'supertest';
import app from './app';
import express from 'express';

// Function to get all registered routes in an Express app
function getRegisteredRoutes(app: express.Application): string[] {
  const routes: string[] = [];
  
  // @ts-ignore - Accessing private property for diagnostic purposes
  const stack = app._router.stack;
  
  function print(path: string, layer: any) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter(method => layer.route.methods[method])
        .map(method => method.toUpperCase());
      
      routes.push(`${methods.join(',')} ${path}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Process sub-routers
      layer.handle.stack.forEach((stackItem: any) => {
        print((path === '/' ? '' : path) + (layer.regexp.source === "^\\/?$" ? "" : layer.regexp.source.replace(/\\/g, '').replace(/\(\?:\(\[\^\\\/\]\+\?\)\)/g, ':$1').replace(/\(\?:\(\[\^\\\/\]\+\?\)\)/g, ':$1').replace(/\(\?:\(\.\+\?\)\)/g, ':$1').replace(/\(\?:\(\[\^\?\]\+\?\)\)/g, ':$1')), stackItem);
      });
    }
  }
  
  stack.forEach((layer: any) => {
    print('', layer);
  });
  
  return routes;
}

describe('API Routes Exploration', () => {
  it('should list all available API routes', () => {
    const routes = getRegisteredRoutes(app);
    
    console.log('Available routes:');
    routes.forEach(route => {
      console.log(` - ${route}`);
    });
    
    expect(routes.length).toBeGreaterThan(0);
  });
  
  it('should test root endpoint', async () => {
    const response = await request(app).get('/');
    console.log('Root endpoint response:', response.status, response.body);
    expect(response.status).toBe(200);
  });
  
  // Test some potential API endpoints
  it('should explore API endpoint structure', async () => {
    // Try different variations of the auth endpoint
    const endpointsToTest = [
      '/api/auth',
      '/api',
      '/auth',
      '/api/auth/signup',
      '/api/v1/auth/register',
      '/register',
      '/signup',
      '/login'
    ];
    
    for (const endpoint of endpointsToTest) {
      const response = await request(app).get(endpoint);
      console.log(`GET ${endpoint} response:`, response.status);
    }
  });
}); 