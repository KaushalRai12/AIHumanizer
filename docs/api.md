# API Documentation

This document provides detailed information about the API endpoints available in the AI Humanizer application.

## Base URL

For local development: `http://localhost:3001`
For production: `https://api.ai-humanizer.com` (placeholder)

## Swagger Documentation

API documentation is available via Swagger UI at:
```
http://localhost:3001/api-docs
```

The Swagger UI provides an interactive interface to explore and test all API endpoints.

## Authentication

Most API endpoints require authentication. To authenticate API requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

All endpoints follow a standard error response format:

```json
{
  "message": "Error message describing what went wrong"
}
```

HTTP status codes:
- `400 Bad Request` - Invalid input or validation failure
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Not enough permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## API Endpoints

### Authentication

#### Register a new user

```
POST /api/auth/signup
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

#### Login user

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### Text Analysis

#### Humanize text

```
POST /api/text/humanize
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Request body:
```json
{
  "text": "Text to be humanized",
  "level": "moderate" // Options: "slight", "moderate", "substantial"
}
```

Response:
```json
{
  "id": 123,
  "originalText": "Text to be humanized",
  "humanizedText": "Humanized version of the text",
  "characterCount": 20,
  "creditsUsed": 1,
  "createdAt": "2024-06-12T15:30:00Z"
}
```

#### Get text history

```
GET /api/text/history
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `sortBy` (optional): Field to sort by (default: "createdAt")
- `order` (optional): Sort order, "asc" or "desc" (default: "desc")

Response:
```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 123,
      "originalText": "Text to be humanized",
      "humanizedText": "Humanized version of the text",
      "characterCount": 20,
      "createdAt": "2024-06-12T15:30:00Z"
    },
    // More items...
  ]
}
```

#### Get specific text analysis

```
GET /api/text/:id
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Path parameters:
- `id`: ID of the text analysis

Response:
```json
{
  "id": 123,
  "originalText": "Text to be humanized",
  "humanizedText": "Humanized version of the text",
  "characterCount": 20,
  "createdAt": "2024-06-12T15:30:00Z",
  "updatedAt": "2024-06-12T15:30:00Z"
}
```

### User Management

#### Get current user profile

```
GET /api/users/me
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-06-01T10:00:00Z"
}
```

#### Update user profile

```
PUT /api/users/me
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Request body:
```json
{
  "name": "John Updated",
  "email": "new-email@example.com"
}
```

Response:
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "new-email@example.com",
  "updatedAt": "2024-06-12T16:00:00Z"
}
```

#### Get user credit information

```
GET /api/users/credits
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "userId": 1,
  "planType": "basic",
  "creditsTotal": 1000,
  "creditsUsed": 50,
  "creditsRemaining": 950,
  "subscriptionEnds": "2024-07-12T00:00:00Z"
}
```

### Subscription Management

#### Get available subscription plans

```
GET /api/subscriptions
```

Response:
```json
[
  {
    "id": "free",
    "name": "Free",
    "description": "Basic features with limited credits",
    "price": 0,
    "interval": "month",
    "credits": 100,
    "features": ["Basic humanization", "Limited history"]
  },
  {
    "id": "basic",
    "name": "Basic",
    "description": "Standard features with more credits",
    "price": 9.99,
    "interval": "month",
    "credits": 1000,
    "features": ["Standard humanization", "Full history", "Export options"]
  },
  {
    "id": "pro",
    "name": "Professional",
    "description": "Advanced features with plenty of credits",
    "price": 19.99,
    "interval": "month",
    "credits": 5000,
    "features": ["Advanced humanization", "Full history", "Export options", "Priority support"]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "description": "All features with unlimited credits",
    "price": 49.99,
    "interval": "month",
    "credits": -1, // -1 means unlimited
    "features": ["All features", "Unlimited credits", "API access", "24/7 support"]
  }
]
```

#### Create a new subscription

```
POST /api/subscriptions
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Request body:
```json
{
  "planId": "basic",
  "paymentMethodId": "pm_card_visa" // Stripe payment method ID
}
```

Response:
```json
{
  "id": 42,
  "planId": "basic",
  "userId": 1,
  "status": "active",
  "creditsTotal": 1000,
  "creditsUsed": 0,
  "startDate": "2024-06-12T16:30:00Z",
  "endDate": "2024-07-12T16:30:00Z"
}
```

#### Update subscription

```
PUT /api/subscriptions/:id
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Path parameters:
- `id`: Subscription ID

Request body:
```json
{
  "planId": "pro"
}
```

Response:
```json
{
  "id": 42,
  "planId": "pro",
  "userId": 1,
  "status": "active",
  "creditsTotal": 5000,
  "creditsUsed": 0,
  "startDate": "2024-06-12T16:30:00Z",
  "endDate": "2024-07-12T16:30:00Z"
}
```

### Admin Endpoints

> Note: All admin endpoints require both authentication and admin privileges.

#### Get all users

```
GET /api/admin/users
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

Response:
```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "isAdmin": false,
      "createdAt": "2024-06-01T10:00:00Z"
    },
    // More items...
  ]
}
```

#### Get specific user details

```
GET /api/admin/user/:id
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Path parameters:
- `id`: User ID

Response:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2024-06-01T10:00:00Z",
    "subscription": {
      "planType": "basic",
      "creditsTotal": 5000,
      "creditsUsed": 150
    },
    "statistics": {
      "textsProcessed": 15,
      "charactersProcessed": 7500
    }
  },
  "textCount": 15
}
```

#### Get platform statistics

```
GET /api/admin/stats
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "totalUsers": 156,
  "newUsers": 12,
  "totalTexts": 1250,
  "newTexts": 85,
  "charactersProcessed": 625000,
  "subscriptionsByPlan": [
    {
      "planType": "free",
      "count": 100
    },
    {
      "planType": "basic",
      "count": 35
    },
    {
      "planType": "pro",
      "count": 18
    },
    {
      "planType": "enterprise",
      "count": 3
    }
  ]
}
```

#### Grant admin privileges

```
POST /api/admin/make-admin/:id
```

Request headers:
```
Authorization: Bearer <jwt_token>
```

Path parameters:
- `id`: User ID

Response:
```json
{
  "message": "Admin privileges granted successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": true
  }
}
```

## Webhook Endpoints

### Payment Webhooks

```
POST /api/webhooks/stripe
```

This endpoint is used by Stripe to notify the application about payment-related events such as subscription renewals, failed payments, etc. It is not meant to be called directly by clients. 